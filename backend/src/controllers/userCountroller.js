import Notification from "../models/notificationModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export const getUserProfile = async (req, res) => {
  try {
    const { studId } = req.params;
    const user = await User.findOne({ studentId: studId })
      .populate({
        path: "followers",
        select: "name photo studentId",
      })
      .populate({
        path: "following",
        select: "name photo studentId",
      });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const followedUser = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    console.log(followedUser, currentUser, "  i");
    if (!followedUser || !currentUser) {
      return res.status(404).json({ message: "user not found" });
    }
    if (id === req.user._id) {
      return res.status(400).json({ message: "you can't follow yourself" });
    }
    if (currentUser.following.includes(id)) {
      await currentUser.updateOne({ $pull: { following: id } });
      await followedUser.updateOne({ $pull: { followers: req.user._id } });
      //send notification
      const newNotification = new Notification({
        from: req.user._id,
        to: id,
        type: "unfollow",
      });
      await newNotification.save();

      res.status(200).json({ message: " unfollow success" });
    } else {
      await currentUser.updateOne({ $push: { following: id } });
      await followedUser.updateOne({ $push: { followers: req.user._id } });
      //send notification
      const newNotification = new Notification({
        from: req.user._id,
        to: id,
        type: "follow",
      });
      await newNotification.save();

      res.status(200).json({ message: "followsuccess" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const suggestUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ message: "user not found" });
    }
    const users = await User.aggregate([
      { $match: { _id: { $ne: req.user.id } } },
      { $sample: { size: 10 } },
    ]);
    const filterUsers = users.filter(
      (user) => !currentUser.following.includes(user._id)
    );
    const suggestUsers = filterUsers.slice(0, 4);
    suggestUsers.forEach((user) => {
      user.passsword = null;
    });
    res.status(200).json(suggestUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "uaer not found" });
    }
    const { name, bio, link } = req.body;
    const obj = {
      name,
      bio,
      link,
    };
    const update = await User.findByIdAndUpdate(req.user._id, obj, {
      new: true,
    });
    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const likedPosts = async (req, res) => {
  try {
    const user = await User.findOne({ studentId: req.params.studId });
    const posts = await Post.find({ likes: { $in: user._id } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const userLikedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.params.id,
      likes: { $in: [req.user._id] },
    })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
