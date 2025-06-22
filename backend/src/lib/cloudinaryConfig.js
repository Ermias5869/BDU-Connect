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
  params: {
    folder: "bdu-connect/posts", // Cloudinary folder
    format: async (req, file) => "jpeg", // Convert all images to JPEG
    public_id: (req, file) => `post-${req.user._id}-${Date.now()}`,
    transformation: [
      { width: 1080, height: 1080, crop: "limit", quality: "auto" },
    ], // Resize
  },
});

// Multer Upload Middleware
export const uploadMulter = multer({ storage }).array("image");
