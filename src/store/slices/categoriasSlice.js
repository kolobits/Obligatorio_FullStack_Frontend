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
        }
    }
})

export const { guardarCategorias } = categoriasSlice.actions

export default categoriasSlice.reducer