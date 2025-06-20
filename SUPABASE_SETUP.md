# 🎰 Casino CMS - Supabase Integration Setup

This guide will walk you through setting up Supabase for persistent data storage in your Casino CMS.

## 📋 Prerequisites

- A [Supabase](https://supabase.com) account (free tier available)
- Your Casino CMS project files

## 🚀 Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click **"New Project"**
3. Choose your organization
4. Fill in project details:
   - **Name**: `casino-cms` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the region closest to your users
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to be provisioned

## 🗄️ Step 2: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database/schema.sql` from this project
3. Paste it into the SQL Editor
4. Click **"Run"** to execute the SQL
5. Verify the `casinos` table was created in the **Table Editor**
6. Verify the `casino-assets` storage bucket was created in **Storage**

## 🔑 Step 3: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Project API Key** (anon/public key)

## ⚙️ Step 4: Configure Environment Variables

1. In your project root, create a file named `.env.local`
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace the placeholder values with your actual Supabase credentials
4. Save the file

> **⚠️ Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

## 🎯 Step 5: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Open your admin panel at `http://localhost:3001/admin`
3. You should see a green banner saying "Supabase Integration Active"
4. Try adding/editing a casino to test the database connection
5. Check your Supabase **Table Editor** to verify data is being saved

## 📊 Step 6: Verify Data Persistence

1. Make some changes in the admin panel (add/edit casinos)
2. Restart your development server (`Ctrl+C` then `npm run dev`)
3. Refresh the admin panel - your changes should still be there!
4. Check the main page (`http://localhost:3001`) to see your casinos displayed

## 🔧 Troubleshooting

### "Failed to fetch casino data" Error
- **Check**: Are your environment variables correct?
- **Check**: Is your Supabase project URL accessible?
- **Fix**: Verify `.env.local` file has correct values without quotes

### "Failed to save casino data" Error
- **Check**: Did you run the database schema SQL?
- **Check**: Are the table permissions set correctly?
- **Fix**: Re-run the `database/schema.sql` in Supabase SQL Editor

### Empty Casino List
- **Cause**: No data in database yet
- **Fix**: The app will automatically initialize with default data on first load

### RLS (Row Level Security) Issues
- **Check**: The schema includes a permissive policy for development
- **Production**: Consider implementing proper authentication and RLS policies

### Image Upload Errors
- **"Upload failed: The resource was not found"**: Storage bucket not created
- **Fix**: Re-run the storage bucket creation SQL from `database/schema.sql`
- **"Invalid file type"**: File format not supported
- **Fix**: Use JPEG, PNG, GIF, or WebP images only
- **"File too large"**: Image exceeds 5MB limit
- **Fix**: Compress your image or use a smaller file

## 🚀 Deployment Considerations

### For Vercel Deployment:
1. In Vercel dashboard, go to your project → **Settings** → **Environment Variables**
2. Add the same environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### For Other Platforms:
- Ensure environment variables are set in your hosting platform
- Variables must be available at build time and runtime

## 🔒 Security Best Practices

1. **Row Level Security**: The schema enables RLS with a permissive policy for development
2. **API Keys**: Never expose your Supabase service key in client-side code
3. **Production**: Implement proper authentication and authorization
4. **Environment Variables**: Never commit sensitive data to version control

## 📈 Database Features Included

- ✅ **Auto-timestamping**: `created_at` and `updated_at` fields
- ✅ **Indexing**: Optimized queries for rank and name
- ✅ **JSON Storage**: Flexible bonus and features data
- ✅ **Data Validation**: Built-in PostgreSQL constraints
- ✅ **Backup**: Automatic Supabase backups
- ✅ **Image Storage**: Supabase Storage for casino logos
- ✅ **File Upload**: Secure image upload with validation

## 🖼️ Image Upload Setup

The system includes image upload functionality using Supabase Storage:

### **Supported File Types:**
- JPEG/JPG
- PNG  
- GIF
- WebP

### **Upload Limits:**
- Maximum file size: 5MB
- Files are stored in `casino-assets/casino-logos/` folder
- Automatic filename sanitization and timestamping

### **Usage:**
1. In the admin panel, click "Add New Casino" or edit existing casino
2. Click "Upload Logo" in the casino form
3. Select your image file
4. The logo URL will be automatically filled in the form

## 🎉 Success!

Your Casino CMS now has persistent data storage! All casino data will be:
- ✅ Saved permanently to Supabase PostgreSQL database
- ✅ Preserved across server restarts and deployments
- ✅ Accessible from multiple environments (dev, staging, production)
- ✅ Backed up automatically by Supabase

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Supabase project is active
3. Ensure environment variables are correctly set
4. Check Supabase logs in your dashboard 