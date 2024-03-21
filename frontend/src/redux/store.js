import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from "@reduxjs/toolkit/query"
import { productApi } from './services/product';
import { userApi } from './services/user';
import { orderApi } from "./services/order"
import auth from './features/auth';
import cart from './features/cart';



const store = configureStore({
    reducer: {
        [productApi.reducerPath]: productApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        auth: auth,
        cart: cart



    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productApi.middleware, userApi.middleware, orderApi.middleware),


});

setupListeners(store.dispatch)



export default store 