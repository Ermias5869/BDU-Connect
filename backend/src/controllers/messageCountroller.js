import User from "../models/userModel.js";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/messageModel.js";
import Notification from "../models/notificationModel.js";
import { getReceverSocketId, io } from "../lib/socket.js";

export const getFollowedUsersWithLastMessage = async (req, res) => {
  // try {
  //   const userId = req.user._id;

  //   // Find users that the current user follows and are followed back
  //   const followedUsers = await User.find({
  //     _id: { $ne: userId },
  //     followers: userId,
  //     following: userId,
  //   });

  //   // Fetch the last message for each followed user
  //   const usersWithLastMessage = await Promise.all(
  //     followedUsers.map(async (user) => {
  //       const lastMessage = await Message.findOne({
  //         $or: [
  //           { senderId: userId, receiverId: user._id },
  //           { senderId: user._id, receiverId: userId },
  //         ],
  //       })
  //         .sort({ createdAt: -1 })
  //         .exec();

  //       return {
  //         user,
  //         lastMessage,
  //       };
  //     })
  //   );

  //   // Sort users by the timestamp of the last message
  //   usersWithLastMessage.sort((a, b) => {
  //     const dateA = a.lastMessage ? a.lastMessage.createdAt : 0;
  //     const dateB = b.lastMessage ? b.lastMessage.createdAt : 0;
  //     return dateB - dateA;
  //   });

  //   res.status(200).json(usersWithLastMessage);
  // } catch (error) {
  //   res.status(400).json({
  //     status: "fail",
  //     message: "Failed to fetch followed users with last message",
  //   });
  // }
  try {
    const users = await User.find({ _id: { $ne: req.user._id } });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "not all user",
    });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;
    const { text, photo } = req.body;

    let image;
    if (photo) {
      const updatePhoto = await cloudinary.uploader.upload(photo);
      image = updatePhoto.secure_url;
    }

    const message = await Message.create({
      receiverId,
      senderId,
      text,
      photo: image,
    });

    const userSocketId = getReceverSocketId(receiverId);
    if (userSocketId) {
      io.to(userSocketId).emit("newMessage", message);
    }

    res.status(200).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      error: "Failed to send message",
    });
  }
};
export const message = async (req, res) => {
  try {
    const id = req.params.id;
    const id2 = req.user._id;
    const message = await Message.find({
      $or: [
        {
          senderId: id,
          receiverId: id2,
        },
        {
          senderId: id2,
          receiverId: id,
        },
      ],
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "fail",
    });
  }
};
export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user._id; // Logged-in user

    // Find the message
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Ensure the logged-in user is the sender
    if (message.senderId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own messages" });
    }

    // Function to extract Cloudinary public_id from URL
    const getPublicId = (url) => {
      if (!url) return null;
      const parts = url.split("/");
      return parts[parts.length - 1].split(".")[0]; // Extracts public_id (removes extension)
    };

    // Delete image from Cloudinary
    if (message.photo) {
      const photoPublicId = getPublicId(message.photo);
      await cloudinary.uploader.destroy(photoPublicId, {
        resource_type: "image",
      });
    }

    // Delete video from Cloudinary
    if (message.video) {
      const videoPublicId = getPublicId(message.video);
      await cloudinary.uploader.destroy(videoPublicId, {
        resource_type: "video",
      });
    }

    // Delete the message from MongoDB
    await Message.findByIdAndDelete(messageId);

    res.status(200).json({ message: "Message and media deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete message", error: error.message });
  }
};
export const updateText = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not find" });
    }
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to edit this message" });
    }
    const newMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true }
    );
    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({
      status: "server fail",
      message: error.message,
    });
  }
};
export const sendReply = async (req, res) => {
  try {
    const { id } = req.params; // The original message ID being replied to
    const senderId = req.user._id;
    const { text } = req.body;

    // Check if the original message exists
    const originalMessage = await Message.findById(id);
    if (!originalMessage) {
      return res.status(404).json({ message: "Original message not found" });
    }

    // Ensure the sender and receiver are following each other
    const sender = await User.findById(senderId);
    const receiver = await User.findById(originalMessage.senderId);
    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const senderFollowsReceiver = sender.following.includes(receiver._id);
    const receiverFollowsSender = receiver.following.includes(senderId);

    if (!senderFollowsReceiver || !receiverFollowsSender) {
      return res.status(403).json({
        message: "You can only message users who follow you back",
      });
    }

    // Create the reply message
    const replyMessage = await Message.create({
      senderId,
      receiverId: originalMessage.senderId, // Send the reply back to the original sender
      text,
      replyTo: id, // Link to the original message
    });

    const newnotification = new Notification({
      from: senderId,
      to: originalMessage.senderId,
      type: "reply",
    });
    await newnotification.save();
    res
      .status(200)
      .json({ message: "Reply sent successfully", data: replyMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params; // Message ID to mark as read
    const userId = req.user._id; // Logged-in User ID

    // Find the message by ID
    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if the current user is the receiver of the message
    if (message.receiverId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not the receiver" });
    }

    // Mark the message as read
    message.isRead = true;

    // Save the updated message
    await message.save();

    res.status(200).json({ message: "Message marked as read", data: message });
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark the message as read",
      error: error.message,
    });
  }
};
