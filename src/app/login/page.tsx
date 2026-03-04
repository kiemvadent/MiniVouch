"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "/";

    const contextMap: Record<string, { title: string; subtitle: string }> = {
        "/submit": {
            title: "Share your experience",
            subtitle: "Sign in to leave a testimonial and let others know about your experience.",
        },
        "/dashboard": {
            title: "Your testimonials",
            subtitle: "Sign in to track the status of testimonials you've submitted.",
        },
        "/admin": {
            title: "Mini Anon's corner",
            subtitle: "This area is reserved. Sign in to continue — your identity will be verified.",
        },
    };

    const ctx = contextMap[next] ?? {
        title: "Welcome to MiniVouch",
        subtitle: "Sign in to continue and unlock the full experience.",
    };

    return (
        <div
            style={{
                minHeight: "85vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem 1.5rem",
            }}
        >
            <div
                className="card animate-fade-in-up"
                style={{
                    width: "100%",
                    maxWidth: "28rem",
                    padding: "3rem 2.5rem",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Glow bg accent */}
                <div
                    style={{
                        position: "absolute",
                        top: "-4rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "14rem",
                        height: "14rem",
                        background: "radial-gradient(circle, rgba(129,140,248,0.12) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }}
                />

                {/* Logo icon — same as navbar: gradient box with ✦ */}
                <div
                    style={{
                        width: "5rem",
                        height: "5rem",
                        borderRadius: "1.25rem",
                        background: "linear-gradient(135deg, #818cf8, #c084fc)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2.5rem",
                        color: "white",
                        fontWeight: 900,
                        margin: "0 auto 1.75rem",
                        boxShadow: "0 12px 32px rgba(129, 140, 248, 0.3)",
                        animation: "float 3s ease-in-out infinite",
                    }}
                >
                    ✦
                </div>

                {/* Title */}
                <h1
                    className="gradient-text"
                    style={{
                        fontSize: "1.625rem",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        marginBottom: "0.75rem",
                    }}
                >
                    {ctx.title}
                </h1>

                {/* Subtitle */}
                <p
                    style={{
                        color: "var(--color-muted)",
                        fontSize: "0.9375rem",
                        lineHeight: 1.65,
                        marginBottom: "2.25rem",
                    }}
                >
                    {ctx.subtitle}
                </p>

                {/* CTAs */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <SignInButton mode="modal" forceRedirectUrl={next}>
                        <button className="btn-primary" style={{ width: "100%", padding: "0.875rem", fontSize: "0.9375rem" }}>
                            Sign in →
                        </button>
                    </SignInButton>

                    <SignUpButton mode="modal" forceRedirectUrl={next}>
                        <button className="btn-outline" style={{ width: "100%", padding: "0.875rem", fontSize: "0.9375rem" }}>
                            Create an account
                        </button>
                    </SignUpButton>
                </div>

                {/* Divider note */}
                <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: "var(--color-muted)", lineHeight: 1.5 }}>
                    By continuing, you agree to our community guidelines.
                    <br />
                    Your identity is secured by{" "}
                    <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>Clerk</span>.
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginContent />
        </Suspense>
    );
}
