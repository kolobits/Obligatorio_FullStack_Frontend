import * as Yup from "yup";

const registroSchema = Yup.object().shape({
    name: Yup.string().min(3, "Debe tener al menos 3 caracteres").max(20, "Debe tener como máximo 20 caracteres").required("El nombre es obligatorio"),
    username: Yup.string().min(3, "Debe tener al menos 3 caracteres").max(20, "Debe tener como máximo 20 caracteres").required("El usuario es obligatorio"),
    email: Yup.string().email("Formato de correo inválido").required("El email es obligatorio"),
    password: Yup.string().min(3, "Debe tener al menos 3 caracteres").max(20, "Debe tener como máximo 20 caracteres").matches(/^[a-zA-Z0-9]+$/, "Solo puede tener letras y números").required("La contraseña es obligatoria"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Las contraseñas deben coincidir").required("Confirmar contraseña es obligatorio")
});

export default registroSchema;