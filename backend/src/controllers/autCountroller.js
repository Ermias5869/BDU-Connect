import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "No input sent",
      });
    }

    const user = await User.create(req.body);

    if (!user) {
      return res.status(500).json({
        status: "fail",
        message: "Sign up failed",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECURE, {
      expiresIn: process.env.JWT_EXP,
    });

    if (!token) {
      return res.status(500).json({
        status: "fail",
        message: "Token generation failed",
      });
    }

    // Set cookie with secure cross-origin settings
    res.cookie("jwt", token, {
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
      httpOnly: true,
      sameSite: "none", // Allow cross-site cookie
      secure: true, // HTTPS only
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({
        status: "fail",
        message: "signin must put studentId and password",
      });
    }

    const user = await User.findOne({ studentId });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "not user",
      });
    }

    const isPasswordCorrect = await user.checkPassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: "fail",
        message: "password or studentId is incorrect",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECURE, {
      expiresIn: process.env.JWT_EXP,
    });

    res.cookie("jwt", token, {
      maxAge: 10 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none", // 🔥 Required for cross-origin
      secure: true, // 🔥 Required with sameSite: "none"
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(400).json({
        status: "fail",
        message: "no token",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECURE);
    if (!decode) {
      return res.status(400).json({
        status: "fail",
        message: "no decoded",
      });
    }
    const user = await User.findById(decode.id).select("+role");

    req.user = user;
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
export const restriction = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "you are not permissin to done this",
      });
    }
    next();
  };
};
export const updatPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (
      !req.body.studentId ||
      !req.body.password ||
      !req.body.newpassword ||
      !req.body.newpasswordConfirm
    ) {
      return res.status(400).json({
        status: "fail",
        message: "email and password is must",
      });
    }

    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).json({
        status: "fail",
        message: "password not the same",
      });
    }

    if (await user.correctPassword(req.body.newpassword, user.password)) {
      return res.status(400).json({
        status: "fail",
        message: "password and newpassword is can not the same",
      });
    }

    if (!(req.body.newpassword === req.body.newpasswordConfirm)) {
      return res.status(400).json({
        status: "fail",
        message: "must be confirm",
      });
    }

    user.password = req.body.newpassword;
    user.passwordConfirm = req.body.newpasswordConfirm;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECURE, {
      expiresIn: process.env.JWT_EXP,
    });

    res.cookie("jwt", token, {
      maxAge: 10 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
export const uploadPhoto = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { photo: req.file.path }, // Store Cloudinary URL instead of filename
      { new: true }
    );

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getme = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const check = (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};
