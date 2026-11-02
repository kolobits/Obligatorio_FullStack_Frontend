import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token"),
    perfil: null
}

export const usuarioSlice = createSlice({
    name: 'usuario',
    initialState,
    reducers: {
        guardarToken: (state, action) => {
            state.token = action.payload
        },
        guardarPerfil: (state, action) => {
            state.perfil = action.payload
        },
        borrarToken: state => {
            state.token = null
            state.perfil = null
        }
    }
})

export const { guardarToken, guardarPerfil, borrarToken } = usuarioSlice.actions

export default usuarioSlice.reducer