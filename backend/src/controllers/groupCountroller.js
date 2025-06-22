import Group from "../models/groupModel.js";

export const createGroup = async (req, res) => {
  try {
    const { name, description, link } = req.body;
    const createrId = req.user._id;
    const existingGroup = await Group.findOne({ link });
    if (existingGroup) {
      return res
        .status(400)
        .json({ message: "Group In This Link Already Exist" });
    }
    const group = new Group({
      name,
      link,
      description,
      creator: createrId,
      members: [createrId],
    });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (userId.toString() === group.creator.toString()) {
      return res.status(404).json({ message: "You are Creater of this group" });
    }
    if (group.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already a member of this group" });
    }

    group.members.push(userId); // Add user to channel members
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({
      message: "Failed to join channel",
      error: error.message,
    });
  }
};
export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (userId.toString() === group.creator.toString()) {
      return res.status(404).json({ message: "You are Creater of this group" });
    }

    if (!group.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are not a member of this group" });
    }

    group.members.pull(userId);
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({
      message: "Failed to leave group",
      error: error.message,
    });
  }
};
export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.json({ message: "Group is no find" });
    }
    if (!(group.creator.toString() == userId.toString())) {
      return res.json({ message: "unautorize" });
    }
    await Group.findByIdAndDelete(groupId);
    res.status(200).json({ message: "delete is Successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const groupProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.json({ message: "group is not define" });
    }
    if (!group.members.includes(userId)) {
      return res.json({ message: "You Are Not Join This Group" });
    }
    group.photo = req.file.path;
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
export const MyGroup = async (req, res) => {
  try {
    const userId = req.user._id;

    const group = await Group.find({ creator: userId }).populate("lastMessage");
    if (!group) {
      return res.status(200).json([]);
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
export const JoinedGroup = async (req, res) => {
  try {
    const userId = req.user._id;
    const group = await Group.find({ members: { $in: userId } }).populate(
      "lastMessage"
    );
    if (!group) {
      return res.status(200).json([]);
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
export const getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate({
        path: "creator",
        select: "name studentId photo",
      })
      .populate({
        path: "members",
        select: "name studentId photo ",
      });

    if (!group) {
      return res.status(404).json("Group not found");
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  {
  }
};
export const getAllGroup = async (req, res) => {
  try {
    const group = await Group.find().populate("lastMessage");

    if (!group) {
      return res.status(404).json("group not found");
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateGroupInfo = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Optional: Check if the current user has permission to update
    if (group.creator.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this channel" });
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.groupId,
      {
        name: req.body.name,
        description: req.body.description,
        link: req.body.link,
      },
      { new: true }
    );

    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
