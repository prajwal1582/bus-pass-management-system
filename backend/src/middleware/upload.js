// backend/src/middleware/upload.js
const path = require('path');
const multer = require('multer');

// Store uploads in a local 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    // Use timestamp + original name to avoid collisions
    const unique = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
    cb(null, unique);
  },
});

// Accept only specific file types for documents (pdf, jpg, png)
const fileFilter = (req, file, cb) => {
  const allowed = /pdf|jpg|jpeg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) cb(null, true);
  else cb(new Error('Unsupported file type'), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
