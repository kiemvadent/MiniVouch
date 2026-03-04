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

        const { message, name, profession, is_anonymous, attachment_url, image_url } = body;

        if (!message || !message.trim()) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        const testimonialName = is_anonymous
            ? "Anonymous"
            : name?.trim() || user?.fullName || "Anonymous";

        const finalImageUrl = is_anonymous
            ? null
            : (image_url !== undefined ? image_url : (user?.imageUrl || null));

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
                image_url: finalImageUrl,
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

// PATCH /api/testimonials — user edits their own pending testimonial
export async function PATCH(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await req.json();
        const { id, message, name, profession, image_url, attachment_url, is_anonymous } = body;

        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
        if (!message?.trim()) return NextResponse.json({ error: "Message is required" }, { status: 400 });

        const supabase = getSupabase();

        // Verify ownership and pending status
        const { data: existing } = await supabase
            .from("testimonials")
            .select("id, user_id, status")
            .eq("id", id)
            .single();

        if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
        if (existing.user_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        if (existing.status !== "pending") return NextResponse.json({ error: "Only pending testimonials can be edited" }, { status: 400 });

        // Determine update payload
        const updatePayload: any = {
            message: message.trim(),
            is_anonymous: !!is_anonymous,
            name: is_anonymous ? "Anonymous" : (name?.trim() || "Anonymous"),
            profession: is_anonymous ? null : (profession?.trim() || null),
        };

        if (is_anonymous) {
            updatePayload.image_url = null;
        } else if (image_url !== undefined) {
            updatePayload.image_url = image_url;
        }

        if (attachment_url !== undefined) {
            updatePayload.attachment_url = attachment_url;
        }

        const { data, error } = await supabase
            .from("testimonials")
            .update(updatePayload)
            .eq("id", id)
            .select()
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data);
    } catch (err) {
        console.error("PATCH /api/testimonials error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/testimonials — user deletes their own pending testimonial
export async function DELETE(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        const supabase = getSupabase();

        // Verify ownership and pending status
        const { data: existing } = await supabase
            .from("testimonials")
            .select("id, user_id, status")
            .eq("id", id)
            .single();

        if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
        if (existing.user_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        if (existing.status !== "pending") return NextResponse.json({ error: "Only pending testimonials can be deleted" }, { status: 400 });

        const { error } = await supabase
            .from("testimonials")
            .delete()
            .eq("id", id);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("DELETE /api/testimonials error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
