const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sentToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const cloudinary = require("cloudinary");


// Register a user
exports.registerUser = catchAsyncErrors(

    async (req, res, next) => {
        const file = req.files.avatar;

        const myCloud = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });



        const { name, email, password } = req.body;

        const isUserExisted = await User.findOne({ email: email });

        if (isUserExisted) {
            return next(new ErrorHandler("This email already registred", 400))
        }

        const user = await User.create({
            name, email, password,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
        })

        sentToken(user, 201, res)
    }
)

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


    const isPasswordMatched = await user.comparePassword(password);

    // comparePassword
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid password", 401))

    }
    sentToken(user, 200, res)
})

// Logout User

exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler(`User not found`, 404))
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is : \n\n ${resetPasswordUrl}\n\n If you have not requested this email then please ignore it `;
    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Passsword Recovery`,
            message
        });
        res.status(200).json({ success: true, message: `Email sent to ${user.email} successfully` })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500))
    }

})

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or has been expired", 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match"));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: true });
    sentToken(user, 200, res)
})

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();
    sentToken(user, 200, res)
})

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        email: req.body.email,
        name: req.body.name
    }

    await User.findByIdAndUpdate(req.user.id, newUserData, { new: true, runValidators: true, useFindAndModify: false });
    res.status(200).json({ success: true })
})

// get all users(admin )
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({ success: true, users })
})

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User does not exist with id ", +req.params.id, 400))
    }

    res.status(200).json({
        success: true,
        user
    })

})

// Update User Role(Admin)
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        email: req.body.email,
        name: req.body.name,
        role: req.body.role
    }

    await User.findByIdAndUpdate(req.params.id, newUserData, { new: true, runValidators: true, useFindAndModify: false });
    res.status(200).json({ success: true })
})

// Delete User(Admin)
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with id : ${req.params.id}`, 400));

    }
    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })

})