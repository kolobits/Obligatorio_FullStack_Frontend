import { createSlice } from "@reduxjs/toolkit";

const TEXTO_INICIAL = "Cargando…";

const initialState = {
    cargando: false,
    pendientes: 0,
    texto: TEXTO_INICIAL
}

export const spinnerSlice = createSlice({
    name: "spinner",
    initialState,
    reducers: {
        mostrarSpinner: (state, action) => {
            state.pendientes = state.pendientes + 1;
            state.cargando = true;
            if (action.payload) {
                state.texto = action.payload;
            }
        },
        ocultarSpinner: (state) => {
            if (state.pendientes > 0) {
                state.pendientes = state.pendientes - 1;
            }
            state.cargando = state.pendientes > 0;
            if (!state.cargando) {
                state.texto = TEXTO_INICIAL;
            }
        }
    }
})

export const { mostrarSpinner, ocultarSpinner } = spinnerSlice.actions;
export default spinnerSlice.reducer;
