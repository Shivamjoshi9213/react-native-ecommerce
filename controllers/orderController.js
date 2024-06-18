import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
// import { stripe } from "../Server.js";

export const createOrderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    } = req.body;
    //valdiation
    // if (
    //   !shippingInfo ||
    //   !orderItems ||
    //   !paymentMethod ||
    //   !paymentInfo ||
    //   !itemPrice ||
    //   !tax ||
    //   !shippingCharges ||
    //   !totalAmount
    // ) {
    //     return res.status(404).send({
    //       success: false,
    //       message: "Please provide all fields ",
    //     });
    // }
    // create order
    await orderModel.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    });

    // stock update
    for (let i = 0; i < orderItems.length; i++) {
      // find product
      const product = await productModel.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity;
      await product.save();
    }
    res.status(201).send({
      success: true,
      message: "Order Placed Successfully ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create order api",
    });
  }
};

// get all orders
export const getMyOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({ user: req.user._id });

    if (!orders) {
      return res.status(404).send({
        success: false,
        message: "no order found",
      });
    }
    res.status(200).send({
      success: true,
      message: "your orders data",
      totalOrder: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get order api",
    });
  }
};

// single order controller
export const singleOrderDetailsController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).send({
        success: true,
        message: "Order not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Your order fetched",
      order,
    });
  } catch (error) {
    console.log(error);
    // cast error
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "invalid id in single order api",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in get single order api",
    });
  }
};
// ==========================================================================
// stripe import krne se error aa rha h payment controller mei
// ==========================================================================

// payment controller
export const paymentController = async (req, res) => {
  try {
    // get total amount
    const { totalAmount } = req.body;
    // validation
    if (!totalAmount) {
      return res.status(404).send({
        success: true,
        message: "total amount is require",
      });
    }
    const { client_secret } = await stripe.paymentIntents.create({
      amount: Number(totalAmount * 100),
      currency: "usd",
    });
    res.status(200).send({
      success: true,
      message: "Payment successfully",
      client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in payment api",
    });
  }
};

// ==========================================================================
// admin section
// get all orders
export const getAllOdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    if (!orders) {
      return res.status(404).send({
        success: false,
        message: " orders Data not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "All orders Data",
      totalOrder: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get al  orders api",
    });
  }
};

// change order status
export const changeOrderStatusController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(400).send({
        success: false,
        message: "order not found",
      });
    }
    if (order.orderStatus === "processing") order.orderStatus = "shipped";
    else if (order.orderStatus === "shipped") {
      order.orderStatus = "deliverd";
      order.deliverdAt = Date.now();
    } else {
      return res.status(500).send({
        success: false,
        message: "order already deliverd",
      });
    }
    await order.save();
    res.status(200).send({
      success: true,
      message: " order status updated",
    });
  } catch (error) {
    console.log(error);
    // cast error
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "invalid id in change order status api",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in change order status api",
    });
  }
};
//  =============================================================
