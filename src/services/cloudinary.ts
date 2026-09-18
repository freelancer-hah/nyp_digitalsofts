/**
 * Cloudinary Upload Utility for NYP Sindh Portal
 * Configured Cloud Name: deejpsbzq
 */

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
 * Resizes an image file to a lightweight data URL for fallback preview (max 400x400 ~30KB)
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

/**
 * Uploads an image file to Cloudinary CDN under cloud name 'deejpsbzq'
 * @param file File object from file input
 * @returns Promise resolving to secure HTTPS Cloudinary URL or local compressed Data URL fallback
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  // Try configured preset first
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
      // Ignore network errors and proceed to fallback
    }
  }

  // Local Fallback: Convert file directly to a compressed Data URL for instant image preview
  return await createCompressedDataUrl(file);
}


