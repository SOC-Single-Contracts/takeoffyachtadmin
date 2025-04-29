const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp','image/svg+xml',];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const validateImage = (file) => {
  if (!file) return null;
  
  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    return 'File must be an image (JPEG, PNG, GIF, WEBP, or SVG)';
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return 'Image size must be less than 5MB';
  }
  
  return null;
};