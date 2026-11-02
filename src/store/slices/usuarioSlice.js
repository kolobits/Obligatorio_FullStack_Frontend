import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null
}

export const usuarioSlice = createSlice({
    name: 'usuario',
    initialState,
    reducers: {
        guardarToken: (state, action) => {
            state.token = action.payload
        },
        borrarToken: state => {
            state.token = null
        }
    }
})

export const { guardarToken, borrarToken } = usuarioSlice.actions

export default usuarioSlice.reducer