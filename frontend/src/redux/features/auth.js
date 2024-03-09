import { createSlice } from '@reduxjs/toolkit'




const initialState = { isAuthenticated: false }

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, { payload }) {
            state.isAuthenticated = payload
        },


    },
})

export const { setAuth } = auth.actions
export default auth.reducer