"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function SubmitPage() {
    const { user } = useUser();
    const [message, setMessage] = useState("");
    const [name, setName] = useState(user?.fullName || "");
    const [profession, setProfession] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    // Image upload state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Update name when user loads
    if (user?.fullName && !name && !isAnonymous) {
        setName(user.fullName);
    }

    function handleImageSelect(file: File | null) {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be under 5MB");
            return;
        }
        if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
            setError("Only JPEG, PNG, WebP, and GIF images are allowed");
            return;
        }
        setError("");
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    }

    function removeImage() {
        setImageFile(null);
        setImagePreview(null);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let attachmentUrl = null;

            // Upload image if selected
            if (imageFile) {
                setUploadingImage(true);
                const formData = new FormData();
                formData.append("file", imageFile);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadRes.ok) {
                    const data = await uploadRes.json();
                    throw new Error(data.error || "Failed to upload image");
                }

                const uploadData = await uploadRes.json();
                attachmentUrl = uploadData.url;
                setUploadingImage(false);
            }

            const res = await fetch("/api/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message,
                    name: isAnonymous ? "" : name,
                    profession: isAnonymous ? "" : profession,
                    is_anonymous: isAnonymous,
                    attachment_url: attachmentUrl,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to submit testimonial");
            }

            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
            setUploadingImage(false);
        }
    }

    if (submitted) {
        return (
            <div
                style={{
                    minHeight: "80vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem",
                }}
            >
                <div
                    className="card animate-fade-in-up"
                    style={{
                        maxWidth: "32rem",
                        width: "100%",
                        padding: "3rem 2rem",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            width: "4rem",
                            height: "4rem",
                            borderRadius: "9999px",
                            background: "linear-gradient(135deg, #34d399, #10b981)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 1.5rem",
                            fontSize: "1.75rem",
                            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
                        }}
                    >
                        ✓
                    </div>
                    <h2
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            color: "var(--color-foreground)",
                            marginBottom: "0.75rem",
                        }}
                    >
                        Thank you! 🎉
                    </h2>
                    <p
                        style={{
                            color: "var(--color-muted)",
                            fontSize: "0.9375rem",
                            lineHeight: 1.6,
                            marginBottom: "2rem",
                        }}
                    >
                        Your testimonial has been submitted and is awaiting review. It will appear on the Wall once approved.
                    </p>
                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="/" className="btn-primary" style={{ textDecoration: "none" }}>
                            ✦ View the Wall
                        </a>
                        <a href="/dashboard" className="btn-outline" style={{ textDecoration: "none" }}>
                            My Testimonials
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "80vh",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                padding: "3rem 1.5rem",
            }}
        >
            <div style={{ maxWidth: "36rem", width: "100%" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <div
                        className="animate-fade-in-up"
                        style={{
                            display: "inline-block",
                            padding: "0.375rem 1rem",
                            borderRadius: "9999px",
                            border: "1px solid var(--color-border)",
                            fontSize: "0.8125rem",
                            color: "var(--color-muted)",
                            marginBottom: "1rem",
                            background: "var(--color-muted-light)",
                        }}
                    >
                        ✍ Share your experience
                    </div>
                    <h1
                        className="animate-fade-in-up gradient-text"
                        style={{
                            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                            lineHeight: 1.1,
                            animationDelay: "0.1s",
                            opacity: 0,
                            animationFillMode: "forwards",
                        }}
                    >
                        Write a Testimonial
                    </h1>
                    <p
                        className="animate-fade-in-up"
                        style={{
                            color: "var(--color-muted)",
                            fontSize: "0.9375rem",
                            marginTop: "0.75rem",
                            animationDelay: "0.2s",
                            opacity: 0,
                            animationFillMode: "forwards",
                        }}
                    >
                        Your honest feedback helps others and means the world to us.
                    </p>
                </div>

                {/* Form */}
                <div
                    className="card animate-fade-in-up"
                    style={{
                        padding: "2rem",
                        animationDelay: "0.3s",
                        opacity: 0,
                        animationFillMode: "forwards",
                    }}
                >
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        {/* Anonymous toggle */}
                        <label
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                cursor: "pointer",
                                userSelect: "none",
                                padding: "0.875rem 1rem",
                                borderRadius: "0.75rem",
                                border: `1px solid ${isAnonymous ? "var(--color-primary)" : "var(--color-border)"}`,
                                background: isAnonymous ? "var(--color-primary-light)" : "transparent",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                style={{ width: "1rem", height: "1rem", accentColor: "var(--color-primary)" }}
                            />
                            <div>
                                <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-foreground)" }}>
                                    Remain anonymous
                                </p>
                                <p style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                                    Your name and profile photo won&apos;t be shown
                                </p>
                            </div>
                        </label>

                        {/* Name & Profession row */}
                        {!isAnonymous && (
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-muted)", marginBottom: "0.5rem" }}>
                                        Your Name
                                    </label>
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required={!isAnonymous}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-muted)", marginBottom: "0.5rem" }}>
                                        Profession <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span>
                                    </label>
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Developer, Designer…"
                                        value={profession}
                                        onChange={(e) => setProfession(e.target.value)}
                                        maxLength={80}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Message */}
                        <div>
                            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-muted)", marginBottom: "0.5rem" }}>
                                Your Testimonial <span style={{ color: "var(--color-danger)", fontSize: "0.75rem" }}>*</span>
                            </label>
                            <textarea
                                className="input"
                                rows={5}
                                placeholder="Share your experience — what was the most helpful, what stood out, and how it made a difference…"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                style={{ resize: "vertical" }}
                            />
                            <p style={{ fontSize: "0.6875rem", color: "var(--color-muted)", marginTop: "0.375rem", textAlign: "right" }}>
                                {message.length} characters
                            </p>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-muted)", marginBottom: "0.5rem" }}>
                                Attach an Image <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span>
                            </label>

                            {!imagePreview ? (
                                <label
                                    htmlFor="image-upload"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        handleImageSelect(e.dataTransfer.files[0]);
                                    }}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "0.5rem",
                                        padding: "2rem",
                                        border: "2px dashed var(--color-border)",
                                        borderRadius: "0.75rem",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        background: "var(--color-muted-light)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = "var(--color-primary)";
                                        e.currentTarget.style.background = "var(--color-primary-light)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = "var(--color-border)";
                                        e.currentTarget.style.background = "var(--color-muted-light)";
                                    }}
                                >
                                    <span style={{ fontSize: "1.75rem" }}>📎</span>
                                    <p style={{ fontSize: "0.875rem", color: "var(--color-muted)", textAlign: "center" }}>
                                        <strong style={{ color: "var(--color-primary)" }}>Click to upload</strong> or drag & drop
                                    </p>
                                    <p style={{ fontSize: "0.6875rem", color: "var(--color-muted)" }}>JPEG, PNG, WebP, GIF · max 5MB</p>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        style={{ display: "none" }}
                                        onChange={(e) => handleImageSelect(e.target.files?.[0] || null)}
                                    />
                                </label>
                            ) : (
                                <div
                                    style={{
                                        borderRadius: "0.75rem",
                                        overflow: "hidden",
                                        border: "1px solid var(--color-border)",
                                        position: "relative",
                                    }}
                                >
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        width={500}
                                        height={500}
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            maxHeight: "320px",
                                            objectFit: "contain",
                                            backgroundColor: "var(--color-muted-light)",
                                            display: "block",
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        style={{
                                            position: "absolute",
                                            top: "0.75rem",
                                            right: "0.75rem",
                                            width: "2rem",
                                            height: "2rem",
                                            borderRadius: "9999px",
                                            background: "rgba(0,0,0,0.6)",
                                            border: "none",
                                            color: "white",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                style={{
                                    padding: "0.875rem 1rem",
                                    borderRadius: "0.75rem",
                                    background: "var(--color-danger-light)",
                                    border: "1px solid rgba(248,113,113,0.2)",
                                    color: "var(--color-danger)",
                                    fontSize: "0.875rem",
                                }}
                            >
                                ⚠ {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ width: "100%", padding: "0.875rem" }}
                        >
                            {loading
                                ? uploadingImage
                                    ? "📤 Uploading image…"
                                    : "⏳ Submitting…"
                                : "Submit Testimonial →"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
