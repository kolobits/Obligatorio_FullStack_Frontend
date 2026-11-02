import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listaViajes: [],
    total: 0,
    totalPages: 0,
    cantidad: 0,
    filtroEstado: "",
    filtroCategoria: "",
    page: 1
}

export const viajesSlice = createSlice({
    name: 'viajes',
    initialState,
    reducers: {
        guardarViajes: (state, action) => {
            state.listaViajes = action.payload.data
            state.total = action.payload.total
            state.totalPages = action.payload.totalPages
        },
        guardarCantidad: (state, action) => {
            state.cantidad = action.payload
        },
        cambiarEstado: (state, action) => {
            state.filtroEstado = action.payload
            state.page = 1
        },
        cambiarCategoria: (state, action) => {
            state.filtroCategoria = action.payload
            state.page = 1
        },
        cambiarPagina: (state, action) => {
            state.page = action.payload
        }
    }
})

export const { guardarViajes, guardarCantidad, cambiarEstado, cambiarCategoria, cambiarPagina } = viajesSlice.actions

export default viajesSlice.reducer