// Custom image loader for Cloudinary optimization
module.exports = function cloudinaryLoader({ src, width, quality }) {
  // Only apply to Cloudinary URLs
  if (!src.includes('cloudinary.com')) {
    return src;
  }

  const isLCPImage = src.includes('main-product-image') || width >= 480;
  
  // Optimize differently based on whether this is an LCP image
  if (isLCPImage) {
    // Extract base URL and transformation parts
    const parts = src.split('/upload/');
    if (parts.length !== 2) return src;
    
    // For LCP images, use aggressive optimization settings
    const finalQuality = quality || 30;
    return `${parts[0]}/upload/f_auto,q_auto:${finalQuality},w_${width},c_limit,dpr_auto,e_sharpen:60/${parts[1]}`;
  } else {
    // For non-LCP images, use standard settings
    const finalQuality = quality || 75;
    const parts = src.split('/upload/');
    if (parts.length !== 2) return src;
    
    return `${parts[0]}/upload/f_auto,q_auto:${finalQuality},w_${width}/${parts[1]}`;
  }
}; 