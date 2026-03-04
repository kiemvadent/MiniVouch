import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";

// GET /api/testimonials — fetch approved testimonials (public)
export async function GET() {
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from("testimonials")
            .select("*")
            .eq("status", "approved")
            .order("created_at", { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("GET /api/testimonials error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/testimonials — submit a new testimonial (authenticated)
export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await currentUser();
        const body = await req.json();

        const { message, name, profession, is_anonymous, attachment_url } = body;

        if (!message || !message.trim()) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        const testimonialName = is_anonymous
            ? "Anonymous"
            : name?.trim() || user?.fullName || "Anonymous";

        const imageUrl = is_anonymous ? null : user?.imageUrl || null;

        const supabase = getSupabase();
        const { data, error } = await supabase
            .from("testimonials")
            .insert({
                user_id: userId,
                name: testimonialName,
                profession: is_anonymous ? null : (profession?.trim() || null),
                message: message.trim(),
                is_anonymous: !!is_anonymous,
                status: "pending",
                image_url: imageUrl,
                attachment_url: attachment_url || null,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        console.error("POST /api/testimonials error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
