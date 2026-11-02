import * as Yup from "yup";

const loginSchema = Yup.object().shape({
    username: Yup.string().min(3, "Debe tener al menos 3 caracteres").max(20, "Debe tener como máximo 20 caracteres").required("El usuario es obligatorio"),
    password: Yup.string().min(3, "Debe tener al menos 3 caracteres").max(20, "Debe tener como máximo 20 caracteres").matches(/^[a-zA-Z0-9]+$/, "Solo puede tener letras y números").required("La contraseña es obligatoria")
});

export default loginSchema;