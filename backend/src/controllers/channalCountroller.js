import Channel from "../models/channalModel.js";

export const createChannal = async (req, res) => {
  try {
    const { name, link, description } = req.body;
    const creatorId = req.user._id;

    const existingChannal = await Channel.findOne({ link });
    if (existingChannal) {
      return res
        .status(400)
        .json({ message: "Channal In This Link Already Exist" });
    }
    const newChannel = new Channel({
      name,
      description,
      link,
      creator: creatorId,
      members: [creatorId], // The creator is added as the first member
    });

    await newChannel.save();
    res.status(201).json(newChannel);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
export const joinChannel = async (req, res) => {
  try {
    const { channelId } = req.params; // The channel ID to join
    const userId = req.user._id; // Get the user ID

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    if (userId.toString() === channel.creator.toString()) {
      return res
        .status(404)
        .json({ message: "You are Creater of this channel" });
    }
    if (channel.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already a member of this channel" });
    }

    channel.members.push(userId); // Add user to channel members
    await channel.save();

    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({
      message: "Failed to join channel",
      error: error.message,
    });
  }
};
export const leaveChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id; // Get the user ID

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    if (userId.toString() === channel.creator.toString()) {
      return res
        .status(404)
        .json({ message: "You are Creater of this channel" });
    }

    if (!channel.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are not a member of this channel" });
    }

    // Remove the user from the channel's members list
    channel.members.pull(userId);
    await channel.save();

    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({
      message: "Failed to leave channel",
      error: error.message,
    });
  }
};
export const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;
    const channal = await Channel.findById(channelId);
    if (!channal) {
      return res.json({ message: "Channal is no find" });
    }
    if (!(channal.creator.toString() == userId.toString())) {
      return res.json({ message: "unautorize" });
    }
    await Channel.findByIdAndDelete(channelId);
    res.status(200).json({ message: "Channal delete is Successful" });
  } catch (error) {}
};
export const ChannalProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const channel = await Channel.findById(req.params.channelId);
    if (!channel) {
      return res.json({ message: "Channal is not define" });
    }
    if (!(channel.creator.toString() == userId.toString())) {
      return res.json({ message: "unautorize" });
    }
    channel.photo = req.file.path;
    await channel.save();

    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
export const MyChannal = async (req, res) => {
  try {
    const userId = req.user._id;

    const channal = await Channel.find({ creator: userId }).populate(
      "lastMessage"
    );
    if (!channal) {
      return res.status(200).json([]);
    }

    res.status(200).json(channal);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
export const JoinedChannal = async (req, res) => {
  try {
    const userId = req.user._id;
    const channal = await Channel.find({
      $or: [{ members: { $in: userId } }, { type: "commen" }],
    }).populate("lastMessage");
    if (!channal) {
      return res.status(200).json([]);
    }

    res.status(200).json(channal);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channalId)
      .populate({
        path: "creator",
        select: "name studentId photo",
      })
      .populate({
        path: "members",
        select: "name studentId photo ",
      });
    if (!channel) {
      return res.status(404).json("channel not found");
    }
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  {
  }
};
export const getAllChannel = async (req, res) => {
  try {
    const channel = await Channel.find().populate("lastMessage");

    if (!channel) {
      return res.status(404).json("channel not found");
    }
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getCommenChannel = async (req, res) => {
  try {
    const channel = await Channel.find({ type: "commen" }).populate(
      "lastMessage"
    );

    if (!channel || channel.length === 0) {
      return res.status(404).json("Channel not found");
    }

    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateChannalInfo = async (req, res) => {
  try {
    const channal = await Channel.findById(req.params.channelId);
    if (!channal) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Optional: Check if the current user has permission to update
    // if (channal.owner.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "Not authorized to update this channel" });
    // }

    const updatedChannel = await Channel.findByIdAndUpdate(
      req.params.channelId,
      {
        name: req.body.name,
        description: req.body.description,
        link: req.body.link,
      },
      { new: true }
    );

    res.status(200).json(updatedChannel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
