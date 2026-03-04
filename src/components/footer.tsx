"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer
            style={{
                borderTop: "1px solid var(--color-border)",
                padding: "1.25rem 1.5rem",
            }}
        >
            <div
                style={{
                    maxWidth: "72rem",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem",
                }}
            >
                {/* Left — Branding: "Mini Anon" links to Buy Me a Coffee */}
                <p style={{ color: "var(--color-muted)", fontSize: "0.8125rem" }}>
                    Made with 💙 by{" "}
                    <a
                        href="https://buymeacoffee.com/tusharbhardwaj"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: "var(--color-primary)",
                            fontWeight: 600,
                            textDecoration: "none",
                            borderBottom: "1px dotted var(--color-primary)",
                            transition: "opacity 0.2s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                    >
                        Mini Anon
                    </a>
                </p>

                {/* Right — MiniLink + Admin Door */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-muted)", fontStyle: "italic" }}>
                        Find me on
                    </span>

                    {/* MiniLink — no icon */}
                    <a
                        href="https://linktr.ee/minianon"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            padding: "0.375rem 0.875rem",
                            borderRadius: "9999px",
                            border: "1px solid var(--color-border)",
                            background: "var(--color-muted-light)",
                            color: "var(--color-foreground)",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "var(--color-primary)";
                            e.currentTarget.style.color = "var(--color-primary)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--color-border)";
                            e.currentTarget.style.color = "var(--color-foreground)";
                        }}
                    >
                        MiniLink
                    </a>

                    <span style={{ color: "var(--color-border)" }}>·</span>

                    {/* Admin entry — subtle but visible */}
                    <Link
                        href="/admin"
                        style={{
                            padding: "0.375rem 0.875rem",
                            borderRadius: "9999px",
                            border: "1px solid rgba(129, 140, 248, 0.25)",
                            background: "rgba(129, 140, 248, 0.06)",
                            color: "var(--color-muted)",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
                            (e.currentTarget as HTMLElement).style.color = "var(--color-primary)";
                            (e.currentTarget as HTMLElement).style.background = "var(--color-primary-light)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(129, 140, 248, 0.25)";
                            (e.currentTarget as HTMLElement).style.color = "var(--color-muted)";
                            (e.currentTarget as HTMLElement).style.background = "rgba(129, 140, 248, 0.06)";
                        }}
                    >
                        ✦ Are you Mini Anon?
                    </Link>
                </div>
            </div>
        </footer>
    );
}
