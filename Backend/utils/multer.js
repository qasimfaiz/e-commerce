const multer = require("multer");

// Multer configuration
const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  // Check if the file is an image with the allowed extensions
  if (
    file.mimetype.startsWith("image/") &&
    /\.(png|jpg|jpeg)$/.test(file.originalname)
  ) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file

    return cb(
      new Error("Only .png, .jpg, and .jpeg image files are allowed"),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Set the file size limit (5 MB in this case)
  },
  fileFilter, // Add the fileFilter function
});

const uploadWithoutFilter = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Set the file size limit (5 MB in this case)
  },
});

// Export the upload with file filtering as the default export
module.exports = upload;

// Export the uploadWithoutFilter as a named export
module.exports.uploadWithoutFilter = uploadWithoutFilter;
