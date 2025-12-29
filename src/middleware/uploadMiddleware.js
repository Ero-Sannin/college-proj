const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// storage settings
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'technician_hiring',      // folder in cloud
    allowed_formats: ['jpg', 'png', 'jpeg','webp'],
    transformation: [{ width: 300, height: 300, crop: 'fill' }],
  },
});

const upload = multer({ storage });

module.exports = upload;
