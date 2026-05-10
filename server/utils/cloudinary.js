const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage if Cloudinary is not configured
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

let storage;

if (isCloudinaryConfigured) {
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  storage = new CloudinaryStorage({
    cloudinary,
    params: { folder: 'roomieconnect', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
  });
} else {
  console.warn('Cloudinary not configured — using memory storage');
  storage = multer.memoryStorage();
}

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { cloudinary, upload };
