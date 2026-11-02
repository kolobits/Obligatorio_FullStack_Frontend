import * as Yup from "yup";

const viajeSchema = Yup.object().shape({
    destino: Yup.string().min(2, "Debe tener al menos 2 caracteres").max(50, "Debe tener como máximo 50 caracteres").required("El destino es obligatorio"),
    fechaInicio: Yup.date().typeError("Elegí la fecha de salida").required("La fecha de salida es obligatoria"),
    fechaFin: Yup.date().typeError("Elegí la fecha de regreso").min(Yup.ref("fechaInicio"), "El regreso no puede ser antes de la salida").required("La fecha de regreso es obligatoria"),
    presupuesto: Yup.number().typeError("Ingresá un número").positive("Debe ser mayor a 0").required("El presupuesto es obligatorio"),
    categoria: Yup.string(),
    estado: Yup.string().oneOf(["planificado", "en_curso", "finalizado", "cancelado"], "Elegí un estado").required("El estado es obligatorio"),
    descripcion: Yup.string().max(200, "Máximo 200 caracteres")
});

export default viajeSchema;