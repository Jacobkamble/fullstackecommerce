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
            , providesTags: ["userdetail"]
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
            }),
            invalidatesTags: ["userdetail"]
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
            }),
            providesTags: ["userlist", "userdetail"]
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                method: "DELETE",
                url: `admin/user/${id}`,
                headers: { "Authorization": localStorage.getItem("token") },
            }),
            invalidatesTags: ["userlist"]
        }),
        getUserDetailAdmin: builder.query({
            query: (id) => ({
                method: "GET",
                url: `admin/user/${id}`,
                headers: { "Authorization": localStorage.getItem("token") },

            })
        }),
        updateUser: builder.mutation({
            query: ({ id, data }) => ({
                method: "PUT",
                url: `admin/user/${id}`,
                headers: { "Authorization": localStorage.getItem("token") },
                body: data,


            }),
            invalidatesTags: ["userlist", "userdetail"]
        })
    })
})




export const { useLoginMutation, useRegisterMutation, useLoadUserQuery, useLogoutQuery, useUpdateProfileMutation, useUpdatePasswordMutation, useForgotPasswordMutation, useResetPasswordMutation, useGetAllUserListAdminQuery, useDeleteUserMutation, useGetUserDetailAdminQuery, useUpdateUserMutation } = userApi






