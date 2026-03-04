"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import Image from "next/image";
import Link from "next/link";

interface Testimonial {
    id: string;
    user_id: string;
    name: string;
    message: string;
    is_anonymous: boolean;
    image_url?: string | null;
    attachment_url?: string | null;
    status: "pending" | "approved" | "rejected";
    created_at: string;
}

type Tab = "pending" | "approved" | "rejected";

export default function AdminPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>("pending");
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [unauthorized, setUnauthorized] = useState(false);

    useEffect(() => {
        loadTestimonials();
    }, []);

    async function loadTestimonials() {
        setLoading(true);
        try {
            const res = await fetch("/api/testimonials/admin");
            if (res.status === 403) {
                setUnauthorized(true);
                setLoading(false);
                return;
            }
            const data = await res.json();
            if (Array.isArray(data)) {
                setTestimonials(data);
            }
        } catch {
            // Handle error silently
        }
        setLoading(false);
    }

    async function updateStatus(id: string, status: string) {
        setActionLoading(id);
        try {
            await fetch("/api/testimonials/admin", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });
            setTestimonials((prev) =>
                prev.map((t) =>
                    t.id === id ? { ...t, status: status as Testimonial["status"] } : t
                )
            );
        } catch {
            // Handle error silently
        }
        setActionLoading(null);
    }

    async function deleteTestimonial(id: string) {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;
        setActionLoading(id);
        try {
            await fetch("/api/testimonials/admin", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            setTestimonials((prev) => prev.filter((t) => t.id !== id));
        } catch {
            // Handle error silently
        }
        setActionLoading(null);
    }

    // Beautiful unauthorized view
    if (unauthorized) {
        return (
            <div
                style={{
                    minHeight: "calc(100vh - 4rem)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem",
                }}
            >
                <div
                    className="animate-fade-in-up"
                    style={{
                        maxWidth: "28rem",
                        textAlign: "center",
                    }}
                >
                    {/* Gradient ✦ logo — same as navbar */}
                    <div
                        style={{
                            width: "6rem",
                            height: "6rem",
                            borderRadius: "1.5rem",
                            background: "linear-gradient(135deg, #818cf8, #c084fc)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "2.75rem",
                            color: "white",
                            fontWeight: 900,
                            margin: "0 auto 2rem",
                            boxShadow: "0 12px 32px rgba(129, 140, 248, 0.3)",
                            animation: "float 3s ease-in-out infinite",
                        }}
                    >
                        ✦
                    </div>
                    <h2
                        style={{
                            fontSize: "1.75rem",
                            fontWeight: 800,
                            marginBottom: "0.75rem",
                            letterSpacing: "-0.025em",
                        }}
                    >
                        <span className="gradient-text">Mini Anon&apos;s</span> private space
                    </h2>
                    <p
                        style={{
                            color: "var(--color-muted)",
                            fontSize: "1rem",
                            lineHeight: 1.6,
                            marginBottom: "0.5rem",
                        }}
                    >
                        This area is intentionally private — it&apos;s where Mini Anon reviews and curates testimonials.
                    </p>
                    <p
                        style={{
                            color: "var(--color-muted)",
                            fontSize: "0.875rem",
                            lineHeight: 1.6,
                            marginBottom: "2rem",
                            opacity: 0.7,
                        }}
                    >
                        If you&apos;re here to leave a testimonial, head over to the Submit page — Mini Anon would love to hear from you! ✨
                    </p>
                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                        <Link
                            href="/"
                            className="btn-primary"
                            style={{ textDecoration: "none" }}
                        >
                            Back to Home
                        </Link>
                        <Link
                            href="/submit"
                            className="btn-outline"
                            style={{ textDecoration: "none" }}
                        >
                            Leave a Testimonial
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const filtered = testimonials.filter((t) => t.status === activeTab);
    const tabs: Tab[] = ["pending", "approved", "rejected"];

    return (
        <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "3rem 1.5rem" }}>
            <div className="animate-fade-in-up" style={{ marginBottom: "2rem" }}>
                <h1
                    style={{
                        fontSize: "1.75rem",
                        fontWeight: 800,
                        letterSpacing: "-0.025em",
                        color: "var(--color-foreground)",
                        marginBottom: "0.5rem",
                    }}
                >
                    Admin <span className="gradient-text">Panel</span>
                </h1>
                <p style={{ color: "var(--color-muted)", fontSize: "0.9375rem" }}>
                    Manage submitted testimonials. Approve, reject, or delete entries.
                </p>
            </div>

            {/* Tabs */}
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
                    animationDelay: "0.1s",
                    opacity: 0,
                    animationFillMode: "forwards",
                }}
            >
                {tabs.map((tab) => {
                    const count = testimonials.filter((t) => t.status === tab).length;
                    const colorMap = {
                        pending: "#fbbf24",
                        approved: "#34d399",
                        rejected: "#f87171",
                    };
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: "0.5rem 1rem",
                                borderRadius: "0.5rem",
                                border: "none",
                                fontSize: "0.8125rem",
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                backgroundColor:
                                    activeTab === tab
                                        ? "var(--color-background-secondary)"
                                        : "transparent",
                                color:
                                    activeTab === tab
                                        ? colorMap[tab]
                                        : "var(--color-muted)",
                                boxShadow:
                                    activeTab === tab
                                        ? "0 1px 3px rgba(0,0,0,0.2)"
                                        : "none",
                            }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            <span
                                style={{
                                    marginLeft: "0.375rem",
                                    fontSize: "0.6875rem",
                                    opacity: 0.7,
                                }}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Loading */}
            {loading && (
                <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
                    <div className="loader" />
                </div>
            )}

            {/* Empty */}
            {!loading && filtered.length === 0 && (
                <div
                    className="card animate-fade-in"
                    style={{ padding: "3rem 2rem", textAlign: "center" }}
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
                                animationDelay: `${0.15 + i * 0.05}s`,
                                opacity: 0,
                                animationFillMode: "forwards",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: "0.75rem",
                                }}
                            >
                                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                                    {/* Avatar */}
                                    <div
                                        style={{
                                            width: "2.5rem",
                                            height: "2.5rem",
                                            borderRadius: "9999px",
                                            background: "var(--color-muted-light)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "var(--color-muted)",
                                            fontSize: "0.875rem",
                                            fontWeight: 600,
                                            flexShrink: 0,
                                            overflow: "hidden",
                                        }}
                                    >
                                        {t.image_url ? (
                                            <Image
                                                src={t.image_url}
                                                alt={t.name}
                                                width={40}
                                                height={40}
                                                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                            />
                                        ) : (
                                            t.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <p
                                            style={{
                                                fontWeight: 600,
                                                fontSize: "0.9375rem",
                                                color: "var(--color-foreground)",
                                            }}
                                        >
                                            {t.is_anonymous ? "Anonymous" : t.name}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "var(--color-muted)",
                                                marginTop: "0.125rem",
                                            }}
                                        >
                                            {new Date(t.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <StatusBadge status={t.status} />
                            </div>

                            {/* Attachment Image */}
                            {t.attachment_url && (
                                <div
                                    style={{
                                        borderRadius: "0.75rem",
                                        overflow: "hidden",
                                        border: "1px solid var(--color-border)",
                                        marginBottom: "1rem",
                                        maxWidth: "300px",
                                    }}
                                >
                                    <Image
                                        src={t.attachment_url}
                                        alt="Attachment"
                                        width={500}
                                        height={500}
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            maxHeight: "300px",
                                            objectFit: "contain",
                                            backgroundColor: "var(--color-muted-light)",
                                            display: "block",
                                        }}
                                    />
                                </div>
                            )}

                            <p
                                style={{
                                    fontSize: "0.9375rem",
                                    lineHeight: 1.7,
                                    color: "var(--color-card-foreground)",
                                    marginBottom: "1rem",
                                }}
                            >
                                {t.message}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "0.5rem",
                                    borderTop: "1px solid var(--color-border)",
                                    paddingTop: "0.75rem",
                                }}
                            >
                                {t.status !== "approved" && (
                                    <button
                                        className="btn-success"
                                        onClick={() => updateStatus(t.id, "approved")}
                                        disabled={actionLoading === t.id}
                                    >
                                        Approve
                                    </button>
                                )}
                                {t.status !== "rejected" && (
                                    <button
                                        className="btn-outline"
                                        onClick={() => updateStatus(t.id, "rejected")}
                                        disabled={actionLoading === t.id}
                                        style={{
                                            fontSize: "0.8125rem",
                                        }}
                                    >
                                        Reject
                                    </button>
                                )}
                                <button
                                    className="btn-danger"
                                    onClick={() => deleteTestimonial(t.id)}
                                    disabled={actionLoading === t.id}
                                    style={{ marginLeft: "auto" }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
}
