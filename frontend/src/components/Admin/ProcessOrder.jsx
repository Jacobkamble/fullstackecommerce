import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useOrderDetailsQuery, useUpdateOrderMutation } from '../../redux/services/order';
import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader/Loader';
import { Typography, Button } from '@mui/material';
import Sidebar from './Sidebar';
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import "./ProcessOrder.css"



const ProcessOrder = () => {
    const { id } = useParams();
    const [status, setStatus] = useState("");

    const { data: orderDetail, isLoading, isError, error } = useOrderDetailsQuery(id);

    const [updateOrderStatus, { }] = useUpdateOrderMutation();

    const updateOrderSubmitHandler = (e) => {
        e.preventDefault();
        updateOrderStatus({ id, status })
    }


    return (
        <>
            <MetaData title="Process Order" />
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <div
                            className="confirmOrderPage"
                            style={{
                                display: orderDetail && orderDetail.order.orderStatus === "Delivered" ? "block" : "grid",
                            }}
                        >
                            <div>
                                <div className="confirmshippingArea">
                                    <Typography>Shipping Info</Typography>
                                    <div className="orderDetailsContainerBox">
                                        <div>
                                            <p>Name:</p>
                                            <span>{orderDetail && orderDetail.order.user && orderDetail.order.user.name}</span>
                                        </div>
                                        <div>
                                            <p>Phone:</p>
                                            <span>
                                                {orderDetail && orderDetail.order.shippingInfo && orderDetail.order.shippingInfo.phoneNo}
                                            </span>
                                        </div>
                                        <div>
                                            <p>Address:</p>
                                            <span>
                                                {orderDetail && orderDetail.order.shippingInfo &&
                                                    `${orderDetail.order.shippingInfo.address}, ${orderDetail.order.shippingInfo.city}, ${orderDetail.order.shippingInfo.state}, ${orderDetail.order.shippingInfo.pinCode}, ${orderDetail.order.shippingInfo.country}`}
                                            </span>
                                        </div>
                                    </div>

                                    <Typography>Payment</Typography>
                                    <div className="orderDetailsContainerBox">
                                        <div>
                                            <p
                                                className={
                                                    orderDetail && orderDetail.order.paymentInfo &&
                                                        orderDetail.order.paymentInfo.status === "succeeded"
                                                        ? "greenColor"
                                                        : "redColor"
                                                }
                                            >
                                                {orderDetail && orderDetail.order.paymentInfo &&
                                                    orderDetail.order.paymentInfo.status === "succeeded"
                                                    ? "PAID"
                                                    : "NOT PAID"}
                                            </p>
                                        </div>

                                        <div>
                                            <p>Amount:</p>
                                            <span>{orderDetail && orderDetail.order.totalPrice && orderDetail.order.totalPrice}</span>
                                        </div>
                                    </div>

                                    <Typography>Order Status</Typography>
                                    <div className="orderDetailsContainerBox">
                                        <div>
                                            <p
                                                className={
                                                    orderDetail && orderDetail.order.orderStatus && orderDetail.order.orderStatus === "Delivered"
                                                        ? "greenColor"
                                                        : "redColor"
                                                }
                                            >
                                                {orderDetail && orderDetail.order.orderStatus && orderDetail.order.orderStatus}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="confirmCartItems">
                                    <Typography>Your Cart Items:</Typography>
                                    <div className="confirmCartItemsContainer">
                                        {orderDetail && orderDetail.order.orderItems &&
                                            orderDetail.order.orderItems.map((item) => (
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
                            {/*  */}
                            <div
                                style={{
                                    display: orderDetail && orderDetail.order.orderStatus === "Delivered" ? "none" : "block",
                                }}
                            >
                                <form
                                    className="updateOrderForm"
                                    onSubmit={updateOrderSubmitHandler}
                                >
                                    <h1>Process Order</h1>

                                    <div>
                                        <AccountTreeIcon />
                                        <select onChange={(e) => setStatus(e.target.value)}>
                                            <option value="">Choose Order Status</option>
                                            {orderDetail && orderDetail.order.orderStatus === "Processing" && (
                                                <option value="Shipped">Shipped</option>
                                            )}

                                            {orderDetail && orderDetail.order.orderStatus === "Shipped" && (
                                                <option value="Delivered">Delivered</option>
                                            )}
                                        </select>
                                    </div>

                                    <Button
                                        id="createProductBtn"
                                        type="submit"
                                        disabled={
                                            isLoading ? true : false || status === "" ? true : false
                                        }
                                    >
                                        Process
                                    </Button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ProcessOrder
