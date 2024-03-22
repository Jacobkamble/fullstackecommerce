import React, { useEffect } from 'react'
import { useOrderDetailsQuery } from '../../redux/services/order'
import { Link, useParams } from 'react-router-dom';
import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader/Loader';
import { Typography } from '@mui/material';
import { showErrorMessage } from '../../utils/showErrorMessage';
import "./OrderDetails.css"


const OrderDetails = () => {
    const { id } = useParams();
    const { data, isLoading, isError, error } = useOrderDetailsQuery(id);

    useEffect(() => {
        if (isError) {
            showErrorMessage(error)
        }

    }, [isError, error])

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title="Order Details" />
                    <div className="orderDetailsPage">
                        <div className="orderDetailsContainer">
                            <Typography component="h1">
                                Order #{data && data.order && data.order._id}
                            </Typography>
                            <Typography>Shipping Info</Typography>
                            <div className="orderDetailsContainerBox">
                                <div>
                                    <p>Name:</p>
                                    <span>{data && data.order && data.order.user && data.order.user.name}</span>
                                </div>
                                <div>
                                    <p>Phone:</p>
                                    <span>
                                        {data && data.order.shippingInfo && data.order.shippingInfo.phoneNo}
                                    </span>
                                </div>
                                <div>
                                    <p>Address:</p>
                                    <span>
                                        {data && data.order.shippingInfo &&
                                            `${data.order.shippingInfo.address}, ${data.order.shippingInfo.city}, ${data.order.shippingInfo.state}, ${data.order.shippingInfo.pinCode}, ${data.order.shippingInfo.country}`}
                                    </span>
                                </div>
                            </div>
                            <Typography>Payment</Typography>
                            <div className="orderDetailsContainerBox">
                                <div>
                                    <p
                                        className={
                                            data && data.order.paymentInfo &&
                                                data.order.paymentInfo.status === "succeeded"
                                                ? "greenColor"
                                                : "redColor"
                                        }
                                    >
                                        {data && data.order.paymentInfo &&
                                            data.order.paymentInfo.status === "succeeded"
                                            ? "PAID"
                                            : "NOT PAID"}
                                    </p>
                                </div>

                                <div>
                                    <p>Amount:</p>
                                    <span>{data && data.order.totalPrice && data.order.totalPrice}</span>
                                </div>
                            </div>

                            <Typography>Order Status</Typography>
                            <div className="orderDetailsContainerBox">
                                <div>
                                    <p
                                        className={
                                            data && data.order.orderStatus && data.order.orderStatus === "Delivered"
                                                ? "greenColor"
                                                : "redColor"
                                        }
                                    >
                                        {data && data.order.orderStatus && data.order.orderStatus}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="orderDetailsCartItems">
                            <Typography>Order Items:</Typography>
                            <div className="orderDetailsCartItemsContainer">
                                {data && data.order.orderItems &&
                                    data.order.orderItems.map((item) => (
                                        <div key={item.product}>
                                            <img src={item.image} alt="Product" />
                                            <Link to={`/product/${item.product}`}>
                                                {item.name}
                                            </Link>{" "}
                                            <span>
                                                {item.quantity} X ₹{item.price} ={" "}
                                                <b>₹{item.price * item.quantity}</b>
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default OrderDetails
