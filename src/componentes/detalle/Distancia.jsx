import { useState } from "react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import distanciaSchema from "./validations/distanciaSchema";
import BotonCargando from "../cargando/BotonCargando";
import OpcionViaje from "./OpcionViaje";

const Distancia = ({ id }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
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
    fetch(`${API_BASE_URL}/v1/viajes/${id}/distancia?origen=${encodeURIComponent(data.origen)}`, {
      headers: {
        'Authorization': token,
      }
    })
      .then(r => r.json())
      .then(datos => {
        setCargando(false);
        if (datos.recomendado) {
          setResultado(datos);
          setErrorDistancia("");
        } else {
          setResultado(null);
          setErrorDistancia(datos.message);
        }
      })
      .catch(() => {
        setCargando(false);
        setResultado(null);
        setErrorDistancia("No se pudo conectar con el servidor.");
      })
  }

  const formatearDuracion = (horas) => {
    const minutosTotales = Math.round(horas * 60);
    const h = Math.floor(minutosTotales / 60);
    const min = minutosTotales % 60;
    if (h === 0) return `${min} min`;
    if (min === 0) return `${h} h`;
    return `${h} h ${min} min`;
  };

  const ciudad = (nombre) => nombre.split(",")[0];

  let opcionAvion = null;
  let opcionAuto = null;

  if (resultado) {
    const ambas = resultado.avion !== null && resultado.auto !== null;

    if (resultado.avion) {
      opcionAvion = (
        <OpcionViaje
          titulo="En avión"
          icono="bi bi-airplane"
          datos={resultado.avion}
          detalle="vuelo directo estimado"
          recomendada={ambas && resultado.recomendado === "avion"}
          formatearDuracion={formatearDuracion}
        />
      );
    }

    if (resultado.auto) {
      opcionAuto = (
        <OpcionViaje
          titulo="En auto"
          icono="bi bi-car-front"
          datos={resultado.auto}
          detalle="por ruta"
          recomendada={ambas && resultado.recomendado === "auto"}
          formatearDuracion={formatearDuracion}
        />
      );
    }
  }

  return (
    <div className="panel" style={{ maxWidth: "720px" }}>
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
          <div className="trayecto">
            <div className="trayecto-punto">
              <span className="trayecto-codigo">{ciudad(resultado.origen).slice(0, 3).toUpperCase()}</span>
              <span className="trayecto-ciudad">{ciudad(resultado.origen)}</span>
            </div>
            <div className="trayecto-linea" aria-hidden="true">
              <i className={resultado.recomendado === "auto" ? "bi bi-car-front-fill trayecto-auto" : "bi bi-airplane-fill"}></i>
            </div>
            <div className="trayecto-punto text-end">
              <span className="trayecto-codigo">{ciudad(resultado.destino).slice(0, 3).toUpperCase()}</span>
              <span className="trayecto-ciudad">{ciudad(resultado.destino)}</span>
            </div>
          </div>
          <p className="text-secondary small mb-3">{resultado.lineaRectaKm.toLocaleString("es-UY")} km en línea recta</p>

          <div className="row g-3">
            {resultado.recomendado === "auto" ? <>{opcionAuto}{opcionAvion}</> : <>{opcionAvion}{opcionAuto}</>}
          </div>

          {resultado.avion && (
            <p className="small text-secondary mt-3 mb-0">
              El tiempo en avión es una estimación para un vuelo directo. Con escalas puede ser bastante más.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Distancia;
