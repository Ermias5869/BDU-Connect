import Notification from "../models/notificationModel.js";
import Post from "../models/postModel.js";
import cloudinary from "cloudinary";
import User from "../models/userModel.js";
export const createPost = async (req, res) => {
  try {
    const post = new Post({
      user: req.user._id,
      text: req.body.text,
      image: req.files.map((file) => file.path), // Cloudinary returns `file.path` as URL
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (post.image && post.image.length > 0) {
      await Promise.all(
        post.image.map(async (imageUrl) => {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await cloudinary.v2.uploader.destroy(publicId);
        })
      );
    }

    await post.deleteOne();
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    if (post.likes.includes(req.user._id)) {
      await Post.findByIdAndUpdate(req.params.id, {
        $pull: { likes: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { likedPosts: req.params.id },
      });
      // send notification
      const notification = new Notification({
        from: req.user._id,
        to: post.user,
        type: "unlike",
      });
      await notification.save();
      res.status(200).json(post);
    } else {
      await Post.findByIdAndUpdate(req.params.id, {
        $push: { likes: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { likedPosts: req.params.id },
      });
      const notification = new Notification({
        from: req.user._id,
        to: post.user,
        type: "like",
      });
      await notification.save();
      res.status(200).json(post);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    const comment = {
      text: req.body.text,
      user: req.user._id,
    };

    await Post.findByIdAndUpdate(req.params.id, {
      $push: { comments: comment },
    });
    const notification = new Notification({
      from: req.user._id,
      to: post.user,
      type: "comment",
    });
    await notification.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment._id.toString() === req.params.commentId
    );
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await Post.findByIdAndUpdate(req.params.id, {
      $pull: { comments: { _id: comment._id } },
    });
    res.status(204).json({ message: "comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updatecomment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment._id.toString() === req.params.commentId
    );
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: { "comments.$[elem].text": req.body.text },
      },
      {
        arrayFilters: [{ "elem._id": req.params.commentId }], // Correctly specify the filter
        new: true, // Return the updated document
      }
    );
    res.status(204).json({ message: "comment updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: { $ne: req.user._id } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(404).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (posts.length === 0) {
      return res.status(404).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getFollowingsPost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await Post.find({ user: { $in: user.following } })
      .sort("-createdAt")
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getUserPosts = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = await Post.find({ user: user._id })
      .sort("-createdAt")
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (post.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
