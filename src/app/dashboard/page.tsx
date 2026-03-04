"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import Image from "next/image";
import Link from "next/link";

interface Testimonial {
    id: string;
    name: string;
    message: string;
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
                        { label: "Pending", count: counts.pending, color: "#fbbf24", bg: "rgba(251, 191, 36, 0.08)", icon: "⏳" },
                        { label: "Approved", count: counts.approved, color: "#34d399", bg: "rgba(52, 211, 153, 0.08)", icon: "✓" },
                        { label: "Rejected", count: counts.rejected, color: "#f87171", bg: "rgba(248, 113, 113, 0.08)", icon: "✕" },
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
                                    <p
                                        style={{
                                            fontSize: "0.9375rem",
                                            lineHeight: 1.7,
                                            color: "var(--color-card-foreground)",
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        {t.message}
                                    </p>

                                    {/* Attachment */}
                                    {t.attachment_url && (
                                        <div
                                            style={{
                                                borderRadius: "0.5rem",
                                                overflow: "hidden",
                                                border: "1px solid var(--color-border)",
                                                marginBottom: "0.5rem",
                                                maxWidth: "200px",
                                            }}
                                        >
                                            <Image
                                                src={t.attachment_url}
                                                alt="Attachment"
                                                width={200}
                                                height={120}
                                                style={{
                                                    width: "100%",
                                                    height: "auto",
                                                    display: "block",
                                                }}
                                            />
                                        </div>
                                    )}

                                    <p style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                                        {new Date(t.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                        {t.is_anonymous && " · Anonymous"}
                                    </p>
                                </div>
                                <StatusBadge status={t.status} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
