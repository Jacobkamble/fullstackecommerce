const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name cannot axceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter email name"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please enter password name"],
        minLength: [8, "Name should have more than 8 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

userSchema.pre("save", async function (next) {
    console.log(this.isModified("password", "modifid"))
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcryptjs.hash(this.password, 10);
});

// JWT Token

userSchema.methods.getJWTToken = function () {
    return jsonwebtoken.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}

userSchema.methods.comparePassword = async function (enteredPassword) {
    try {
        console.log("method", await bcryptjs.compare(enteredPassword, this.password));
        return await bcryptjs.compare(enteredPassword, this.password);
    } catch (error) {
        // Handle any potential errors during password comparison
        console.error("Error during password comparison:", error);
        return false;
    }
}
module.exports = mongoose.model("User", userSchema)