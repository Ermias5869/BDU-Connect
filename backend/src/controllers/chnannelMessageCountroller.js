import ChannelMessage from "../models/channelMessageModel.js";
import Channel from "../models/channalModel.js";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

export const sendChannelMessage = async (req, res) => {
  try {
    const { channelId } = req.params;
    const senderId = req.user._id;
    const { text } = req.body;
    const files = [];

    if (req.files.photo) files.push(...req.files.photo);
    if (req.files.video) files.push(...req.files.video);
    if (req.files.file) files.push(...req.files.file);

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (senderId.toString() !== channel.creator.toString()) {
      return res
        .status(403)
        .json({ message: "Only the channel creator can send messages" });
    }

    let media = { photos: [], videos: [], files: [] };

    for (const file of files) {
      if (!file.path) continue;

      const isImage = file.mimetype.startsWith("image/");
      const isVideo = file.mimetype.startsWith("video/");
      const isFile = !isImage && !isVideo;

      try {
        const resourceType = isVideo ? "video" : isFile ? "raw" : "image";

        const uploadResult = file.path;

        if (isImage) {
          media.photos.push(uploadResult);
        } else if (isVideo) {
          media.videos.push(uploadResult);
        } else if (isFile) {
          media.files.push(uploadResult);
        }
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
      }
    }

    const message = await ChannelMessage.create({
      senderId,
      channelId,
      text,
      photo: media.photos.length ? media.photos : null,
      video: media.videos.length ? media.videos : null,
      file: media.files.length ? media.files : null,
    });
    // Update the channel's last message
    await Channel.findByIdAndUpdate(channelId, {
      lastMessage: message._id,
    });
    req.io.to(channalId).emit("newChannalMessage", savedMessage);
    res.status(201).json(message);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send message", error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    // Find the message in the database
    const message = await ChannelMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ message: "You Are Not Sender Of This Message" });
    }

    // Delete media from Cloudinary if they exist
    const mediaFiles = [
      ...(message.photo || []),
      ...(message.video || []),
      ...(message.file || []),
    ];

    // Extract the public IDs of each file
    const publicIds = mediaFiles.map((url) => {
      const urlParts = url.split("/");
      const publicId = urlParts[urlParts.length - 1].split(".")[0]; // Get the public_id
      return publicId;
    });

    // Delete each media file from Cloudinary
    for (const publicId of publicIds) {
      try {
        await cloudinary.uploader.destroy(publicId); // Delete the media from Cloudinary
      } catch (cloudinaryError) {
        console.error(
          `Cloudinary delete error for public_id: ${publicId}`,
          cloudinaryError
        );
      }
    }

    // Delete the message from the database
    await ChannelMessage.deleteOne({ _id: messageId });

    // Respond with a success message
    res.status(204).json({
      message: "Message and associated media deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete message", error: error.message });
  }
};
export const likeUnlikeChannelMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId; // Use messageId instead of id

    // Find the message by messageId
    const message = await ChannelMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "ChannelMessage not found" });
    }

    // Check if the user has already liked the message
    if (message.likes.includes(req.user._id)) {
      // Unlike the message
      await ChannelMessage.findByIdAndUpdate(messageId, {
        $pull: { likes: req.user._id },
      });

      // Return the updated message
      const updatedMessage = await ChannelMessage.findById(messageId);
      return res.status(200).json(updatedMessage); // Return the updated message
    } else {
      // Like the message
      await ChannelMessage.findByIdAndUpdate(messageId, {
        $push: { likes: req.user._id },
      });

      // Return the updated message
      const updatedMessage = await ChannelMessage.findById(messageId);
      return res.status(200).json(updatedMessage); // Return the updated message
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const commentChannelMessage = async (req, res) => {
  try {
    // Find the ChannelMessage by ID
    const channelMessage = await ChannelMessage.findById(req.params.messageId);
    if (!channelMessage) {
      return res.status(404).json({ message: "ChannelMessage not found" });
    }

    // Create the new comment
    const comment = {
      text: req.body.text,
      user: req.user._id,
    };

    // Push the comment to the comments array of the ChannelMessage
    await ChannelMessage.findByIdAndUpdate(req.params.messageId, {
      $push: { comments: comment },
    });

    // Optionally, create a notification for the channel message creator
    const notification = new Notification({
      from: req.user._id,
      to: channelMessage.senderId, // Assuming senderId is the creator of the message
      type: "comment",
    });
    await notification.save();

    res.status(200).json(channelMessage); // Return the updated ChannelMessage
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const deleteChannelComment = async (req, res) => {
  try {
    // Find the ChannelMessage by ID
    const channelMessage = await ChannelMessage.findById(req.params.messageId);
    if (!channelMessage) {
      return res.status(404).json({ message: "ChannelMessage not found" });
    }

    // Find the comment in the comments array
    const comment = channelMessage.comments.find(
      (comment) => comment._id.toString() === req.params.commentId
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the current user is the author of the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Remove the comment from the ChannelMessage
    await ChannelMessage.findByIdAndUpdate(req.params.messageId, {
      $pull: { comments: { _id: comment._id } },
    });

    res.status(204).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updateChannelComment = async (req, res) => {
  try {
    // Find the ChannelMessage by ID
    const channelMessage = await ChannelMessage.findById(req.params.messageId);
    if (!channelMessage) {
      return res.status(404).json({ message: "ChannelMessage not found" });
    }

    // Find the comment to update
    const comment = channelMessage.comments.find(
      (comment) => comment._id.toString() === req.params.commentId
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the current user is the author of the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Update the comment text
    await ChannelMessage.findByIdAndUpdate(
      req.params.messageId,
      {
        $set: { "comments.$[elem].text": req.body.text },
      },
      {
        arrayFilters: [{ "elem._id": req.params.commentId }],
        new: true, // Return the updated document
      }
    );

    res.status(200).json({ message: "Comment updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const dislikeUndislikeChannelMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId; // Use messageId instead of id

    // Find the message by messageId
    const message = await ChannelMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "ChannelMessage not found" });
    }

    // Check if the user has already liked the message
    if (message.dislikes.includes(req.user._id)) {
      // Unlike the message
      await ChannelMessage.findByIdAndUpdate(messageId, {
        $pull: { dislikes: req.user._id },
      });

      // Return the updated message
      const updatedMessage = await ChannelMessage.findById(messageId);
      return res.status(200).json(updatedMessage); // Return the updated message
    } else {
      // Like the message
      await ChannelMessage.findByIdAndUpdate(messageId, {
        $push: { dislikes: req.user._id },
      });

      // Return the updated message
      const updatedMessage = await ChannelMessage.findById(messageId);
      return res.status(200).json(updatedMessage); // Return the updated message
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const message = async (req, res) => {
  try {
    const messages = await ChannelMessage.find({
      channelId: req.params.channelId,
    });
    // .populate({
    //   path: "senderId",
    //   select: "-password",
    // })
    // .populate({
    //   path: "likes",
    //   select: "-password",
    // })
    // .populate({
    //   path: "dislikes",
    //   select: "-password",
    // })
    // .populate({
    //   path: "comment.user",
    //   select: "-password",
    // });

    if (!messages) {
      return res.status(200).json([]);
    }
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const EditMessage = async (req, res) => {
  try {
    const channalMessage = await ChannelMessage.findById(req.params.id);
    if (!channalMessage) {
      return res.status(404).json({ message: "Channel message not found" });
    }

    // Ensure that the sender is the same as the user who is trying to edit the message
    if (channalMessage.senderId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Update the message text
    channalMessage.text = req.body.text;
    await channalMessage.save();

    res.status(200).json(channalMessage);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addReaction = async (req, res) => {
  const { emoji } = req.body;
  const userId = req.user._id;

  try {
    const message = await ChannelMessage.findById(req.params.messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    const alreadyReacted = message.reactions.find(
      (r) => r.emoji === emoji && r.userId.toString() === userId.toString()
    );

    if (alreadyReacted) {
      // remove reaction (toggle)
      message.reactions = message.reactions.filter(
        (r) => !(r.emoji === emoji && r.userId.toString() === userId.toString())
      );
    } else {
      // add new reaction
      message.reactions.push({ emoji, userId });
    }

    await message.save();

    const updated = await ChannelMessage.findById(
      req.params.messageId
    ).populate("reactions.userId", "name");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
