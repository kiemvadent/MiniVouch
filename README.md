# MiniVouch

A minimal, secure testimonial wall built with Next.js, Clerk Auth, and Supabase. Collect and showcase social proof in minutes with a clean, authenticated UI.

## Features

- User Authentication via Clerk.
- Authenticated Testimonial Submissions.
- Anonymous Posting Support.
- Personal User Dashboard to track status.
- Protected Admin Panel for moderation (Approve/Reject/Delete).
- Responsive, modern UI with TailwindCSS v4.
- Secure operations via Supabase Row Level Security (RLS).

## Tech Stack

- Framework: Next.js (App Router)
- Authentication: Clerk
- Database: Supabase
- Styling: TailwindCSS v4
- Deployment: Vercel (Recommended)

## Getting Started

### 1. Prerequisites

- A Clerk account and project.
- A Supabase account and project.

### 2. Installation

Clone the repository and install dependencies:

```bash
cd MiniVouch
npm install
```

### 3. Environment Setup

Create a .env.local file in the root directory and add the following variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
ADMIN_USER_ID=your_clerk_user_id
```

### 4. Database Setup

Run the SQL found in supabase/schema.sql in your Supabase SQL Editor to create the necessary tables and policies.

### 5. Running Locally

```bash
npm run dev
```

Open http://localhost:3000 to view the application.

## Security

The application uses Clerk for authentication and session management. Database operations are handled server-side using the Supabase Service Role key, with access control logic enforced in Next.js API routes and Supabase RLS policies.
