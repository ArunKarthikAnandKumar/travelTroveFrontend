/**
 * Shared utilities for image compression and handling
 */

/**
 * Compress and resize image before converting to base64 with size target
 * @param file - The image file to compress
 * @param maxWidth - Maximum width in pixels (default: 600)
 * @param maxHeight - Maximum height in pixels (default: 600)
 * @param maxSizeKB - Target maximum size in KB (default: 300)
 * @returns Promise resolving to base64 data URL string
 */
export const compressImage = (
    file: File, 
    maxWidth: number = 600, 
    maxHeight: number = 600, 
    maxSizeKB: number = 300
): Promise<string> => {
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
                
                // Calculate new dimensions maintaining aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }
                
                // Progressive compression - start with higher quality and reduce until target size
                let quality = 0.8;
                let compressedBase64 = '';
                const maxSizeBytes = maxSizeKB * 1024;
                let attempts = 0;
                const maxAttempts = 10;
                
                const tryCompress = () => {
                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);
                    compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    
                    // Calculate actual size (base64 is ~33% larger than binary)
                    const base64Data = compressedBase64.split(',')[1] || '';
                    const sizeInBytes = Math.ceil(base64Data.length * 0.75);
                    
                    // If size is acceptable or we've tried enough, resolve
                    if (sizeInBytes <= maxSizeBytes || attempts >= maxAttempts || quality <= 0.1) {
                        resolve(compressedBase64);
                        return;
                    }
                    
                    // Reduce quality for next attempt
                    attempts++;
                    quality = Math.max(0.1, quality - 0.1);
                    setTimeout(tryCompress, 0); // Use setTimeout to prevent blocking
                };
                
                tryCompress();
            };
            
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

/**
 * Format thumbnail for display - handles various backend formats
 * @param thumbnail - Thumbnail string from backend (could be base64, path, or mixed)
 * @param baseUrl - Base URL for serving static files (optional)
 * @returns Formatted string ready for img src attribute
 */
export const formatThumbnailForDisplay = (thumbnail: string, baseUrl?: string): string => {
    if (!thumbnail) return '';
    
    // If it already starts with data:image, use it directly
    if (thumbnail.startsWith('data:image')) {
        return thumbnail;
    }
    
    // If it contains "data:image" (backend might have prefixed it), extract the data URL part
    const dataImageIndex = thumbnail.indexOf('data:image');
    if (dataImageIndex !== -1) {
        // Extract everything from "data:image" onwards
        return thumbnail.substring(dataImageIndex);
    }
    
    // If it's pure base64 (no prefix), add the data URL prefix
    if (thumbnail.length > 100 && !thumbnail.includes('/')) {
        return `data:image/jpeg;base64,${thumbnail}`;
    }
    
    // If it starts with assets/ or is a path, use BASE_URL
    if (thumbnail.startsWith('assets/') && baseUrl) {
        return `${baseUrl}/${thumbnail}`;
    }
    
    // Fallback: return as is or prepend baseUrl if provided
    return baseUrl && !thumbnail.startsWith('http') ? `${baseUrl}/${thumbnail}` : thumbnail;
};

/**
 * Calculate size of base64 string in KB
 * @param base64String - Base64 data URL string
 * @returns Size in KB
 */
export const getBase64SizeKB = (base64String: string): number => {
    const base64Data = base64String.split(',')[1] || base64String;
    const sizeInBytes = Math.ceil(base64Data.length * 0.75);
    return sizeInBytes / 1024;
};

/**
 * Validate image file before compression
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default: 10)
 * @returns Object with isValid flag and error message if invalid
 */
export const validateImageFile = (file: File, maxSizeMB: number = 10): { isValid: boolean; error?: string } => {
    if (!file.type.startsWith('image/')) {
        return { isValid: false, error: 'Please select an image file' };
    }
    
    if (file.size > maxSizeMB * 1024 * 1024) {
        return { isValid: false, error: `Image is too large. Please select an image smaller than ${maxSizeMB}MB` };
    }
    
    return { isValid: true };
};

