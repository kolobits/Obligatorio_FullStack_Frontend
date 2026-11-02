import { configureStore } from "@reduxjs/toolkit";
import usuarioReducer from "./slices/usuarioSlice";
import viajesReducer from "./slices/viajesSlice";
import categoriasReducer from "./slices/categoriasSlice";

export const store = configureStore({
    reducer: {
        usuario: usuarioReducer,
        viajes: viajesReducer,
        categorias: categoriasReducer
    }
})
