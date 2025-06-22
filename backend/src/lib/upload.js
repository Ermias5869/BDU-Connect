import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// Cloudinary storage setup with video compression
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "reels", // Folder in Cloudinary
    resource_type: "video", // Ensure it's a video
    transformation: [
      {
        quality: "auto", // Auto-adjust quality
        fetch_format: "mp4", // Convert to MP4 for better compression
        bit_rate: "500k", // Reduce bit rate (adjust as needed)
        width: 720, // Resize to 720p
        crop: "limit", // Ensure aspect ratio remains
      },
    ],
  },
});

// Multer configuration with file size limit
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Max 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed!"), false);
    }
  },
});
export default upload;
