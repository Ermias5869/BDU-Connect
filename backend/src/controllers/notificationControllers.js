import Notification from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId })
      .populate({
        path: "from",
        select: "name photo studentId",
      })
      .sort("-createdAt");

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ to: req.user._id });
    res.status(200).json({ message: "All notifications deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
