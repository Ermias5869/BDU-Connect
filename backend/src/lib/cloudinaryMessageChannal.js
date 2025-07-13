import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "bdu-connect/posts";
    let format;

    if (file.mimetype.startsWith("image/")) {
      format = "jpeg";
    } else if (file.mimetype.startsWith("video/")) {
      format = "mp4";
    } else {
      format = undefined; // For raw files like PDFs, DOCXs
    }

    return {
      folder,
      format,
      public_id: `post-${req.user._id}-${Date.now()}`,
      resource_type: file.mimetype.startsWith("video/")
        ? "video"
        : file.mimetype.startsWith("image/")
        ? "image"
        : "raw",
    };
  },
});
export const uploadMulter = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
}).fields([
  { name: "photo", maxCount: 5 }, // Allow multiple photos
  { name: "video", maxCount: 3 }, // Allow multiple videos
  { name: "file", maxCount: 3 }, // Allow multiple document uploads (PDF, DOCX, etc.)
]);
