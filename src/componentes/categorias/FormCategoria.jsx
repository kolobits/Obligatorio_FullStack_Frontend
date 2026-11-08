import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categoriaSchema } from "./validations/categoriaSchema";
import BotonCargando from "../cargando/BotonCargando";

const FormCategoria = ({ categoria, onGuardar, onCancelar }) => {

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm({
    resolver: yupResolver(categoriaSchema),
    defaultValues: { nombre: "", descripcion: "" },
    mode: "onChange"
  });

  useEffect(() => {
    reset({
      nombre: categoria ? categoria.nombre : "",
      descripcion: categoria && categoria.descripcion ? categoria.descripcion : ""
    });
  }, [categoria, reset]);

  const onSubmit = (datos) => {
    return onGuardar({ nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim() });
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <h2 className="modal-titulo">{categoria ? "Editar categoría" : "Nueva categoría"}</h2>

      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre</label>
        <Controller
          control={control}
          name="nombre"
          render={({ field }) => (
            <input {...field} type="text" id="nombre" autoFocus
              className={errors.nombre ? "form-control is-invalid" : "form-control"} />
          )}
        />
        {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
      </div>

      <div className="mb-4">
        <label htmlFor="descripcion" className="form-label">Descripción <span className="text-secondary">(opcional)</span></label>
        <Controller
          control={control}
          name="descripcion"
          render={({ field }) => (
            <textarea {...field} id="descripcion" rows="3"
              className={errors.descripcion ? "form-control is-invalid" : "form-control"} />
          )}
        />
        {errors.descripcion && <div className="invalid-feedback">{errors.descripcion.message}</div>}
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-borde" onClick={onCancelar} disabled={isSubmitting}>
          Cancelar
        </button>
        <BotonCargando
          texto={categoria ? "Guardar cambios" : "Crear categoría"}
          textoCargando="Guardando…"
          cargando={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          deshabilitado={!isDirty}
        />
      </div>
    </form>
  );
};

export default FormCategoria;
