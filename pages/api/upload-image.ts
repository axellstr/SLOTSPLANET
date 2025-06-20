import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { readFileSync } from 'fs';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
  debug?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!isSupabaseConfigured) {
    return res.status(500).json({ 
      success: false, 
      error: 'Supabase not configured. Please set up your environment variables.' 
    });
  }

  try {
    console.log('Starting file upload process...');

    // Parse the uploaded file
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    console.log('Parsed form data. Files:', Object.keys(files));
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      console.log('No file found in upload');
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded',
        debug: { fieldsKeys: Object.keys(fields), filesKeys: Object.keys(files) }
      });
    }

    console.log('File details:', {
      originalFilename: file.originalFilename,
      mimetype: file.mimetype,
      size: file.size
    });

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype || '')) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid file type: ${file.mimetype}. Please upload a valid image (JPEG, PNG, GIF, WebP)` 
      });
    }

    // Read the file
    const fileBuffer = readFileSync(file.filepath);
    console.log('File buffer size:', fileBuffer.length);
    
    // Generate a unique filename
    const timestamp = Date.now();
    const originalName = file.originalFilename || 'image';
    const extension = originalName.split('.').pop() || 'jpg';
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `casino-logos/${timestamp}-${sanitizedName}`;

    console.log('Uploading to Supabase with filename:', fileName);

    // Skip bucket listing check and try to upload directly
    // The bucket exists but listing might be restricted by RLS policies
    console.log('Attempting direct upload to casino-assets bucket...');

    // Upload to Supabase Storage
    const { data, error } = await supabase!.storage
      .from('casino-assets')
      .upload(fileName, fileBuffer, {
        contentType: file.mimetype || 'image/jpeg',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      
      // Provide specific error messages for common issues
      if (error.message.includes('Bucket not found')) {
        return res.status(500).json({ 
          success: false, 
          error: 'Storage bucket "casino-assets" not found. Please ensure it exists in your Supabase dashboard.',
          debug: { uploadError: error }
        });
      }
      
      if (error.message.includes('Policy')) {
        return res.status(500).json({ 
          success: false, 
          error: 'Storage permission denied. Please check your bucket policies.',
          debug: { uploadError: error }
        });
      }
      
      return res.status(500).json({ 
        success: false, 
        error: `Upload failed: ${error.message}`,
        debug: { uploadError: error }
      });
    }

    console.log('Upload successful:', data);

    // Get the public URL
    const { data: urlData } = supabase!.storage
      .from('casino-assets')
      .getPublicUrl(fileName);

    if (!urlData?.publicUrl) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to get public URL for uploaded image' 
      });
    }

    console.log('Generated public URL:', urlData.publicUrl);

    res.status(200).json({ 
      success: true, 
      url: urlData.publicUrl 
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed',
      debug: { error: error instanceof Error ? error.stack : error }
    });
  }
} 