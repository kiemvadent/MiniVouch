# Low-Level Design (LLD) - MiniVouch

## 1. Database Schema (Supabase)

### `testimonials` Table
This is the core table storing all feedback.

| Column Name | Type | Constraints / Defaults | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, `gen_random_uuid()` | Unique identifier |
| `user_id` | `text` | Not Null | Clerk User ID of the submitter |
| `name` | `text` | Not Null | Display name of the submitter |
| `email` | `text` | Not Null | Email of the submitter |
| `message` | `text` | Not Null | The actual testimonial content |
| `profession` | `text` | Nullable | Submitter's job title or relation |
| `is_anonymous` | `boolean` | Default: `false` | Whether to hide the submitter's identity publicly |
| `status` | `text` | Default: `'pending'` | Enum: `'pending'`, `'approved'`, `'rejected'` |
| `image_url` | `text` | Nullable | URL to the user's avatar (Clerk or Custom) |
| `attachment_url` | `text` | Nullable | URL to an optionally attached image evidence |
| `created_at` | `timestamptz` | Default: `now()` | Timestamp of submission |

**Row Level Security (RLS) Policies:**
- `Public Read`: Anyone can select rows where `status = 'approved'`.
- `User Read`: Users can select their own rows (`auth.uid() = user_id`).
- `Service Role`: API routes use the Service Role key to bypass RLS for administrative actions.

## 2. API Endpoints

### `GET /api/testimonials`
- **Description:** Fetches testimonials.
- **Logic:**
  - If requested from the Admin Dashboard (checking custom headers or user ID against `ADMIN_USER_ID`), returns all testimonials.
  - If requested from User Dashboard, returns only testimonials belonging to the configured authentication token.
  - If requested publicly (no specific headers), returns only `approved` testimonials.

### `POST /api/testimonials`
- **Description:** Submits a new testimonial.
- **Auth:** Required.
- **Body:** `{ name, email, message, profession, is_anonymous, image_url, attachment_url }`
- **Logic:** Validates the session via Clerk. Inserts a new row into Supabase with `status='pending'` and the `user_id` from the token.

### `PATCH /api/testimonials`
- **Description:** Updates a testimonial. Used by both Admins (for status changes) and Users (for editing their own pending entries).
- **Auth:** Required.
- **Body:** `{ id, message?, name?, profession?, image_url?, attachment_url?, is_anonymous?, status? }`
- **Logic:** 
  - If `status` is provided, verifies `ADMIN_USER_ID`.
  - If other fields are provided, verifies ownership and that `status` is `'pending'`.
  - Handles anonymity logic by resetting `name` and `image_url` if `is_anonymous` is updated to true.

### `DELETE /api/testimonials`
- **Description:** Admin action to delete a testimonial.
- **Auth:** Required (Must match `ADMIN_USER_ID`).
- **Body:** `{ id }`
- **Logic:** Deletes the row from the database.

### `POST /api/upload`
- **Description:** Handles image uploads (avatars or attachments).
- **Auth:** Required.
- **Body:** FormData containing the file.
- **Logic:** Uploads the file to the Supabase `testimonials` bucket and returns the generated public URL.

## 3. Component Details

### `TestimonialCard` (`src/components/testimonial-card.tsx`)
- **Props:** `name`, `profession`, `message`, `is_anonymous`, `image_url`, `attachment_url`, `created_at`
- **Logic:** Provides a consistent high-fidelity layout used across the public Wall and User Dashboard. 
  - **Header:** Consolidates avatar, name, profession, and date.
  - **Anonymity:** If `is_anonymous` is true, masks identifiable data and displays "Identity Hidden".
  - **Attachment:** Displays evidentiary images above the message block.

### `Navbar` (`src/components/navbar.tsx`)
- **Logic:** Dynamically renders links based on Clerk's `useAuth()` hook. Shows "Dashboard" if logged in, otherwise "Login". Shows a "Theme Toggle" for light/dark mode.

### Middleware (`src/middleware.ts`)
- **Logic:** Protects `/submit`, `/dashboard`, and `/admin`. Unauthenticated users attempting to access these routes are redirected via `nextUrl.searchParams` to the custom `/login` page, allowing them to sign in and be redirected back to their intended destination.
