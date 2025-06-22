import GroupMessage from "../models/groupMessageModel.js";
import Group from "../models/groupModel.js";

export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const senderId = req.user._id;
    const { text } = req.body;
    const files = [];

    if (req.files.photo) files.push(...req.files.photo);
    if (req.files.video) files.push(...req.files.video);
    if (req.files.file) files.push(...req.files.file);

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.includes(senderId)) {
      return res
        .status(403)
        .json({ message: "Only the join group User can send messages" });
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

    const message = await GroupMessage.create({
      senderId,
      groupId,
      text,
      photo: media.photos.length ? media.photos : null,
      video: media.videos.length ? media.videos : null,
      file: media.files.length ? media.files : null,
    });
    await Group.findByIdAndUpdate(groupId, {
      lastMessage: message._id,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res
      .status(500)
      .json({ message: "Failed to send message", error: error.message });
  }
};
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    // Find the message in the database
    const message = await GroupMessage.findById(messageId);
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
    await GroupMessage.deleteOne({ _id: messageId });

    // Respond with a success message
    res.status(204).json({
      message: "Message and associated media deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res
      .status(500)
      .json({ message: "Failed to delete message", error: error.message });
  }
};
export const likeUnlikeGroupMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId; // Use messageId instead of id

    // Find the message by messageId
    const message = await GroupMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "GroupMessage not found" });
    }

    // Check if the user has already liked the message
    if (message.likes.includes(req.user._id)) {
      // Unlike the message
      await GroupMessage.findByIdAndUpdate(messageId, {
        $pull: { likes: req.user._id },
      });

      // Return the updated message
      const updatedMessage = await GroupMessage.findById(messageId);
      return res.status(200).json(updatedMessage); // Return the updated message
    } else {
      // Like the message
      await GroupMessage.findByIdAndUpdate(messageId, {
        $push: { likes: req.user._id },
      });

      // Return the updated message
      const updatedMessage = await GroupMessage.findById(messageId);
      return res.status(200).json(updatedMessage); // Return the updated message
    }
  } catch (error) {
    console.error("Error liking/unliking message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const dislikeUndislikeGroupMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId; // Use messageId instead of id

    // Find the message by messageId
    const message = await GroupMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "GroupMessage not found" });
    }

    if (message.dislikes.includes(req.user._id)) {
      await GroupMessage.findByIdAndUpdate(messageId, {
        $pull: { dislikes: req.user._id },
      });

      const updatedMessage = await GroupMessage.findById(messageId);
      return res.status(200).json(updatedMessage);
    } else {
      await GroupMessage.findByIdAndUpdate(messageId, {
        $push: { dislikes: req.user._id },
      });

      const updatedMessage = await GroupMessage.findById(messageId);
      return res.status(200).json(updatedMessage);
    }
  } catch (error) {
    console.error("Error disliking/undisliking message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const sendReply = async (req, res) => {
  try {
    const { messageId } = req.params; // The original message ID being replied to
    const senderId = req.user._id;
    const { text } = req.body;

    // Check if the original message exists
    const originalMessage = await GroupMessage.findById(messageId);
    if (!originalMessage) {
      return res.status(404).json({ message: "Original message not found" });
    }

    // Create the reply message
    const replyMessage = await GroupMessage.create({
      senderId,
      groupId: originalMessage.groupId,
      text,
      replyTo: messageId,
    });

    res.status(200).json(replyMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const message = async (req, res) => {
  try {
    const messages = await GroupMessage.find({
      groupId: req.params.groupId,
    }).populate({
      path: "senderId",
      select: "-password",
    });

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
    const groupMessage = await GroupMessage.findById(req.params.id);
    if (!groupMessage) {
      return res.status(404).json({ message: "Group message not found" });
    }

    // Ensure that the sender is the same as the user who is trying to edit the message
    if (groupMessage.senderId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Update the message text
    groupMessage.text = req.body.text;
    await groupMessage.save();

    res.status(200).json(groupMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const addReaction = async (req, res) => {
  const { emoji } = req.body;
  const userId = req.user._id;

  try {
    const message = await GroupMessage.findById(req.params.messageId);
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

    const updated = await GroupMessage.findById(req.params.messageId).populate(
      "reactions.userId",
      "name"
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
