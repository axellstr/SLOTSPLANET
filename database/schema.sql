-- Casino CMS Database Schema for Supabase
-- Run this SQL in your Supabase SQL editor to create the casinos table

-- Create casinos table
CREATE TABLE IF NOT EXISTS casinos (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(500) NOT NULL,
    url VARCHAR(500) NOT NULL,
    rank INTEGER NOT NULL DEFAULT 1,
    "rankClass" VARCHAR(50),
    rating DECIMAL(3,1) NOT NULL DEFAULT 0.0,
    stars INTEGER NOT NULL DEFAULT 0,
    "isNew" BOOLEAN DEFAULT FALSE,
    "hasVPN" BOOLEAN DEFAULT FALSE,
    "vpnTooltip" VARCHAR(255),
    "buttonText" VARCHAR(100),
    bonus JSONB NOT NULL DEFAULT '{}',
    features JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_casinos_updated_at 
    BEFORE UPDATE ON casinos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create index on rank for faster sorting
CREATE INDEX IF NOT EXISTS idx_casinos_rank ON casinos(rank);

-- Create index on name for faster searches
CREATE INDEX IF NOT EXISTS idx_casinos_name ON casinos(name);

-- Create billboards table
CREATE TABLE IF NOT EXISTS billboards (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    "buttonText" VARCHAR(100) NOT NULL,
    "buttonUrl" VARCHAR(500) NOT NULL,
    "backgroundImage" VARCHAR(500) NOT NULL,
    "isActive" BOOLEAN DEFAULT TRUE,
    "order" INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger for billboards
CREATE TRIGGER update_billboards_updated_at 
    BEFORE UPDATE ON billboards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for billboards
CREATE INDEX IF NOT EXISTS idx_billboards_order ON billboards("order");
CREATE INDEX IF NOT EXISTS idx_billboards_active ON billboards("isActive");

-- Enable Row Level Security (RLS)
ALTER TABLE casinos ENABLE ROW LEVEL SECURITY;
ALTER TABLE billboards ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on casinos" ON casinos
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Create policy to allow all operations on billboards
CREATE POLICY "Allow all operations on billboards" ON billboards
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Sample data structure comments:
-- bonus JSONB structure:
-- {
--   "percentage": "100%",
--   "maxAmount": "€500",
--   "promoCode": "WELCOME100",
--   "wager": "35x",
--   "freeSpins": "50",
--   "verification": "ΝΑΙ"
-- }

-- features JSONB structure:
-- {
--   "quickWithdrawals": true,
--   "withdrawalText": "INSTANT WITHDRAWALS"
-- }

-- ====================================================
-- STORAGE BUCKET SETUP FOR IMAGE UPLOADS
-- ====================================================
-- Run these commands in Supabase SQL Editor after creating the bucket manually

-- First, create the bucket manually in Supabase Dashboard:
-- 1. Go to Storage > New bucket
-- 2. Name: casino-assets
-- 3. Make it Public: ✅ (very important!)
-- 4. Click Create bucket

-- THEN run this SQL to set up the policies:

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public uploads to casino-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to casino-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from casino-assets" ON storage.objects;

-- Create policy to allow anyone to upload images
CREATE POLICY "Allow public uploads to casino-assets" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'casino-assets');

-- Create policy to allow anyone to view images
CREATE POLICY "Allow public access to casino-assets" ON storage.objects
FOR SELECT USING (bucket_id = 'casino-assets');

-- Create policy to allow public deletion (optional - you might want to restrict this)
CREATE POLICY "Allow public delete from casino-assets" ON storage.objects
FOR DELETE USING (bucket_id = 'casino-assets');

-- Ensure RLS is enabled on storage.objects (it should be by default)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; 