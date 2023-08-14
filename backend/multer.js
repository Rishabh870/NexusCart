const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dsefier2u",
  api_key: "828854711416964",
  api_secret: "TT2YEdcsUWe28puwZVKcN9YEtKs",
});
// Define the storage for uploaded files
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Uploads directory where files will be saved
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const originalExtension = file.originalname.split(".").pop();
//     cb(null, file.fieldname + "-" + uniqueSuffix + "." + originalExtension);
//   },
// });
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "nexuscart/images",
    format: async (req, file) => "png",
    allowedformat: ["jpg", "jpeg,png,gif"],
    public_id: (req, file) => {
      file.filename;
    },
  },
});

// Initialize multer with the storage and file filter options
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit the file size to 5MB
  },
});

module.exports = upload;
