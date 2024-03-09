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
            }
        }),
        getProductDetails: builder.query({
            query: (id) => `product/${id}`
        })

    }),
});

export const { useGetAllProductsQuery, useGetProductDetailsQuery } = productApi;