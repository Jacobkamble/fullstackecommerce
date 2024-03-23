const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorhandler")
const cloudinary = require("cloudinary");

// Create Product--Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    let images = [];
  
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
  
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.images = imagesLinks;
    req.body.user = req.user.id;
  
    const product = await Product.create(req.body);
  
    res.status(201).json({
      success: true,
      product,
    });
  });


// get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {

    const resultPerPage = 2;
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

// exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
//     const resultPerPage = 8;
//     const productsCount = await Product.countDocuments();

//     const apiFeature = new ApiFeatures(Product.find(), req.query)
//         .search()
//         .filter();

//     let productsQuery = await apiFeature.query; // Execute the query once

//     let products = productsQuery; // Assign the result to a variable

//     let filteredProductsCount = products.length;

//     apiFeature.pagination(resultPerPage);

//     products = await apiFeature.query; // Reassign the result with pagination applied

//     res.status(200).json({
//         success: true,
//         products,
//         productsCount,
//         resultPerPage,
//         filteredProductsCount,
//     });
// });


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
      return next(new ErrorHander("Product not found", 404));
    }
  
    // Images Start Here
    let images = [];
  
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    if (images !== undefined) {
      // Deleting Images From Cloudinary
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }
  
      const imagesLinks = [];
  
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
  
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
  
      req.body.images = imagesLinks;
    }
  
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
      product,
    });
  });


exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
  
    await product.remove();
  
    res.status(200).json({
      success: true,
      message: "Product Delete Successfully",
    });
  });

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
exports.deleteReview = catchAsyncErrors(
    async (req, res, next) => {

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
    }

)

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});