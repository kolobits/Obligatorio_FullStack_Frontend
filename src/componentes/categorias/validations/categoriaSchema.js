import * as yup from "yup";

export const categoriaSchema = yup.object().shape({
  nombre: yup.string()
    .trim()
    .required("Poné un nombre")
    .min(2, "El nombre tiene que tener al menos 2 letras")
    .max(30, "El nombre puede tener hasta 30 caracteres"),
  descripcion: yup.string()
    .trim()
    .max(150, "La descripción puede tener hasta 150 caracteres"),
});
