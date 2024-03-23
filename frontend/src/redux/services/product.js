import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api/v1' }),
    endpoints: (builder) => ({
        getAllProducts: builder.query({

            query: ({ currentPage = 1, keyword = "", price = [0, 1000000], category, ratings = 0 }) => {
                let link = `/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
                if (category) {
                    link += `&category=${category}`;
                }

                return { url: link };
            },
            providesTags: ["Productlist"]
        }),
        getAllProductsAdmin: builder.query({

            query: () => {
                return {
                    url: `admin/products`,
                    headers: { "Authorization": localStorage.getItem("token") },

                };
            },
            providesTags: ["Productlist"]

        })
        ,
        getProductDetails: builder.query({
            query: (id) =>
            ({
                method: "GET",
                url: `product/${id}`
            }),
            providesTags: ['ProductDetails']

        }),

        createReview: builder.mutation({
            query: (data) => ({
                method: "PUT",
                url: `review`,
                body: data,
                headers: { "Authorization": localStorage.getItem("token") },
            }),
            invalidatesTags: ['ProductDetails']
        }),

        deleteProductAdmin: builder.mutation({
            query: (id) => ({
                method: "DELETE",
                url: `admin/product/${id}`,
                headers: { "Authorization": localStorage.getItem("token") },
            }),
            invalidatesTags: ["Productlist"]
        }),
        createProduct: builder.mutation({
            query: (data) => ({
                method: "POST",
                url: `admin/product/new`,
                body: data,
                headers: { "Authorization": localStorage.getItem("token") },
            }),
            invalidatesTags: ["Productlist"]
        }),
        updateProduct:builder.mutation({
            query:({id,formData})=>(
                console.log(formData,"dejduejd"),
                {
                method:"PUT",
                url:`admin/product/${id}`,
                body: formData,
                headers: { "Authorization": localStorage.getItem("token") },
            }),
            invalidatesTags: ["Productlist",'ProductDetails']
        })

    }),
});

export const { useGetAllProductsQuery, useGetProductDetailsQuery, useCreateReviewMutation, useGetAllProductsAdminQuery, useDeleteProductAdminMutation, useCreateProductMutation,useUpdateProductMutation } = productApi;