"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

const skillGroups = [
    { label: "Programming", items: ["C++", "Python", "JavaScript", "TypeScript", "Go", "SQL"] },
    { label: "Frameworks", items: ["React.js", "Next.js", "Node.js", "Express.js", "Tailwind CSS"] },
    { label: "ML / AI", items: ["Gemini API", "Vapi AI", "Pinecone", "Vector Database"] },
    { label: "Databases", items: ["MongoDB", "PostgreSQL", "Firebase", "Prisma ORM"] },
    { label: "Cloud & DevOps", items: ["Git", "Docker", "Kubernetes", "AWS", "Azure", "Vercel", "Cloudinary"] },
    { label: "Auth", items: ["Clerk", "Firebase Authentication"] },
    { label: "Foundations", items: ["DSA", "OOP", "Operating Systems", "DBMS", "System Design"] },
];

const recognition = [
    {
        title: "Featured at Times Square",
        description: "Work featured twice at Times Square, New York.",
        link: "https://www.linkedin.com/posts/bhardwajtushar2004_timessquare-topmate-keepbuilding-activity-7366124262883020801-1Rgh"
    },
    {
        title: "Microsoft SWE Intern",
        description: "Shipped production systems as a Software Engineer Intern at Microsoft.",
        link: "https://medium.com/@bhardwajtushar2004/microsoft-swe-intern-hyderabad-bengaluru-noida-sep-2024-offer-28f71a07adce"
    },
    {
        title: "Top 0.1% Mentor on Topmate",
        description: "Mentored 500+ students and developers on career and tech.",
        link: "https://topmate.io/tusharbhardwaj"
    },
    {
        title: "SaaS Competition Winner",
        description: "Won a SaaS market competition with MiniMock.",
        link: "https://x.com/joni_vrbt/status/2028263528583348552?s=20"
    },
    {
        title: "LeetCode Problem Reviewer",
        description: "Contributed as a Problem Reviewer & Solution Author on LeetCode.",
        link: "#"
    },
    {
        title: "23k+ LinkedIn Followers",
        description: "Building in public and sharing lessons with a growing community.",
        link: "https://www.linkedin.com/in/bhardwajtushar2004/"
    },
];

const projects = [
    { name: "MiniLink", desc: "Link-in-bio platform for developers. Free forever.", url: "https://minianonlink.vercel.app/" },
    { name: "MiniVouch", desc: "This very platform — collect and showcase real testimonials.", url: "https://minianonvouch.vercel.app" },
    { name: "Weaave", desc: "Build, connect, and deploy AI workflows visually.", url: "https://weaave.vercel.app/" },
    { name: "MiniMock", desc: "Instant chat, social media, and AI mockups. No watermark.", url: "https://minianonmock.vercel.app/" },
    { name: "PulseAI Prep", desc: "AI-driven interview prep with mock interviews and feedback.", url: "https://github.com/TuShArBhArDwA/PulseAI" },
    { name: "MiniRizz", desc: "Your AI Wingman — never get left on read again.", url: "https://minirizz.vercel.app/" },
    { name: "HireMe", desc: "Full-stack job portal for discovery, applications, and postings.", url: "https://github.com/TuShArBhArDwA/HireMe" },
    { name: "AnonBeats", desc: "Personal, ad-free music player for streaming and playlists.", url: "https://anon-beats.vercel.app/" },
];

export default function AboutPage() {
    return (
        <div className="glow" style={{ minHeight: "100vh" }}>
            <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "4rem 1.5rem 5rem" }}>

                {/* ── Hero ── */}
                <div className="animate-fade-in-up" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                    {/* Badge */}
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "0.5rem",
                        padding: "0.375rem 1rem", borderRadius: "9999px",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-muted-light)",
                        fontSize: "0.8125rem", color: "var(--color-muted)",
                        marginBottom: "1.5rem",
                    }}>
                        <span className="live-dot" />
                        India · Software Engineer
                    </div>

                    {/* Name */}
                    <h1 style={{
                        fontSize: "clamp(2rem, 6vw, 3.75rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.04em",
                        lineHeight: 1.1,
                        marginBottom: "0.5rem",
                    }}>
                        Hi, I&apos;m{" "}
                        <span className="gradient-text">Tushar Bhardwaj</span>
                    </h1>
                    <p style={{
                        fontSize: "1rem", color: "var(--color-muted)",
                        maxWidth: "36rem", margin: "0 auto 0.75rem", lineHeight: 1.6,
                    }}>
                        Known online as{" "}
                        <strong style={{ color: "var(--color-foreground)" }}>Mini Anon</strong>.
                        Ex-Microsoft SWE Intern. Builder, mentor, and obsessive shipper of dev tools.
                    </p>
                    <p style={{
                        fontStyle: "italic", fontSize: "0.9375rem",
                        color: "var(--color-muted)", maxWidth: "36rem",
                        margin: "0 auto 2rem", lineHeight: 1.6,
                    }}>
                        &ldquo;Small steps, every day — I build tools to solve my own problems, then share them with the world.&rdquo;
                    </p>

                    {/* CTAs */}
                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <a
                            href="https://minianonlink.vercel.app/"
                            target="_blank" rel="noopener noreferrer"
                            className="btn-primary"
                            style={{ textDecoration: "none", padding: "0.75rem 2rem", fontSize: "0.9375rem" }}
                        >
                            Find me everywhere
                        </a>
                        <a
                            href="https://tushar-bhardwaj.vercel.app/"
                            target="_blank" rel="noopener noreferrer"
                            className="btn-outline"
                            style={{ textDecoration: "none", padding: "0.75rem 2rem", fontSize: "0.9375rem" }}
                        >
                            Portfolio
                        </a>
                    </div>
                </div>

                {/* ── Skills ── */}
                <section className="animate-fade-in-up card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
                    <h2 style={{ fontWeight: 700, fontSize: "1.125rem", marginBottom: "1.25rem" }}>Technical Skills</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                        {skillGroups.map((group) => (
                            <div key={group.label} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", flexWrap: "wrap" }}>
                                <span style={{
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    color: "var(--color-muted)",
                                    minWidth: "110px",
                                    paddingTop: "0.3rem",
                                    flexShrink: 0,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                }}>{group.label}</span>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                                    {group.items.map((s) => (
                                        <span key={s} style={{
                                            padding: "0.25rem 0.7rem",
                                            borderRadius: "9999px",
                                            border: "1px solid var(--color-border)",
                                            background: "var(--color-muted-light)",
                                            fontSize: "0.8125rem",
                                            color: "var(--color-card-foreground)",
                                            fontWeight: 500,
                                        }}>{s}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Recognition ── */}
                <section style={{ marginBottom: "1.5rem" }}>
                    <h2 style={{ fontWeight: 700, fontSize: "1.125rem", marginBottom: "1rem" }}>Recognition</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem" }}>
                        {recognition.map((r) => (
                            <a
                                key={r.title}
                                href={r.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="card animate-fade-in-up"
                                style={{
                                    padding: "1.25rem",
                                    display: "block",
                                    textDecoration: "none",
                                    transition: "border-color 0.2s ease, transform 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
                                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = "";
                                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                                }}
                            >
                                <p style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--color-foreground)", marginBottom: "0.35rem" }}>
                                    {r.title}
                                </p>
                                <p style={{ fontSize: "0.8125rem", color: "var(--color-muted)", lineHeight: 1.5 }}>
                                    {r.description}
                                </p>
                            </a>
                        ))}
                    </div>
                </section>

                {/* ── Projects ── */}
                <section style={{ marginBottom: "2.5rem" }}>
                    <h2 style={{ fontWeight: 700, fontSize: "1.125rem", marginBottom: "1rem" }}>Things I&apos;ve built</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {projects.map((p) => (
                            <a
                                key={p.name}
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="card"
                                style={{
                                    padding: "1rem 1.25rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    textDecoration: "none",
                                    gap: "1rem",
                                    transition: "border-color 0.2s ease",
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; }}
                            >
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--color-foreground)" }}>{p.name}</p>
                                    <p style={{ fontSize: "0.8125rem", color: "var(--color-muted)" }}>{p.desc}</p>
                                </div>
                                <ExternalLink size={14} color="var(--color-muted)" style={{ flexShrink: 0 }} />
                            </a>
                        ))}
                    </div>
                    {/* GitHub CTA */}
                    <div style={{ marginTop: "1rem", textAlign: "center" }}>
                        <a
                            href="https://github.com/TuShArBhArDwA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline"
                            style={{ textDecoration: "none", padding: "0.625rem 1.5rem", fontSize: "0.875rem" }}
                        >
                            More on GitHub →
                        </a>
                    </div>
                </section>

                {/* ── Footer CTA ── */}
                <div style={{ textAlign: "center" }}>
                    <p style={{ color: "var(--color-muted)", marginBottom: "1.25rem", fontSize: "0.9375rem" }}>
                        Seen enough? Leave me a testimonial or check out my work.
                    </p>
                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/submit" className="btn-primary" style={{ textDecoration: "none", padding: "0.75rem 2rem" }}>
                            Leave a Testimonial →
                        </Link>
                        <Link href="/" className="btn-outline" style={{ textDecoration: "none", padding: "0.75rem 2rem" }}>
                            View the Wall
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
