import * as Yup from "yup";

const distanciaSchema = Yup.object().shape({
    origen: Yup.string().min(2, "Debe tener al menos 2 caracteres").required("Escribí la ciudad de origen")
});

export default distanciaSchema;
