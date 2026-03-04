-- ============================================
-- Testimonials Table & RLS Policies
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create the testimonials table
create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  name text not null,
  profession text,
  message text not null,
  is_anonymous boolean default false,
  image_url text,
  attachment_url text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.testimonials enable row level security;

-- Policy: Anyone can read approved testimonials
create policy "Public can view approved testimonials"
  on public.testimonials
  for select
  using (status = 'approved');

-- Policy: Service role full access (used by our API routes)
create policy "Service role full access"
  on public.testimonials
  for all
  using (true)
  with check (true);

-- Create index for faster queries
create index if not exists idx_testimonials_status on public.testimonials(status);
create index if not exists idx_testimonials_user_id on public.testimonials(user_id);
create index if not exists idx_testimonials_created_at on public.testimonials(created_at desc);

-- ============================================
-- Migration: Run these individually if table already exists
-- ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS attachment_url text;
-- ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS profession text;
-- ============================================
