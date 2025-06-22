import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
    },
    description: {
      type: String,
      default: "",
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
          "group link must start with 'bdu/me/' and be longer than 6 characters.",
      },
    },
    photo: {
      type: String,
      default: "bduLogo.jpg",
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
        default: [],
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupMessage",
      default: null,
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);
export default Group;
