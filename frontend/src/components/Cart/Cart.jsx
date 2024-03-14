import React from "react";
import "./Cart.css";
import { useSelector, useDispatch } from "react-redux";
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Link, useNavigate } from "react-router-dom";
import { addItemsToCart, removeCartItem } from "../../redux/features/cart";
import { Typography } from "@mui/material";
import CartItemCart from "./CartItemCart";
import MetaData from "../layouts/MetaData";


const Cart = () => {

    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth)

    const { cartItems } = useSelector((state) => state.cart);

    const navigate = useNavigate();
    const increaseQuantity = (id, quantity, stock) => {
        const newQty = quantity + 1;
        if (stock <= quantity) {
            return;
        }
        dispatch(addItemsToCart(id, newQty));
    };

    const decreaseQuantity = (id, quantity) => {
        const newQty = quantity - 1;
        if (1 >= quantity) {
            return;
        }
        dispatch(addItemsToCart(id, newQty));
    };

    const deleteCartItems = (id) => {
        dispatch(removeCartItem(id))
    };

    const checkoutHandler = () => {

        if (isAuthenticated) {
            navigate("/shipping");
        } else {
            navigate("/login", { state: { redirect: "/shipping" } });
        }
    };

    return (
        <>
            <MetaData title={"Shoping Cart"} />
            {cartItems.length === 0 ? (
                <div className="emptyCart">
                    <RemoveShoppingCartIcon />

                    <Typography>No Product in Your Cart</Typography>
                    <Link to="/products">View Products</Link>
                </div>
            ) : (
                <>
                    <div className="cartPage">
                        <div className="cartHeader">
                            <p>Product</p>
                            <p>Quantity</p>
                            <p>Subtotal</p>
                        </div>

                        {cartItems &&
                            cartItems.map((item) => (
                                <div className="cartContainer" key={item.product}>
                                    <CartItemCart item={item} deleteCartItems={deleteCartItems} />
                                    <div className="cartInput">
                                        <button
                                            onClick={() =>
                                                decreaseQuantity(item.product, item.quantity)
                                            }
                                        >
                                            -
                                        </button>
                                        <input style={{ width: "2vmax" }} type="number" value={item.quantity} readOnly />
                                        <button
                                            onClick={() =>
                                                increaseQuantity(
                                                    item.product,
                                                    item.quantity,
                                                    item.stock
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="cartSubtotal">{`₹${item.price * item.quantity
                                        }`}</p>
                                </div>
                            ))}

                        <div className="cartGrossProfit">
                            <div></div>
                            <div className="cartGrossProfitBox">
                                <p>Gross Total</p>
                                <p>{`₹${cartItems.reduce(
                                    (acc, item) => acc + item.quantity * item.price,
                                    0
                                )}`}</p>
                            </div>
                            <div></div>
                            <div className="checkOutBtn">
                                <button onClick={checkoutHandler}>Check Out</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Cart
