<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/message-square-quote.svg" alt="MiniVouch Logo" width="80" height="80">
  <h1 align="center">MiniVouch</h1>
  <p align="center">
    <strong>Collect and showcase genuine testimonials. Real feedback from real people.</strong>
  </p>
  <p align="center">
    <a href="#features">Features</a> • 
    <a href="#tech-stack">Tech Stack</a> • 
    <a href="#getting-started">Getting Started</a> • 
    <a href="#documentation">Documentation</a>
  </p>
</div>

---

## Overview

MiniVouch is a sleek, modern, and highly secure testimonial wall built for individuals, freelancers, and businesses. It allows you to collect authenticated feedback from mentees, recruiters, clients, and collaborators, giving your profile an undeniable social proof boost. 

Say goodbye to messy screenshots and unverified quotes. MiniVouch ensures authenticity while offering a beautiful frontend to showcase your reputation.

## Features

- **Seamless Management:** Users can edit or delete their pending testimonials directly from their personal dashboard.
- **Anonymity Toggling:** Effortlessly switch between anonymous and identified states, even after submission (while pending).
- **Custom Avatars & Attachments:** Submitters can use their default social avatar, upload a custom one, or attach evidence images.
- **Protected Admin Panel:** Site owners can approve, reject, or delete testimonials before they appear on the public wall.
- **Personal Dashboard:** Submitters can log in to track the status of their testimonials (Pending, Approved, Rejected).
- **Consolidated UI:** High-fidelity cards and forms provide a uniform experience across the entire platform.

## Tech Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Database & Storage:** [Supabase](https://supabase.com/) (PostgreSQL + S3 Storage)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** [Vercel](https://vercel.com/) (Recommended)

## Getting Started

### 1. Prerequisites

- A [Clerk](https://clerk.com) account and project.
- A [Supabase](https://supabase.com) account and project.
- Node.js 18+ installed on your machine.

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/minivouch.git
cd MiniVouch
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/login

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin Configuration (Your Clerk User ID)
ADMIN_USER_ID=user_2...
```

### 4. Database Setup

Run the SQL script found in `supabase/schema.sql` directly in your Supabase SQL Editor. This will:
- Create the `testimonials` table.
- Create the `testimonials` storage bucket.
- Apply the necessary Row Level Security (RLS) policies.

### 5. Running Locally

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Documentation

For an in-depth look at how MiniVouch is built, check out the documentation:

- [High-Level Design (HLD)](./docs/HLD.md) - System architecture and component overview.
- [Low-Level Design (LLD)](./docs/LLD.md) - Database schema, API route logic, and component details.

## Security

MiniVouch is designed with security as a priority:
- **Authentication:** Handled entirely by Clerk, ensuring secure session management.
- **Database Access:** Client-side interaction is restricted. API routes perform all reads/writes using the Supabase Service Role key, verifying Clerk sessions on the server side securely.
- **RLS Policies:** Applied at the Supabase level to ensure no unauthorized direct access occurs.

---

## Sponsor

If you find this helpful, consider supporting me:

- **Sponsor Me:** [Buy Me a Coffee!](https://github.com/sponsors/TuShArBhArDwA)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Connect with me

If you’d like to connect, feel free to reach out — [Click here](https://minianonlink.vercel.app/tusharbhardwaj)


---

**[Try MiniVouch](https://minianonvouch.vercel.app/)** | **[Submit Feedback](https://github.com/TuShArBhArDwA/MiniLink/issues)**
