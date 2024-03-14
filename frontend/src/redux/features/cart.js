import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    shippingInfo: localStorage.getItem("shippingInfo") ? JSON.parse(localStorage.getItem("shippingInfo")) : {},
};

export const cart = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, { payload }) => {

            const item = payload;
            const isItemExist = state.cartItems?.find((i) => i.product === item.product);

            if (isItemExist) {
                state.cartItems = state.cartItems.map((i) =>
                    i.product === isItemExist.product ? item : i
                );
            } else {
                state.cartItems.push(item);
            }

            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeCartItem: (state, action) => {
            state.cartItems = state.cartItems.filter((i) => i.product !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
            localStorage.setItem('shippingInfo', JSON.stringify(action.payload));
        },
    },
});

export const { addToCart, removeCartItem, saveShippingInfo } = cart.actions;

// Thunk for adding items to cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`http://localhost:4000/api/v1/product/${id}`);


    dispatch(addToCart({
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity
    }))
};

export default cart.reducer;
