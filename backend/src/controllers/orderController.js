import Order from "../models/orderModel.js";
import orders from "../lib/data.js";
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};
export const updateIsAvailable = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { isAvailable: req.body.isAvailable },
      { new: true }
    );
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating order" });
  }
};
export const importOrder = async (req, res) => {
  try {
    await Order.deleteMany(); // optional: clear existing
    const created = await Order.insertMany(orders);
    res.status(201).json({ message: "orders imported", count: created.length });
  } catch (error) {
    res.status(500).json({ message: "Failed to import", error: error.message });
  }
};
export const order1 = async (req, res) => {
  try {
    const order = await Order.find({ type: "የጾም" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};
export const order2 = async (req, res) => {
  try {
    const order = await Order.find({ type: "የፍስግ" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};
