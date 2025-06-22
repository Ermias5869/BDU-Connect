import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      trim: true,
      unique: true,
      validate: {
        validator: function (value) {
          return (
            value &&
            value.toLowerCase().startsWith("bdu") &&
            value.length === 10
          );
        },
        message:
          "Username must start with 'bdu' and be exactly 10 characters long",
      },
    },
    photo: {
      type: String,
      default: "noProfile.jpg",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password minimum is 8 characters"],
    },
    passwordConfirm: {
      type: String,
      required: [true, "PasswordConfirm is required"],
      minlength: [8, "Password minimum is 8 characters"],
      validate: {
        validator: function (value) {
          return this.password === value;
        },
        message: "Passwords do not match",
      },
    },
    role: {
      type: String,
      enum: ["student", "teacher", "cafeworker", "administrator"],
      default: "student",
      select: false,
    },
    followers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    bio: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },

    likedPosts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
    likedReels: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Reel",
        default: [],
      },
    ],
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});
userSchema.methods.checkPassword = async function (password, hashpassword) {
  return await bcrypt.compare(password, hashpassword);
};
userSchema.methods.correctPassword = async function (password, userpassaword) {
  return await bcrypt.compare(password, userpassaword);
};
const User = mongoose.model("User", userSchema);

export default User;
