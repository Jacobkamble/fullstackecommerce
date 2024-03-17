const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",
        metadata: {
            company: "Ecommerce",
        },
    });

    res
        .status(200)
        .json({ success: true, client_secret: myPayment.client_secret });

    // const { product } = req.body;
    // const session = await stripe.checkout.sessions.create({
    //     payment_method_types: ["card"],
    //     line_items: [
    //         {
    //             price_data: {
    //                 currency: "inr",
    //                 product_data: {
    //                     name: "sdg",
    //                 },
    //                 unit_amount: 50 * 100,
    //             },
    //             quantity: 1,
    //         },
    //     ],
    //     mode: "payment",
    //     success_url: "http://localhost:3000/success",
    //     cancel_url: "http://localhost:3000/cancel",
    // });
    // res.json({ id: session.id });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});