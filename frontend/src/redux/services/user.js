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

        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                method: `PUT`,
                url: `me/update`,
                body: data,
                headers: { "Authorization": localStorage.getItem("token") }
            })
        }),
        updatePassword: builder.mutation({
            query: (data) => ({
                method: "PUT",
                url: "password/update",
                body: data,
                headers: { "Authorization": localStorage.getItem("token") }
            })
        }),
        forgotPassword: builder.mutation({
            query: (data) => ({
                method: "POST",
                url: "password/forgot",
                body: data,
            })
        }),
        resetPassword: builder.mutation({
            query: ({ token, password, confirmPassword }) => ({

                method: "PUT",
                url: `password/reset/${token}`,
                body: { password, confirmPassword }
            })
        }),

        getAllUserListAdmin: builder.query({
            query: () => ({
                method: 'GET',
                url: `admin/users`,
                headers: { "Authorization": localStorage.getItem("token") },

            })
        })



    })
})




export const { useLoginMutation, useRegisterMutation, useLoadUserQuery, useLogoutQuery, useUpdateProfileMutation, useUpdatePasswordMutation, useForgotPasswordMutation, useResetPasswordMutation, useGetAllUserListAdminQuery } = userApi






