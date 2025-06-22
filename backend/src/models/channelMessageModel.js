import mongoose from "mongoose";

const channelMessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    reactions: [
      {
        emoji: String, // Emoji like ❤️, 😂, 🔥
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

    photo: [
      {
        type: String,
      },
    ],
    video: [
      {
        type: String,
      },
    ],
    file: [
      {
        type: String,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ChannelMessage = mongoose.model("ChannelMessage", channelMessageSchema);
export default ChannelMessage;
