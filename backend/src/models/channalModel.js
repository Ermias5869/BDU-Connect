import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Channal Name Must Be"],
    },
    description: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      default: "bduLogo.jpg",
    },
    link: {
      type: String,
      unique: true,
      required: [true, "link is must be"],
      validate: {
        validator: function (value) {
          return /^bdu\/me\//.test(value) && value.length > 13;
        },
        message:
          "Channel link must start with 'bdu/me/' and be longer than 6 characters.",
      },
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    type: {
      type: String,
      enum: ["normal", "commen"],
      default: "normal",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChannelMessage", // Reference to ChannelMessage
      default: null,
    },
  },
  { timestamps: true }
);

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
