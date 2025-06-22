import cloudinary from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage for profile photos
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "BDUConnect/users",

    transformation: [{ width: 500, height: 500, crop: "fill" }],
  },
});

// Cloudinary storage for cover images
const coverStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "BDUConnect/coverImages",

    transformation: [{ width: 1080, height: 720, crop: "fill" }],
  },
});

export const uploadProfile = multer({ storage: profileStorage }).single(
  "photo"
);
export const uploadCover = multer({ storage: coverStorage }).single(
  "coverImage"
);
