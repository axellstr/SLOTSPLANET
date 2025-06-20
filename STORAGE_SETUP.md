# 🖼️ Image Upload Setup - Quick Guide

## 🚀 **1-Minute Setup for Image Uploads**

### **Step 1: Create Storage Bucket**
1. Go to your **Supabase Dashboard** → **Storage**
2. Click **"Create Bucket"**
3. Name: `casino-assets`
4. Set to **Public**
5. Click **"Create bucket"**

### **Step 2: Run Storage SQL**
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste this SQL:

```sql
-- Create storage bucket for casino assets (logos, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'casino-assets',
  'casino-assets',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
);

-- Create policy to allow anyone to upload images (you can restrict this later)
CREATE POLICY "Allow public uploads to casino-assets" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'casino-assets');

-- Create policy to allow anyone to view images
CREATE POLICY "Allow public access to casino-assets" ON storage.objects
FOR SELECT USING (bucket_id = 'casino-assets');

-- Create policy to allow public deletion (optional - you might want to restrict this)
CREATE POLICY "Allow public delete from casino-assets" ON storage.objects
FOR DELETE USING (bucket_id = 'casino-assets');
```

3. Click **"Run"**

### **Step 3: Test Image Upload**
1. Go to your admin panel: `http://localhost:3002/admin`
2. Click **"Add New Casino"** or edit existing casino
3. Try uploading a logo image
4. You should see the image URL automatically filled in!

## ✅ **Done!**
Your image upload system is now fully functional with Supabase Storage!

---

### **🔧 Troubleshooting**
- **"Upload failed: The resource was not found"** → Bucket not created properly, repeat Step 1
- **"Invalid file type"** → Use JPEG, PNG, GIF, or WebP only
- **"File too large"** → Max 5MB, compress your image 