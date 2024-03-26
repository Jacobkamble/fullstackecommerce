const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// Create new order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {

    const { shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(201).json({
        success: true,
        order
    })

})

// get Single Order

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new ErrorHandler("Order not found with this id ", +req.params.id, 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})

// get logged in users orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    })
})

// get all orders-Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    const totalAmount = orders.reduce((acc, curr) => acc + curr.totalPrice, 0);

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

// delete Order
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {

    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
        return next(new ErrorHandler("Order not found with this Id " + req.params.id, 404));
    }

    res.status(200).json({
        success: true,

    })

});

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        });
    }

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveryAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
});


async function updateStock(id, quanity) {
    const product = await Product.findById(id);

    product.stock -= quanity;

    await product.save({ validateBeforeSave: false })
}