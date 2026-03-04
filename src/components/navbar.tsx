"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";
import { useTheme } from "@/components/theme-provider";

export function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const links = [
        { href: "/", label: "Wall", icon: "✦" },
        { href: "/submit", label: "Submit", icon: "✍" },
        { href: "/dashboard", label: "My Testimonials", icon: "📊" },
    ];

    return (
        <nav
            style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                backdropFilter: "blur(20px)",
                backgroundColor: "rgba(11, 15, 26, 0.8)",
                borderBottom: "1px solid var(--color-border)",
            }}
        >
            <div
                style={{
                    maxWidth: "72rem",
                    margin: "0 auto",
                    padding: "0 1.5rem",
                    height: "4rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                    <Link
                        href="/"
                        style={{
                            fontSize: "1.25rem",
                            fontWeight: 800,
                            background: "linear-gradient(135deg, #818cf8, #c084fc)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            textDecoration: "none",
                            letterSpacing: "-0.03em",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}
                    >
                        ✦ MiniVouch
                    </Link>

                    {/* Desktop Links */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                        }}
                        className="desktop-nav"
                    >
                        {links.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    style={{
                                        padding: "0.5rem 0.875rem",
                                        borderRadius: "0.5rem",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        color: isActive
                                            ? "var(--color-primary)"
                                            : "var(--color-muted)",
                                        backgroundColor: isActive
                                            ? "var(--color-primary-light)"
                                            : "transparent",
                                        textDecoration: "none",
                                        transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.color =
                                                "var(--color-foreground)";
                                            e.currentTarget.style.backgroundColor =
                                                "var(--color-muted-light)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.color =
                                                "var(--color-muted)";
                                            e.currentTarget.style.backgroundColor =
                                                "transparent";
                                        }
                                    }}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="btn-primary" style={{ fontSize: "0.8125rem", padding: "0.5rem 1.25rem" }}>
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    {/* Auth & Theme Container */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderLeft: "1px solid var(--color-border)", paddingLeft: "1rem", marginLeft: "0.25rem" }}>
                        <SignedIn>
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: {
                                            width: "2rem",
                                            height: "2rem",
                                            boxShadow: "0 0 0 2px var(--color-border)",
                                        },
                                    },
                                }}
                            />
                        </SignedIn>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            style={{
                                width: "2rem",
                                height: "2rem",
                                borderRadius: "9999px",
                                border: "1px solid var(--color-border)",
                                background: "var(--color-muted-light)",
                                color: "var(--color-muted)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s ease",
                                flexShrink: 0,
                                padding: 0,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "var(--color-primary-light)";
                                e.currentTarget.style.borderColor = "var(--color-primary)";
                                e.currentTarget.style.color = "var(--color-primary)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "var(--color-muted-light)";
                                e.currentTarget.style.borderColor = "var(--color-border)";
                                e.currentTarget.style.color = "var(--color-muted)";
                            }}
                        >
                            {theme === "dark" ? (
                                /* Sun icon */
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="4" />
                                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                                </svg>
                            ) : (
                                /* Moon icon */
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="mobile-toggle"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{
                            display: "none",
                            padding: "0.5rem",
                            background: "transparent",
                            border: "1px solid var(--color-border)",
                            borderRadius: "0.5rem",
                            color: "var(--color-muted)",
                            cursor: "pointer",
                            fontSize: "1.125rem",
                            lineHeight: 1,
                        }}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div
                    className="mobile-menu"
                    style={{
                        padding: "0.5rem 1.5rem 1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                        borderTop: "1px solid var(--color-border)",
                    }}
                >
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                style={{
                                    padding: "0.75rem 1rem",
                                    borderRadius: "0.5rem",
                                    fontSize: "0.9375rem",
                                    fontWeight: 500,
                                    color: isActive
                                        ? "var(--color-primary)"
                                        : "var(--color-muted)",
                                    backgroundColor: isActive
                                        ? "var(--color-primary-light)"
                                        : "transparent",
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                }}
                            >
                                <span>{link.icon}</span>
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            )}

            <style>{`
                @media (max-width: 640px) {
                    .desktop-nav { display: none !important; }
                    .mobile-toggle { display: block !important; }
                }
                @media (min-width: 641px) {
                    .mobile-menu { display: none !important; }
                }
            `}</style>
        </nav>
    );
}
