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
            invalidatesTags: ["orderlist"]

        }),

        myOrders: builder.query({
            query: () => ({
                method: "GET",
                url: `orders/me`,
                headers: { "Authorization": localStorage.getItem("token") },
            }),
            providesTags: ["orderlist"]
        }),

        orderDetails: builder.query({
            query: (id) => ({
                method: "GET",
                url: `order/${id}`,
                headers: { "Authorization": localStorage.getItem("token") },
            }),
            providesTags: ["orderdetails"]
        }),
        allOrderAdmin: builder.query({
            query: () => ({
                method: "GET",
                url: `admin/orders`,
                headers: { "Authorization": localStorage.getItem("token") },
            }),
            transformResponse: (res) => {
                return {
                    orders: res.orders,
                    totalAmount: res.totalAmount
                }
            },
            providesTags: ["orderlist"]
        }),
        deleteOrder: builder.mutation({
            query: (id) => ({
                method: "DELETE",
                url: `admin/order/${id}`,
                headers: { "Authorization": localStorage.getItem("token") },
            }),
            invalidatesTags: ["orderlist"]
        }),
        updateOrder: builder.mutation({
            query: ({ id, status }) => ({
                method: "PUT",
                url: `admin/order/${id}`,
                body: { status },
                headers: { "Authorization": localStorage.getItem("token") },
            }),
            invalidatesTags: ["orderlist", "orderdetails"]
        })

    })
})

export const { useCreateOrderMutation, useMyOrdersQuery, useOrderDetailsQuery, useAllOrderAdminQuery, useDeleteOrderMutation, useUpdateOrderMutation } = orderApi