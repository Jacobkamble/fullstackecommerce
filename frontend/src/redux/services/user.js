import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `http://localhost:4000/api/v1`,
    }),

    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ email, password }) => (

                {
                    method: `POST`,
                    url: `login`,
                    headers: { "Content-Type": "application/json" },
                    body: { email, password }
                })
        }),
        register: builder.mutation({
            query: (data) =>

            (
                {
                    method: `POST`,
                    url: `register`,
                    // headers: { "Content-Type": "multipart/form-data" },
                    body: data,
                    // credentials: 'include'
                })

        }),
        loadUser: builder.query({
            query: () => ({
                method: "GET",
                url: "me",
                headers: { "Authorization": localStorage.getItem("token") },
                credentials: "include"
            })
        }),
        logout: builder.query({
            query: () => ({
                method: "GET",
                url: 'logout'
            })

        })
    })
})




export const { useLoginMutation, useRegisterMutation, useLoadUserQuery, useLogoutQuery } = userApi





