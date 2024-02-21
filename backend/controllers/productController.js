const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModels");
const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorhandler")


// Create Product--Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    req.body.user = req.user.id

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})


// get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {

    const resultPerPage = 3;
    const productsCount = await Product.countDocuments();
    const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter()
        .pagination(resultPerPage);

    let products = await apiFeatures.query;

    let filteredProductsCount = products.length;




    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    })
})


// get single product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 400))
    }
    res.status(200).json({ success: true, product })
})




// Update Product--Admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 500))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false })
    res.status(200).json({
        success: true,
        product

    })
})


exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 500))
    }
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success: true,
        message: "Product delete successfully"
    })
})

// Create and Update Review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString())

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating,
                    rev.comment = comment
            }
        })
    }
    else {
        product.reviews.push(review);
        product.noOfReviews = product.reviews.length;
    }

    product.ratings = product.reviews.reduce((acc, curr) => {
        return acc + curr.rating
    }, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({ success: true })


})

// Get All Reviews of a product
exports.getProductReview = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// Delete Reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    const reviews = product.reviews.filter((rev) => {
        return rev._id.toString() !== req.query.id.toString()
    })

    const ratings = (reviews.reduce((acc, curr) => acc + curr.rating, 0)) / (reviews.length);

    const noOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, { reviews, ratings, noOfReviews }, { new: true, runValidators: true, useFindAndModify: false })

    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    })
})