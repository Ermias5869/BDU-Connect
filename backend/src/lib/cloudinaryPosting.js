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
    let format = "mp4"; // Default to mp4 for videos

    if (file.mimetype.startsWith("image/")) {
      format = "jpeg"; // Convert images to JPEG
    }

    return {
      folder,
      format,
      public_id: `post-${req.user._id}-${Date.now()}`,
      resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
    };
  },
});

// Define the upload middleware for multiple fields
export const uploadMulter = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
}).fields([
  { name: "photo", maxCount: 1 }, // Single image upload
  { name: "video", maxCount: 1 }, // Single video upload
]);
