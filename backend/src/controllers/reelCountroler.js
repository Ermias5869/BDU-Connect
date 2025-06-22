import Reel from "../models/reelModel.js";
import cloudinary from "../lib/cloudinary.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
export const createReel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video uploaded" });
    }

    const newReel = new Reel({
      user: req.user._id,
      video: req.file.path,
      caption: req.body.caption,
    });

    await newReel.save();
    res.status(200).json(newReel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteReel = async (req, res) => {
  try {
    const { id } = req.params;

    const reel = await Reel.findById(id);

    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }
    if (reel.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const videoUrl = reel.video;
    const publicId = videoUrl.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(`reels/${publicId}`, {
      resource_type: "video",
    });

    await Reel.findByIdAndDelete(id);

    res.status(200).json({ message: "Reel deleted successfully" });
  } catch (error) {
    console.error("Error deleting reel:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const likeUnlikeReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: "reel not found" });
    }
    if (reel.likes.includes(req.user._id)) {
      await Reel.findByIdAndUpdate(req.params.id, {
        $pull: { likes: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { likedReels: req.params.id },
      });
      // send notification
      const notification = new Notification({
        from: req.user._id,
        to: reel.user,
        type: "unlikeReel",
      });
      await notification.save();
      res.status(200).json(reel);
    } else {
      await Reel.findByIdAndUpdate(req.params.id, {
        $push: { likes: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { likedReels: req.params.id },
      });
      const notification = new Notification({
        from: req.user._id,
        to: reel.user,
        type: "likeReel",
      });
      await notification.save();
      res.status(200).json(reel);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const commentReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: "reel not found" });
    }
    const comment = {
      text: req.body.text,
      user: req.user._id,
    };

    await Reel.findByIdAndUpdate(req.params.id, {
      $push: { comments: comment },
    });
    const notification = new Notification({
      from: req.user._id,
      to: reel.user,
      type: "comment",
    });
    await notification.save();
    res.status(200).json(reel);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: "reel not found" });
    }
    const comment = reel.comments.find(
      (comment) => comment._id.toString() === req.params.commentId
    );
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await Reel.findByIdAndUpdate(req.params.id, {
      $pull: { comments: { _id: comment._id } },
    });
    res.status(204).json({ message: "comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updatecomment = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: "video not found" });
    }
    const comment = reel.comments.find(
      (comment) => comment._id.toString() === req.params.commentId
    );
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await Reel.findByIdAndUpdate(
      req.params.id,
      {
        $set: { "comments.$[elem].text": req.body.text },
      },
      {
        arrayFilters: [{ "elem._id": req.params.commentId }], // Correctly specify the filter
        new: true, // Return the updated document
      }
    );
    res.status(200).json({ message: "comment updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getAllVideos = async (req, res) => {
  try {
    const reels = await Reel.find({ user: { $ne: req.user._id } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (reels.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(reels);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getVideo = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id)
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (!reel) {
      return res.status(404).json({ message: "video not found" });
    }
    res.status(200).json(reel);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getMyVideos = async (req, res) => {
  try {
    const reels = await Reel.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (reels.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(reels);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getFollowingsVideo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const reels = await Reel.find({ user: { $in: user.following } })
      .sort("-createdAt")
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (reels.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(reels);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getUserVedios = async (req, res) => {
  try {
    const user = await User.findOne({ studentId: req.params.studId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const reel = await Reel.find({ user: user._id })
      .sort("-createdAt")
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (reel.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(reel);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const likedVideos = async (req, res) => {
  try {
    const user = await User.findOne({ studentId: req.params.studId });

    const reels = await Reel.find({ likes: { $in: [user._id] } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    console.log("sssss", reels);
    if (reels.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(reels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const userLikedVideos = async (req, res) => {
  try {
    const reel = await Reel.find({
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
    if (reel.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(reel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
