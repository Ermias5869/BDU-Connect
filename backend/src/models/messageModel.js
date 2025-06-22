import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    photo: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false, // Message is unread by default
    },

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message", // Refers to another message for replies
    },
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema);
export default Message;
