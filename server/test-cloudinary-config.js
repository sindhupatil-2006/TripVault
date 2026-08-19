const cloudinary = require('cloudinary').v2;
require('dotenv').config();

console.log('=== CLOUDINARY CONFIG CHECK ===');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('\n=== CONFIG LOADED ===');
console.log('Configured:', cloudinary.config().cloud_name ? 'YES' : 'NO');

(async () => {
  try {
    console.log('\n=== TEST UPLOAD ===');
    const result = await cloudinary.uploader.upload('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', {
      folder: 'tripvault-test'
    });
    console.log('✓ Upload Success!');
    console.log('URL:', result.secure_url);
    process.exit(0);
  } catch (err) {
    console.error('✗ Upload Error:', err.message);
    process.exit(1);
  }
})();
