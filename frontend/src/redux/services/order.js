import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api/v1' }),
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (data) => ({
                method: "POST",
                url: `order/new`,
                headers: { "Authorization": localStorage.getItem("token") },
                body: data
            }),

        }),

        myOrders: builder.query({
            query: () => ({
                method: "GET",
                url: `orders/me`,
                headers: { "Authorization": localStorage.getItem("token") },
            })
        })
    })
})

export const { useCreateOrderMutation, useMyOrdersQuery } = orderApi