import Image from "next/image";
import { User } from "lucide-react";

interface TestimonialCardProps {
    name: string;
    profession?: string | null;
    message: string;
    is_anonymous: boolean;
    image_url?: string | null;
    attachment_url?: string | null;
    created_at: string;
}

export function TestimonialCard({
    name,
    profession,
    message,
    is_anonymous,
    image_url,
    attachment_url,
    created_at,
}: TestimonialCardProps) {
    const displayName = is_anonymous ? "Anonymous" : name;
    const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <div
            className="card"
            style={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                breakInside: "avoid",
            }}
        >
            {/* ── 1: HEADER — Name, Profession, Date ── */}
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    padding: "1.25rem 1.25rem 0",
                }}
            >
                {/* Avatar */}
                <div style={{ flexShrink: 0 }}>
                    {!is_anonymous && image_url ? (
                        <Image
                            src={image_url}
                            alt={displayName}
                            width={40}
                            height={40}
                            style={{
                                borderRadius: "9999px",
                                objectFit: "cover",
                                border: "2px solid var(--color-primary-light)",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "2.5rem",
                                height: "2.5rem",
                                borderRadius: "9999px",
                                background: "linear-gradient(135deg, #818cf8, #c084fc)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: 700,
                                fontSize: "0.9375rem",
                            }}
                        >
                            {is_anonymous ? <User size={20} /> : displayName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Name + Profession + Date */}
                <div style={{ minWidth: 0, flex: 1 }}>
                    <p
                        style={{
                            fontWeight: 700,
                            fontSize: "0.9375rem",
                            color: "var(--color-foreground)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {displayName}
                    </p>
                    {!is_anonymous && profession && (
                        <p
                            style={{
                                fontSize: "0.75rem",
                                color: "var(--color-primary)",
                                fontWeight: 500,
                                marginTop: "0.1rem",
                            }}
                        >
                            {profession}
                        </p>
                    )}
                    <p
                        style={{
                            fontSize: "0.6875rem",
                            color: "var(--color-muted)",
                            marginTop: "0.1rem",
                        }}
                    >
                        {formattedDate}
                    </p>
                </div>

                {/* Quote mark */}
                <div
                    style={{
                        fontSize: "2.5rem",
                        lineHeight: 1,
                        color: "var(--color-primary)",
                        opacity: 0.12,
                        fontFamily: "Georgia, serif",
                        flexShrink: 0,
                        marginTop: "-0.2rem",
                    }}
                >
                    &ldquo;
                </div>
            </div>

            {/* ── 2: IMAGE (if any) ── */}
            {attachment_url && (
                <div
                    style={{
                        margin: "1rem 1.25rem 0",
                        maxHeight: "220px",
                        overflow: "hidden",
                        borderRadius: "0.75rem",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-background-secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={attachment_url}
                        alt="Testimonial attachment"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "220px",
                            width: "auto",
                            height: "auto",
                            objectFit: "contain",
                            display: "block",
                        }}
                    />
                </div>
            )}

            {/* ── 3: MESSAGE ── */}
            <p
                style={{
                    fontSize: "0.9375rem",
                    lineHeight: 1.7,
                    color: "var(--color-card-foreground)",
                    padding: "1rem 1.25rem 1.25rem",
                }}
            >
                {message}
            </p>
        </div>
    );
}
