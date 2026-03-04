"use client";

import { useEffect, useState } from "react";
import { TestimonialCard } from "@/components/testimonial-card";
import Link from "next/link";

interface Testimonial {
    id: string;
    name: string;
    profession?: string | null;
    message: string;
    is_anonymous: boolean;
    image_url?: string | null;
    attachment_url?: string | null;
    created_at: string;
}

export default function HomePage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(9); // Pagination state

    useEffect(() => {
        fetch("/api/testimonials")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setTestimonials(data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const visibleTestimonials = testimonials.slice(0, visibleCount);
    const hasMore = visibleCount < testimonials.length;

    return (
        <div className="glow">
            {/* Hero Section */}
            <div
                style={{
                    textAlign: "center",
                    padding: "5rem 1.5rem 3rem",
                    maxWidth: "72rem",
                    margin: "0 auto",
                }}
            >
                <div
                    className="animate-fade-in-up"
                    style={{
                        display: "inline-block",
                        padding: "0.375rem 1rem",
                        borderRadius: "9999px",
                        border: "1px solid var(--color-border)",
                        fontSize: "0.8125rem",
                        color: "var(--color-muted)",
                        marginBottom: "1.5rem",
                        background: "var(--color-muted-light)",
                    }}
                >
                    ✦ Real feedback from real people
                </div>
                <h1
                    className="animate-fade-in-up"
                    style={{
                        fontSize: "clamp(2rem, 5vw, 3.5rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.04em",
                        lineHeight: 1.1,
                        marginBottom: "1rem",
                        animationDelay: "0.1s",
                        opacity: 0,
                        animationFillMode: "forwards",
                    }}
                >
                    What People Are{" "}
                    <span className="gradient-text">Saying</span>
                </h1>
                <p
                    className="animate-fade-in-up"
                    style={{
                        fontSize: "1.125rem",
                        color: "var(--color-muted)",
                        maxWidth: "36rem",
                        margin: "0 auto 2rem",
                        lineHeight: 1.6,
                        animationDelay: "0.2s",
                        opacity: 0,
                        animationFillMode: "forwards",
                    }}
                >
                    Discover genuine experiences shared by our community.
                    Your voice matters — share yours too.
                </p>
                <div
                    className="animate-fade-in-up"
                    style={{
                        animationDelay: "0.3s",
                        opacity: 0,
                        animationFillMode: "forwards",
                    }}
                >
                    <Link
                        href="/submit"
                        className="btn-primary"
                        style={{ textDecoration: "none", padding: "0.75rem 2rem", fontSize: "0.9375rem" }}
                    >
                        Share Your Experience →
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem 1.5rem" }}>
                {/* Loading State */}
                {loading && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "4rem 0",
                        }}
                    >
                        <div className="loader" />
                    </div>
                )}

                {/* Empty State */}
                {!loading && testimonials.length === 0 && (
                    <div
                        className="card animate-fade-in"
                        style={{
                            padding: "4rem 2rem",
                            textAlign: "center",
                            maxWidth: "28rem",
                            margin: "0 auto",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "3rem",
                                marginBottom: "1rem",
                                animation: "float 3s ease-in-out infinite",
                            }}
                        >
                            ✦
                        </p>
                        <p
                            style={{
                                fontSize: "1.125rem",
                                fontWeight: 600,
                                color: "var(--color-foreground)",
                                marginBottom: "0.5rem",
                            }}
                        >
                            No testimonials yet
                        </p>
                        <p
                            style={{
                                color: "var(--color-muted)",
                                fontSize: "0.9375rem",
                                marginBottom: "1.5rem",
                            }}
                        >
                            Be the first to share your experience!
                        </p>
                        <Link
                            href="/submit"
                            className="btn-primary"
                            style={{ textDecoration: "none" }}
                        >
                            Write a Testimonial
                        </Link>
                    </div>
                )}

                {/* Testimonials Grid */}
                {!loading && testimonials.length > 0 && (
                    <>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "1.5rem",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "0.8125rem",
                                    color: "var(--color-muted)",
                                    fontWeight: 500,
                                }}
                            >
                                Showing {visibleTestimonials.length} of {testimonials.length} testimonial{testimonials.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                        {/* Masonry layout via CSS columns — 2 cols for visual balance */}
                        <div
                            style={{
                                columns: "2 380px",
                                columnGap: "1.25rem",
                            }}
                        >
                            {visibleTestimonials.map((t, i) => (
                                <div
                                    key={t.id}
                                    className="animate-fade-in-up"
                                    style={{
                                        display: "inline-block",
                                        width: "100%",
                                        marginBottom: "1.25rem",
                                        animationDelay: `${(i % 9) * 0.05}s`,
                                        opacity: 0,
                                        animationFillMode: "forwards",
                                        verticalAlign: "top",
                                        breakInside: "avoid",
                                    }}
                                >
                                    <TestimonialCard {...t} />
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
                                <button
                                    onClick={() => setVisibleCount((prev) => prev + 9)}
                                    className="btn-outline"
                                    style={{ padding: "0.75rem 2.5rem", fontSize: "0.9375rem" }}
                                >
                                    Load More →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
