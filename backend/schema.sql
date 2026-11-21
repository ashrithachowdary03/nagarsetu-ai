-- ==============================================================
-- NagarSetu AI - Supabase PostgreSQL Database Schema
-- Run this script in the Supabase SQL Editor to initialize tables
-- ==============================================================

-- 1. Profiles Table (Citizens & Administrators)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('citizen', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    location TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Roads and potholes',
        'Water supply and leakage',
        'Garbage and sanitation',
        'Drainage and sewage',
        'Streetlights',
        'Public infrastructure',
        'Other civic issues'
    )),
    priority TEXT NOT NULL CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
    priority_reason TEXT,
    ai_summary TEXT,
    image_observations TEXT,
    suggested_department TEXT,
    assigned_department TEXT,
    ai_confidence FLOAT DEFAULT 0.0,
    uncertainty_notes TEXT,
    status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN (
        'Submitted',
        'Under Review',
        'Assigned',
        'In Progress',
        'Resolved',
        'Closed'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Complaint Updates (Audit & Progression History)
CREATE TABLE IF NOT EXISTS complaint_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    updated_by TEXT NOT NULL,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for optimal lookup and dashboard metrics
CREATE INDEX IF NOT EXISTS idx_complaints_ref_id ON complaints(reference_id);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_user ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_updates_complaint ON complaint_updates(complaint_id);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_updates ENABLE ROW LEVEL SECURITY;

-- Public can view aggregated/public complaints
CREATE POLICY "Public read complaints" ON complaints 
    FOR SELECT USING (true);

-- Authenticated citizens can create complaints
CREATE POLICY "Users can create complaints" ON complaints 
    FOR INSERT WITH CHECK (true);

-- Complaint updates readable by all
CREATE POLICY "Public read complaint updates" ON complaint_updates 
    FOR SELECT USING (true);
