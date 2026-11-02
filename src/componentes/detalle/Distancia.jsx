import { useState } from "react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import distanciaSchema from "./validations/distanciaSchema";
import BotonCargando from "../cargando/BotonCargando";

const Distancia = ({ id }) => {

  const token = useSelector(state => state.usuario.token);
  const [resultado, setResultado] = useState(null);
  const [errorDistancia, setErrorDistancia] = useState("");
  const [cargando, setCargando] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(distanciaSchema),
    mode: "onChange",
    defaultValues: {
      origen: "Montevideo"
    }
  })

  const onSubmit = data => {
    setCargando(true);
    fetch(`https://obligatorio1-fullstack.vercel.app/v1/viajes/${id}/distancia?origen=${encodeURIComponent(data.origen)}`, {
      headers: {
        'Authorization': token,
      }
    })
      .then(r => r.json())
      .then(datos => {
        console.log(datos);
        setCargando(false);
        if (datos.distanciaKm !== undefined) {
          setResultado(datos);
          setErrorDistancia("");
        } else {
          setResultado(null);
          setErrorDistancia(datos.message);
        }
      })
  }

  return (
    <div className="panel" style={{ maxWidth: "640px" }}>
      <form className="row g-2 align-items-start mb-4" noValidate>
        <div className="col-sm-8">
          <label htmlFor="origen" className="form-label">¿Desde qué ciudad salís?</label>
          <Controller
            control={control}
            name="origen"
            render={({ field }) => (
              <input {...field} type="text" id="origen"
                className={errors.origen ? "form-control is-invalid" : "form-control"} />
            )}
          />
          {errors.origen && <div className="invalid-feedback">{errors.origen.message}</div>}
        </div>
        <div className="col-sm-4 distancia-boton">
          <BotonCargando
            texto="Calcular"
            textoCargando="Calculando…"
            cargando={cargando}
            onClick={handleSubmit(onSubmit)}
            deshabilitado={!isValid}
            clases="w-100"
          />
        </div>
      </form>

      {errorDistancia && <div className="alert alert-danger mb-0" role="alert">{errorDistancia}</div>}

      {resultado && (
        <>
          <p className="text-secondary mb-3">{resultado.origen} <i className="bi bi-arrow-right"></i> {resultado.destino}</p>
          <div className="d-flex flex-wrap gap-5">
            <div>
              <p className="text-secondary mb-0">Distancia</p>
              <p className="titulo fs-2 mb-0">{resultado.distanciaKm.toLocaleString("es-UY")} km</p>
            </div>
            <div>
              <p className="text-secondary mb-0">En auto</p>
              <p className="titulo fs-2 mb-0">{resultado.duracionHoras.toLocaleString("es-UY")} h</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Distancia;
