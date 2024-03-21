import React, { Fragment, useEffect, useRef } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import { showErrorMessage } from '../../utils/showErrorMessage';

import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";
import "./Payment.css";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EventIcon from "@mui/icons-material/Event";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

import { useLoadUserQuery } from "../../redux/services/user";
import MetaData from "../layouts/MetaData";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";



const Payment = () => {
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();
    const payBtn = useRef(null);

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { data: userData } = useLoadUserQuery()


    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100),
    };

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        payBtn.current.disabled = true;

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                },
            };
            const { data } = await axios.post(
                "http://localhost:4000/api/v1/payment/process",
                paymentData,
                config
            );

            const client_secret = data.client_secret;
            console.log(client_secret, ":dkwdhgf")
            order.paymentInfo = {
                id: "sjjs",
                status: "success",
            };

            console.log("succcess")
            // dispatch(createOrder(order));

            navigate("/success");

            // if (!stripe || !elements) return;

            // const result = await stripe.confirmCardPayment(client_secret,
            //     {
            //         payment_method: {
            //             card: elements.getElement(CardNumberElement),
            //             billing_details: {
            //                 name: userData.user.name,
            //                 email: userData.user.email,
            //                 address: {
            //                     line1: shippingInfo.address,
            //                     city: shippingInfo.city,
            //                     state: shippingInfo.state,
            //                     postal_code: shippingInfo.pinCode,
            //                     country: shippingInfo.country,
            //                 },
            //             },
            //         },
            //     }
            // );





            // if (result.error) {
            //     payBtn.current.disabled = false;
            //     showErrorMessage(result.error.message)
            // } else {
            //     if (result.paymentIntent.status === "succeeded") {
            //         order.paymentInfo = {
            //             id: result.paymentIntent.id,
            //             status: result.paymentIntent.status,
            //         };

            //         console.log("succcess")
            //         // dispatch(createOrder(order));

            //         navigate("/success");
            //     } else {
            //         // alert("There's some issue while processing payment")
            //         showErrorMessage("There's some issue while processing payment")
            //         // alert.error("There's some issue while processing payment ");
            //     }
            // }
        } catch (error) {
            payBtn.current.disabled = false;
            // alert.error(error.response.data.message);
        }
    };

    // useEffect(() => {
    //     if (error) {
    //         alert.error(error);
    //         dispatch(clearErrors());
    //     }
    // }, [dispatch, error, alert]);

    return (

        <>
            <MetaData title="Payment" />
            <CheckoutSteps activeStep={2} />
            <div className="paymentContainer">
                <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
                    <Typography>Card Info</Typography>
                    <div>
                        <CreditCardIcon />
                        <CardNumberElement className="paymentInput" />
                    </div>
                    <div>
                        <EventIcon />
                        <CardExpiryElement className="paymentInput" />
                    </div>
                    <div>
                        <VpnKeyIcon />
                        <CardCvcElement className="paymentInput" />
                    </div>

                    <input
                        type="submit"
                        value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
                        ref={payBtn}
                        className="paymentFormBtn"
                    />
                </form>
            </div>
        </>
    );
};

export default Payment;