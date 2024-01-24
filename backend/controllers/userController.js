const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const isUserExisted = await User.findOne({ email: email });

    if (isUserExisted) {
        return next(new ErrorHandler("This email already registred", 400))
    }

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "this is ample id",
            url: "this is sample url"
        }
    })

    const token = user.getJWTToken();


    res.status(201).json({
        success: true,
        token,
    })
})

exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    const { email, password } = req.body;;
    if (!email || !password) {
        return next(new ErrorHandler("Please enter Email & Password", 400));
    }
    // const user = await User.findOne({ email }).select("+password");
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    console.log(user, "user")

    const isPasswordMatched = await user.comparePassword(password);

    // comparePassword
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid password", 401))
    }

    const token = user.getJWTToken();


    res.status(201).json({
        success: true,
        token,
    })



})