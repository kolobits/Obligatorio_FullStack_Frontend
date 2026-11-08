import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listaCategorias: []
}

export const categoriasSlice = createSlice({
    name: 'categorias',
    initialState,
    reducers: {
        guardarCategorias: (state, action) => {
            state.listaCategorias = action.payload
        },
        agregarCategoria: (state, action) => {
            state.listaCategorias.push(action.payload)
        },
        actualizarCategoria: (state, action) => {
            state.listaCategorias = state.listaCategorias.map(c => c._id === action.payload._id ? action.payload : c)
        },
        eliminarCategoria: (state, action) => {
            state.listaCategorias = state.listaCategorias.filter(c => c._id !== action.payload)
        }
    }
})

export const { guardarCategorias, agregarCategoria, actualizarCategoria, eliminarCategoria } = categoriasSlice.actions

export default categoriasSlice.reducer
