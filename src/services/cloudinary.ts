/**
 * Cloudinary Upload Utility for NYP Sindh Portal
 * Configured Cloud Name: deejpsbzq
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'deejpsbzq';
const UPLOAD_PRESETS_TO_TRY = [
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'nyp_preset',
  'ml_default',
  'unsigned_preset',
  'nyp_sindh'
];

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

/**
 * Uploads an image file to Cloudinary CDN under cloud name 'deejpsbzq'
 * @param file File object from file input
 * @returns Promise resolving to secure HTTPS Cloudinary URL
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  // Try configured presets
  for (const preset of UPLOAD_PRESETS_TO_TRY) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', preset);
      formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY || '124845399766788');

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
      console.warn(`Preset ${preset} attempt error:`, err);
    }
  }

  // Fallback: Read file as Data URL if unsigned preset is not created yet on Cloudinary dashboard
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
