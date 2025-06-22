import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  number: {
    type: Number,
    default: 1,
  },

  image: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    enum: ["የፍስግ", "የጾም"],
    required: true,
  },
});
const Order = mongoose.model("Order", orderSchema);
export default Order;
