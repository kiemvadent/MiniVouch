"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import Image from "next/image";
import Link from "next/link";
import { Clock, CheckCircle2, XCircle, Pencil, Trash2, UploadCloud } from "lucide-react";

interface Testimonial {
    id: string;
    name: string;
    message: string;
    profession?: string | null;
    is_anonymous: boolean;
    image_url?: string | null;
    attachment_url?: string | null;
    status: "pending" | "approved" | "rejected";
    created_at: string;
}

type FilterTab = "all" | "pending" | "approved" | "rejected";

export default function DashboardPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<FilterTab>("all");

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editMessage, setEditMessage] = useState("");
    const [editProfession, setEditProfession] = useState("");
    const [editName, setEditName] = useState("");
    const [editSaving, setEditSaving] = useState(false);
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const [editUploadingImage, setEditUploadingImage] = useState(false);
    const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
    const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null);
    const [editUploadingAvatar, setEditUploadingAvatar] = useState(false);
    const [editIsAnonymous, setEditIsAnonymous] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editError, setEditError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/testimonials/user")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setTestimonials(data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const openEdit = (t: Testimonial) => {
        setEditingId(t.id);
        setEditMessage(t.message);
        setEditName(t.name);
        setEditProfession(t.profession || "");
        setEditIsAnonymous(t.is_anonymous);
        setEditImageFile(null);
        setEditImagePreview(t.attachment_url || null);
        setEditAvatarFile(null);
        setEditAvatarPreview(t.image_url || null);
        setEditError(null);
    };

    function handleEditImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return;
        setEditImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setEditImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    }

    function handleEditAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return;
        setEditAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setEditAvatarPreview(reader.result as string);
        reader.readAsDataURL(file);
    }

    const handleEdit = async () => {
        if (!editingId) return;
        setEditSaving(true);
        setEditError(null);

        let finalAttachmentUrl = editImagePreview;
        let finalAvatarUrl = editAvatarPreview;

        try {
            if (editImageFile) {
                setEditUploadingImage(true);
                const formData = new FormData();
                formData.append("file", editImageFile);
                const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    finalAttachmentUrl = uploadData.url;
                } else {
                    throw new Error("Failed to upload attachment image");
                }
                setEditUploadingImage(false);
            }

            if (editAvatarFile) {
                setEditUploadingAvatar(true);
                const formData = new FormData();
                formData.append("file", editAvatarFile);
                const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    finalAvatarUrl = uploadData.url;
                } else {
                    throw new Error("Failed to upload profile photo");
                }
                setEditUploadingAvatar(true);
            }

            const res = await fetch("/api/testimonials", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingId,
                    message: editMessage,
                    name: editIsAnonymous ? "" : editName,
                    profession: editIsAnonymous ? "" : editProfession,
                    is_anonymous: editIsAnonymous,
                    attachment_url: finalAttachmentUrl,
                    image_url: finalAvatarUrl
                }),
            });

            if (res.ok) {
                const updated = await res.json();
                setTestimonials((prev) => prev.map((t) => t.id === editingId ? { ...t, ...updated } : t));
                setEditingId(null);
            } else {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to update testimonial");
            }
        } catch (err: any) {
            console.error("Edit testimonial failed:", err);
            setEditError(err.message || "An unexpected error occurred");
        } finally {
            setEditSaving(false);
            setEditUploadingImage(false);
            setEditUploadingAvatar(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        const res = await fetch("/api/testimonials", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) {
            setTestimonials((prev) => prev.filter((t) => t.id !== id));
        }
        setDeletingId(null);
        setDeleteConfirmId(null);
    };

    const counts = {
        all: testimonials.length,
        pending: testimonials.filter((t) => t.status === "pending").length,
        approved: testimonials.filter((t) => t.status === "approved").length,
        rejected: testimonials.filter((t) => t.status === "rejected").length,
    };

    const filtered =
        activeTab === "all"
            ? testimonials
            : testimonials.filter((t) => t.status === activeTab);

    const tabs: { key: FilterTab; label: string; color: string }[] = [
        { key: "all", label: "All", color: "var(--color-primary)" },
        { key: "pending", label: "Pending", color: "#fbbf24" },
        { key: "approved", label: "Approved", color: "#34d399" },
        { key: "rejected", label: "Rejected", color: "#f87171" },
    ];

    return (
        <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "3rem 1.5rem" }}>
            {/* Header */}
            <div
                className="animate-fade-in-up"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "2rem",
                    flexWrap: "wrap",
                    gap: "1rem",
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: "1.75rem",
                            fontWeight: 800,
                            letterSpacing: "-0.025em",
                            color: "var(--color-foreground)",
                            marginBottom: "0.5rem",
                        }}
                    >
                        My <span className="gradient-text">Testimonials</span>
                    </h1>
                    <p style={{ color: "var(--color-muted)", fontSize: "0.9375rem" }}>
                        Track the status of your submitted testimonials.
                    </p>
                </div>
                <Link
                    href="/submit"
                    className="btn-primary"
                    style={{ textDecoration: "none", fontSize: "0.8125rem" }}
                >
                    + Submit New
                </Link>
            </div>

            {/* Stats Cards */}
            {!loading && testimonials.length > 0 && (
                <div
                    className="animate-fade-in-up"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "0.75rem",
                        marginBottom: "1.5rem",
                        animationDelay: "0.1s",
                        opacity: 0,
                        animationFillMode: "forwards",
                    }}
                >
                    {[
                        { label: "Pending", count: counts.pending, color: "#fbbf24", bg: "rgba(251, 191, 36, 0.08)", icon: <Clock size={20} /> },
                        { label: "Approved", count: counts.approved, color: "#34d399", bg: "rgba(52, 211, 153, 0.08)", icon: <CheckCircle2 size={20} /> },
                        { label: "Rejected", count: counts.rejected, color: "#f87171", bg: "rgba(248, 113, 113, 0.08)", icon: <XCircle size={20} /> },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="card"
                            style={{
                                padding: "1rem 1.25rem",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "1.5rem",
                                    fontWeight: 800,
                                    color: stat.color,
                                    marginBottom: "0.25rem",
                                }}
                            >
                                {stat.count}
                            </div>
                            <div
                                style={{
                                    fontSize: "0.75rem",
                                    color: "var(--color-muted)",
                                    fontWeight: 500,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Progress Bar */}
            {!loading && testimonials.length > 0 && (
                <div
                    className="card animate-fade-in-up"
                    style={{
                        padding: "1rem 1.25rem",
                        marginBottom: "1.5rem",
                        animationDelay: "0.15s",
                        opacity: 0,
                        animationFillMode: "forwards",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "0.5rem",
                            fontSize: "0.75rem",
                            color: "var(--color-muted)",
                            fontWeight: 500,
                        }}
                    >
                        <span>Review Progress</span>
                        <span>
                            {counts.approved + counts.rejected} / {counts.all} reviewed
                        </span>
                    </div>
                    <div
                        style={{
                            width: "100%",
                            height: "6px",
                            borderRadius: "9999px",
                            backgroundColor: "var(--color-muted-light)",
                            overflow: "hidden",
                            display: "flex",
                        }}
                    >
                        {counts.approved > 0 && (
                            <div
                                style={{
                                    width: `${(counts.approved / counts.all) * 100}%`,
                                    height: "100%",
                                    background: "linear-gradient(90deg, #34d399, #10b981)",
                                    transition: "width 0.5s ease",
                                }}
                            />
                        )}
                        {counts.rejected > 0 && (
                            <div
                                style={{
                                    width: `${(counts.rejected / counts.all) * 100}%`,
                                    height: "100%",
                                    background: "linear-gradient(90deg, #f87171, #ef4444)",
                                    transition: "width 0.5s ease",
                                }}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            {!loading && testimonials.length > 0 && (
                <div
                    className="animate-fade-in-up"
                    style={{
                        display: "flex",
                        gap: "0.25rem",
                        marginBottom: "1.5rem",
                        padding: "0.25rem",
                        backgroundColor: "var(--color-muted-light)",
                        borderRadius: "0.75rem",
                        width: "fit-content",
                        border: "1px solid var(--color-border)",
                        animationDelay: "0.2s",
                        opacity: 0,
                        animationFillMode: "forwards",
                    }}
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                padding: "0.5rem 0.875rem",
                                borderRadius: "0.5rem",
                                border: "none",
                                fontSize: "0.8125rem",
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                backgroundColor:
                                    activeTab === tab.key
                                        ? "var(--color-background-secondary)"
                                        : "transparent",
                                color:
                                    activeTab === tab.key
                                        ? tab.color
                                        : "var(--color-muted)",
                                boxShadow:
                                    activeTab === tab.key
                                        ? "0 1px 3px rgba(0,0,0,0.2)"
                                        : "none",
                            }}
                        >
                            {tab.label}
                            <span
                                style={{
                                    marginLeft: "0.375rem",
                                    fontSize: "0.6875rem",
                                    opacity: 0.7,
                                }}
                            >
                                {counts[tab.key]}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
                    <div className="loader" />
                </div>
            )}

            {/* Empty */}
            {!loading && testimonials.length === 0 && (
                <div
                    className="card animate-fade-in-up"
                    style={{
                        padding: "4rem 2rem",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            width: "4rem",
                            height: "4rem",
                            borderRadius: "1rem",
                            background: "linear-gradient(135deg, #818cf8, #c084fc)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.75rem",
                            color: "white",
                            fontWeight: 900,
                            margin: "0 auto 1.25rem",
                            boxShadow: "0 8px 24px rgba(129, 140, 248, 0.25)",
                            animation: "float 3s ease-in-out infinite",
                        }}
                    >
                        ✦
                    </div>
                    <p
                        style={{
                            fontWeight: 600,
                            fontSize: "1.0625rem",
                            color: "var(--color-foreground)",
                            marginBottom: "0.5rem",
                        }}
                    >
                        No testimonials yet
                    </p>
                    <p style={{ color: "var(--color-muted)", fontSize: "0.9375rem", marginBottom: "1.5rem" }}>
                        You haven&apos;t submitted any testimonials yet. Share your experience!
                    </p>
                    <Link
                        href="/submit"
                        className="btn-primary"
                        style={{
                            textDecoration: "none",
                            display: "inline-flex",
                        }}
                    >
                        Submit One Now
                    </Link>
                </div>
            )}

            {/* No results for filter */}
            {!loading && testimonials.length > 0 && filtered.length === 0 && (
                <div
                    className="card animate-fade-in"
                    style={{
                        padding: "3rem 2rem",
                        textAlign: "center",
                    }}
                >
                    <p style={{ color: "var(--color-muted)", fontSize: "0.9375rem" }}>
                        No {activeTab} testimonials.
                    </p>
                </div>
            )}

            {/* Testimonials List */}
            {!loading && filtered.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {filtered.map((t, i) => (
                        <div
                            key={t.id}
                            className="card animate-fade-in-up"
                            style={{
                                padding: "1.25rem 1.5rem",
                                animationDelay: `${0.25 + i * 0.05}s`,
                                opacity: 0,
                                animationFillMode: "forwards",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    gap: "1rem",
                                }}
                            >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    {/* Attachment (Read Only) */}


                                    {editingId === t.id ? (
                                        <div style={{
                                            marginBottom: "1rem",
                                            borderRadius: "1rem",
                                            border: "1px solid var(--color-border)",
                                            background: "rgba(0,0,0,0.02)",
                                            display: "flex",
                                            flexDirection: "column",
                                            overflow: "hidden"
                                        }}>
                                            {/* Body */}
                                            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                                {/* Anonymous toggle */}
                                                <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", padding: "0.75rem", borderRadius: "0.75rem", border: `1px solid ${editIsAnonymous ? "var(--color-primary)" : "var(--color-border)"}`, background: editIsAnonymous ? "var(--color-primary-light)" : "transparent" }}>
                                                    <input type="checkbox" checked={editIsAnonymous} onChange={(e) => setEditIsAnonymous(e.target.checked)} style={{ width: "1rem", height: "1rem" }} />
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>Remain anonymous</p>
                                                        <p style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>Your identity won&apos;t be shown</p>
                                                    </div>
                                                </label>

                                                <div style={{ height: "1px", background: "var(--color-border)", opacity: 0.5 }} />

                                                {/* Photo, Name, Profession */}
                                                {!editIsAnonymous && (
                                                    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                                                            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-muted)" }}>Photo</label>
                                                            <div style={{ width: "3.5rem", height: "3.5rem", position: "relative" }}>
                                                                {editAvatarPreview ? (
                                                                    <div style={{ width: "100%", height: "100%", position: "relative" }}>
                                                                        <img src={editAvatarPreview} alt="Avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--color-border)" }} />
                                                                        <button type="button" onClick={() => { setEditAvatarFile(null); setEditAvatarPreview(null); }} style={{ position: "absolute", top: -4, right: -4, background: "var(--color-background)", border: "1px solid var(--color-border)", borderRadius: "50%", width: "1.25rem", height: "1.25rem", cursor: "pointer", fontSize: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center" }} title="Remove photo">✕</button>
                                                                    </div>
                                                                ) : (
                                                                    <label style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--color-muted-light)", border: "1px dashed var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "1.25rem", color: "var(--color-muted)" }}>
                                                                        +
                                                                        <input type="file" accept="image/*" onChange={handleEditAvatarChange} style={{ display: "none" }} />
                                                                    </label>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                                                            <div>
                                                                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-muted)", display: "block", marginBottom: "0.375rem" }}>Name</label>
                                                                <input className="input" type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Full Name" style={{ width: "100%" }} />
                                                            </div>
                                                            <div>
                                                                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-muted)", display: "block", marginBottom: "0.375rem" }}>Profession</label>
                                                                <input className="input" type="text" value={editProfession} onChange={(e) => setEditProfession(e.target.value)} placeholder="Developer, Designer" style={{ width: "100%" }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Message */}
                                                <div>
                                                    <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-muted)", display: "block", marginBottom: "0.375rem" }}>Testimonial Message</label>
                                                    <textarea
                                                        value={editMessage}
                                                        onChange={(e) => setEditMessage(e.target.value)}
                                                        className="input"
                                                        rows={4}
                                                        style={{ width: "100%", resize: "vertical" }}
                                                        placeholder="Write your experience here..."
                                                    />
                                                </div>

                                                <div style={{ height: "1px", background: "var(--color-border)", opacity: 0.5 }} />

                                                {/* Attachment Image */}
                                                <div>
                                                    <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-muted)", display: "block", marginBottom: "0.75rem" }}>Attachment Image (Optional)</label>
                                                    {editImagePreview ? (
                                                        <div style={{ position: "relative", borderRadius: "0.75rem", overflow: "hidden", border: "1px solid var(--color-border)", background: "var(--color-background)" }}>
                                                            <img src={editImagePreview} alt="Preview" style={{ width: "100%", maxHeight: "300px", objectFit: "contain", display: "block" }} />
                                                            <button onClick={() => { setEditImageFile(null); setEditImagePreview(null); }} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "50%", width: "1.75rem", height: "1.75rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Remove image">✕</button>
                                                        </div>
                                                    ) : (
                                                        <label style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem", border: "2px dashed var(--color-border)", borderRadius: "0.75rem", cursor: "pointer", color: "var(--color-muted)", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--color-primary)"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--color-border)"}>
                                                            <UploadCloud size={28} />
                                                            <span style={{ fontSize: "0.875rem", marginTop: "0.75rem", fontWeight: 500 }}>Upload an image</span>
                                                            <span style={{ fontSize: "0.75rem", marginTop: "0.25rem", opacity: 0.7 }}>PNG, JPG, GIF up to 5MB</span>
                                                            <input type="file" accept="image/*" onChange={handleEditImageChange} style={{ display: "none" }} />
                                                        </label>
                                                    )}
                                                </div>

                                                {/* Error Message */}
                                                {editError && (
                                                    <div style={{ padding: "0.75rem", borderRadius: "0.75rem", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", fontSize: "0.8125rem", border: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                        <XCircle size={16} />
                                                        {editError}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer Buttons */}
                                            <div style={{ padding: "1.25rem 1.5rem", background: "rgba(0,0,0,0.03)", borderTop: "1px solid var(--color-border)", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                                                <button onClick={() => setEditingId(null)} className="btn-outline" style={{ padding: "0.625rem 1.5rem", fontSize: "0.875rem" }}>
                                                    Cancel
                                                </button>
                                                <button onClick={handleEdit} disabled={editSaving || editUploadingImage || editUploadingAvatar || !editMessage.trim()} className="btn-primary" style={{ padding: "0.625rem 2rem", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                    {(editSaving || editUploadingImage || editUploadingAvatar) && <span className="loader" style={{ width: "1rem", height: "1rem", borderWidth: "2px" }} />}
                                                    {editSaving || editUploadingImage || editUploadingAvatar ? "Processing..." : "Save Testimonial"}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Header matching Wall Card */}
                                            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "1rem" }}>
                                                <div style={{ flexShrink: 0 }}>
                                                    {!t.is_anonymous && t.image_url ? (
                                                        <img src={t.image_url} alt={t.name} style={{ width: "2.5rem", height: "2.5rem", borderRadius: "999px", objectFit: "cover", border: "2px solid var(--color-primary-light)" }} />
                                                    ) : (
                                                        <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "999px", background: "linear-gradient(135deg, #818cf8, #c084fc)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
                                                            {t.is_anonymous ? "?" : t.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-foreground)" }}>{t.is_anonymous ? "Anonymous" : t.name}</p>
                                                    {!t.is_anonymous && t.profession && (
                                                        <p style={{ fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 500 }}>{t.profession}</p>
                                                    )}
                                                    <p style={{ fontSize: "0.6875rem", color: "var(--color-muted)", marginTop: "0.1rem" }}>
                                                        {new Date(t.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                                        {t.is_anonymous && " · Identity Hidden"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Attachment matching Wall Card */}
                                            {t.attachment_url && (
                                                <div style={{ marginBottom: "1rem", borderRadius: "0.75rem", overflow: "hidden", border: "1px solid var(--color-border)", background: "var(--color-background-secondary)" }}>
                                                    <img src={t.attachment_url} alt="Attachment" style={{ width: "100%", maxHeight: "220px", objectFit: "contain" }} />
                                                </div>
                                            )}

                                            <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--color-card-foreground)" }}>{t.message}</p>
                                        </>
                                    )}
                                </div>
                                <StatusBadge status={t.status} />
                            </div>

                            {/* Edit/Delete actions — only for pending and not editing */}
                            {t.status === "pending" && editingId !== t.id && (
                                <div style={{
                                    display: "flex", gap: "0.5rem", marginTop: "1rem",
                                    paddingTop: "1rem", borderTop: "1px solid var(--color-border)",
                                    justifyContent: "flex-end", alignItems: "center"
                                }}>
                                    {deleteConfirmId === t.id ? (
                                        <>
                                            <span style={{ fontSize: "0.8125rem", color: "var(--color-muted)", marginRight: "auto" }}>Are you sure?</span>
                                            <button
                                                onClick={() => setDeleteConfirmId(null)}
                                                style={{
                                                    padding: "0.4rem 1rem", borderRadius: "99px",
                                                    border: "1px solid var(--color-border)",
                                                    background: "transparent", color: "var(--color-foreground)",
                                                    fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer",
                                                    transition: "background 0.2s"
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-muted-light)")}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleDelete(t.id)}
                                                disabled={deletingId === t.id}
                                                style={{
                                                    padding: "0.4rem 1rem", borderRadius: "99px", border: "1px solid rgba(248,113,113,0.3)",
                                                    background: "rgba(248,113,113,0.1)", color: "#f87171",
                                                    fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
                                                    transition: "background 0.2s"
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.2)")}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.1)")}
                                            >
                                                {deletingId === t.id ? "Deleting…" : "Confirm Delete"}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => openEdit(t)}
                                                style={{
                                                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                                                    padding: "0.4rem 1rem", borderRadius: "99px",
                                                    border: "1px solid var(--color-border)",
                                                    background: "transparent", color: "var(--color-muted)",
                                                    fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer",
                                                    transition: "all 0.2s"
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = "var(--color-foreground)";
                                                    e.currentTarget.style.borderColor = "var(--color-muted)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = "var(--color-muted)";
                                                    e.currentTarget.style.borderColor = "var(--color-border)";
                                                }}
                                            >
                                                <Pencil size={14} /> Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirmId(t.id)}
                                                style={{
                                                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                                                    padding: "0.4rem 1rem", borderRadius: "99px",
                                                    border: "1px solid transparent",
                                                    background: "transparent", color: "var(--color-muted)",
                                                    fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer",
                                                    transition: "all 0.2s"
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = "#f87171";
                                                    e.currentTarget.style.background = "rgba(248,113,113,0.1)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = "var(--color-muted)";
                                                    e.currentTarget.style.background = "transparent";
                                                }}
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
