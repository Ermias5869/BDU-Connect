import Order from "../models/orderModel.js";
import stripePackage from "stripe";

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

export const getCheckOut = async (req, res) => {
  try {
    const food = await Order.findById(req.params.Id);

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${process.env.FRONT_END_URL}/service`,
      cancel_url: `${process.env.FRONT_END_URL}/detail/${req.params.Id}`,
      customer_email: req.user.email,
      client_reference_id: req.params.Id,
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${food.name}`,
            },
            unit_amount: food.price * 100,
          },
          quantity: food.number || 1,
        },
      ],
    });

    res.status(200).json({
      status: "success",
      session,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Checkout session creation failed",
      error: error.message,
    });
  }
};
