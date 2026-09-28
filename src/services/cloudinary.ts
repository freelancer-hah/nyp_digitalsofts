/**
 * Supabase Storage & Cloudinary Upload Utility for NYP Sindh Portal
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'deejpsbzq';
const CONFIGURED_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'nyp_preset';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

/**
 * Uploads an image file to Supabase Storage bucket ('nyp-uploads')
 * Falls back to Cloudinary / Data URL if needed.
 */
export async function uploadToSupabaseStorage(file: File): Promise<string> {
  if (isSupabaseConfigured()) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const bucketName = 'nyp-uploads';

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(cleanFileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(cleanFileName);

        if (publicUrlData?.publicUrl) {
          console.log('Supabase Storage upload successful:', publicUrlData.publicUrl);
          return publicUrlData.publicUrl;
        }
      } else if (error) {
        console.warn('Supabase Storage upload notice:', error.message);
      }
    } catch (err) {
      console.warn('Supabase Storage exception:', err);
    }
  }

  // Fallback to Cloudinary CDN
  return await uploadToCloudinaryFallback(file);
}

/**
 * Cloudinary Fallback Upload
 */
async function uploadToCloudinaryFallback(file: File): Promise<string> {
  const presetsToTry = Array.from(new Set([CONFIGURED_PRESET, 'ml_default']));

  for (const preset of presetsToTry) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', preset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data: CloudinaryUploadResponse = await response.json();
        if (data.secure_url) {
          console.log(`Cloudinary upload successful on cloud ${CLOUD_NAME}:`, data.secure_url);
          return data.secure_url;
        }
      }
    } catch (err) {
      // Ignore network errors and proceed
    }
  }

  // Local Fallback: Convert file directly to a compressed Data URL
  return await createCompressedDataUrl(file);
}

/**
 * Resizes an image file to a lightweight data URL for fallback preview
 */
async function createCompressedDataUrl(file: File, maxWidth = 400, maxHeight = 400): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          resolve(e.target?.result as string || '');
        }
      };
      img.onerror = () => resolve(e.target?.result as string || '');
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

// Re-export alias for backwards compatibility
export const uploadToCloudinary = uploadToSupabaseStorage;
