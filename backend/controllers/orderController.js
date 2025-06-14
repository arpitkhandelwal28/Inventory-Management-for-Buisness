const Order = require("../models/Order");
const itemModel = require("../models/itemModel");

// PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const { products } = req.body;
    let totalPrice = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await itemModel.findOne({ productId: item.product }); 
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      orderProducts.push({
        product: item.product,  
        name: product.name,     
        price: product.price,   
        quantity: item.quantity
      });
    }

    const order = new Order({
      user: req.userId,
      products: orderProducts,
      totalPrice
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET USER ORDERS
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL ORDERS (ADMIN ONLY)
exports.getAllOrders = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find().populate("user", "name email");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
