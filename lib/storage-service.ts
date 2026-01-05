import { getSupabaseClient } from './supabase';

// Storage bucket names
const RECIPE_IMAGES_BUCKET = 'recipe-images';
const USER_UPLOADS_BUCKET = 'user-uploads';

// Get anonymous user ID
const getAnonymousUserId = (): string => {
  if (typeof window === 'undefined') return '';
  let userId = localStorage.getItem('anonymous_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('anonymous_user_id', userId);
  }
  return userId;
};

// Upload a recipe image
export async function uploadRecipeImage(
  file: File,
  recipeName: string
): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error('Supabase not configured');
    return null;
  }

  const userId = getAnonymousUserId();
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${recipeName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(RECIPE_IMAGES_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Error uploading recipe image:', error);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(RECIPE_IMAGES_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

// Upload a user file (private)
export async function uploadUserFile(
  file: File,
  folder: string = 'misc'
): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error('Supabase not configured');
    return null;
  }

  const userId = getAnonymousUserId();
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${folder}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(USER_UPLOADS_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Error uploading user file:', error);
    return null;
  }

  return data.path;
}

// Get signed URL for private file
export async function getSignedUrl(
  path: string,
  expiresIn: number = 3600
): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.storage
    .from(USER_UPLOADS_BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error('Error getting signed URL:', error);
    return null;
  }

  return data.signedUrl;
}

// Delete a file from storage
export async function deleteFile(
  bucket: 'recipe-images' | 'user-uploads',
  path: string
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error('Error deleting file:', error);
    return false;
  }

  return true;
}

// List files in a folder
export async function listFiles(
  bucket: 'recipe-images' | 'user-uploads',
  folder?: string
): Promise<string[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const userId = getAnonymousUserId();
  const path = folder ? `${userId}/${folder}` : userId;

  const { data, error } = await supabase.storage.from(bucket).list(path);

  if (error) {
    console.error('Error listing files:', error);
    return [];
  }

  return data.map((file) => `${path}/${file.name}`);
}

// Get storage usage info
export async function getStorageUsage(): Promise<{
  used: number;
  limit: number;
  percentage: number;
} | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  // Note: This requires service role key for accurate results
  // For now, return estimated based on user's files
  const userId = getAnonymousUserId();

  try {
    const [recipeFiles, userFiles] = await Promise.all([
      supabase.storage.from(RECIPE_IMAGES_BUCKET).list(userId),
      supabase.storage.from(USER_UPLOADS_BUCKET).list(userId),
    ]);

    let totalSize = 0;

    recipeFiles.data?.forEach((file) => {
      if (file.metadata?.size) {
        totalSize += file.metadata.size;
      }
    });

    userFiles.data?.forEach((file) => {
      if (file.metadata?.size) {
        totalSize += file.metadata.size;
      }
    });

    // Extended storage limit (adjust based on your plan)
    const storageLimit = 8 * 1024 * 1024 * 1024; // 8GB for extended plan

    return {
      used: totalSize,
      limit: storageLimit,
      percentage: (totalSize / storageLimit) * 100,
    };
  } catch {
    return null;
  }
}

// Compress image before upload (client-side)
export async function compressImage(
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}
