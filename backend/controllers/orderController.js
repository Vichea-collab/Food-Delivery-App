import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Use frontend URL from environment variable
const FRONTEND_URL = process.env.FRONTEND_URL;

// Place a new order and initiate Stripe checkout
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });

    await newOrder.save();

    // Clear user cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Prepare Stripe line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Add delivery charge
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 200, // $2
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Order Error:", error);
    res.json({ success: false, message: "Error placing order" });
  }
};

// Verify order after Stripe payment
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment verified" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed or cancelled" });
    }
  } catch (error) {
    console.error("Verify Error:", error);
    res.json({ success: false, message: "Error verifying order" });
  }
};

// Get orders for a specific user
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("User Orders Error:", error);
    res.json({ success: false, message: "Error fetching user orders" });
  }
};

// Admin: List all orders
const listOrders = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    if (userData?.role === "admin") {
      const orders = await orderModel.find({});
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "Unauthorized: Not an admin" });
    }
  } catch (error) {
    console.error("List Orders Error:", error);
    res.json({ success: false, message: "Error listing orders" });
  }
};

// Admin: Update order status
const updateStatus = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    if (userData?.role === "admin") {
      await orderModel.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status,
      });
      res.json({ success: true, message: "Order status updated" });
    } else {
      res.json({ success: false, message: "Unauthorized: Not an admin" });
    }
  } catch (error) {
    console.error("Update Status Error:", error);
    res.json({ success: false, message: "Error updating order status" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
