const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

let upload;

if (isConfigured) {
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'roomieconnect',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
  });
  upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
} else {
  console.warn('⚠️  Cloudinary not configured — file uploads disabled');
  upload = multer({ storage: multer.memoryStorage() });
}

module.exports = { cloudinary, upload };
