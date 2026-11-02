import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import viajeSchema from "./validations/viajeSchema";
import BotonCargando from "../cargando/BotonCargando";
import "./styles/pase.css";

const FormViaje = () => {

  const navigate = useNavigate();
  const { id } = useParams();
  const token = useSelector(state => state.usuario.token);
  const categorias = useSelector(state => state.categorias.listaCategorias);
  const [errorViaje, setErrorViaje] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [imagenUrl, setImagenUrl] = useState("");

  const estados = [
    { id: "f-plan", valor: "planificado", texto: "Planificado" },
    { id: "f-curso", valor: "en_curso", texto: "En curso" },
    { id: "f-fin", valor: "finalizado", texto: "Finalizado" },
    { id: "f-canc", valor: "cancelado", texto: "Cancelado" },
  ];

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(viajeSchema),
    mode: "onChange",
    defaultValues: {
      destino: "",
      fechaInicio: "",
      fechaFin: "",
      presupuesto: "",
      categoria: "",
      estado: "planificado",
      descripcion: ""
    }
  })

  useEffect(() => {
    if (id) {
      fetch(`https://obligatorio1-fullstack.vercel.app/v1/viajes/${id}`, {
        headers: {
          'Authorization': token,
        }
      })
        .then(r => r.json())
        .then(datos => {
          console.log(datos);
          if (datos._id) {
            reset({
              destino: datos.destino,
              fechaInicio: datos.fechaInicio.slice(0, 10),
              fechaFin: datos.fechaFin.slice(0, 10),
              presupuesto: datos.presupuesto,
              categoria: datos.categoria || "",
              estado: datos.estado,
              descripcion: datos.descripcion || ""
            });
            setImagenUrl(datos.imagenUrl || "");
          } else {
            setErrorViaje(datos.message);
          }
        })
    }
  }, [id])

  const onSubmit = data => {
    setGuardando(true);
    let objViaje = {
      "destino": data.destino,
      "fechaInicio": data.fechaInicio,
      "fechaFin": data.fechaFin,
      "presupuesto": data.presupuesto,
      "categoria": data.categoria === "" ? null : data.categoria,
      "estado": data.estado,
      "descripcion": data.descripcion
    }
    if (imagenUrl !== "") {
      objViaje.imagenUrl = imagenUrl;
    }


    let url = "https://obligatorio1-fullstack.vercel.app/v1/viajes";
    let metodo = "POST";
    if (id) {
      url = url + `/${id}`;
      metodo = "PUT";
    }

    fetch(url, {
      method: metodo,
      body: JSON.stringify(objViaje),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': token,
      }
    })
      .then(r => r.json())
      .then(datos => {
        console.log(datos);
        if (datos._id) {
          navigate("/dashboard");
        } else if (datos.message) {
          setGuardando(false);
          setErrorViaje(datos.message);
        } else {
          setGuardando(false);
          setErrorViaje(datos.error);
        }
      })
  }


  const destino = watch("destino");
  const fechaInicio = watch("fechaInicio");
  const fechaFin = watch("fechaFin");
  const presupuesto = watch("presupuesto");
  const estado = watch("estado");
  const categoria = watch("categoria");

  const formatearFecha = (fecha) => {
    if (fecha === "") {
      return "—";
    }
    return new Date(fecha)
      .toLocaleDateString("es-UY", { day: "numeric", month: "short", timeZone: "UTC" })
      .replace(".", "");
  };

  const buscarNombreCategoria = (idCategoria) => {
    const encontrada = categorias.find(c => c._id === idCategoria);
    return encontrada ? encontrada.nombre : null;
  };

  const textoEstado = estados.find(e => e.valor === estado);

  return (
    <main className="container py-5">
      <Link to="/dashboard" className="volver mb-3"><i className="bi bi-arrow-left"></i> Volver a mis viajes</Link>
      <h1 className="mb-4">{id ? "Editar viaje" : "Nuevo viaje"}</h1>

      <div className="row g-4 align-items-start">
        <div className="col-lg-7">
          <form className="panel" noValidate>
            <div className="mb-3">
              <label htmlFor="destino" className="form-label">Destino</label>
              <Controller
                control={control}
                name="destino"
                render={({ field }) => (
                  <input {...field} type="text" id="destino"
                    className={errors.destino ? "form-control is-invalid" : "form-control"} />
                )}
              />
              {errors.destino && <div className="invalid-feedback">{errors.destino.message}</div>}
              <div className="form-text">La ciudad, sin el país. La usamos para buscar el clima.</div>
            </div>

            <div className="row">
              <div className="col-sm-6 mb-3">
                <label htmlFor="fechaInicio" className="form-label">Salida</label>
                <Controller
                  control={control}
                  name="fechaInicio"
                  render={({ field }) => (
                    <input {...field} type="date" id="fechaInicio"
                      className={errors.fechaInicio ? "form-control is-invalid" : "form-control"} />
                  )}
                />
                {errors.fechaInicio && <div className="invalid-feedback">{errors.fechaInicio.message}</div>}
              </div>
              <div className="col-sm-6 mb-3">
                <label htmlFor="fechaFin" className="form-label">Regreso</label>
                <Controller
                  control={control}
                  name="fechaFin"
                  render={({ field }) => (
                    <input {...field} type="date" id="fechaFin"
                      className={errors.fechaFin ? "form-control is-invalid" : "form-control"} />
                  )}
                />
                {errors.fechaFin && <div className="invalid-feedback">{errors.fechaFin.message}</div>}
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6 mb-3">
                <label htmlFor="presupuesto" className="form-label">Presupuesto en USD</label>
                <Controller
                  control={control}
                  name="presupuesto"
                  render={({ field }) => (
                    <input {...field} type="number" id="presupuesto" min="1"
                      className={errors.presupuesto ? "form-control is-invalid" : "form-control"} />
                  )}
                />
                {errors.presupuesto && <div className="invalid-feedback">{errors.presupuesto.message}</div>}
              </div>
              <div className="col-sm-6 mb-3">
                <label htmlFor="categoria" className="form-label">Categoría <span className="text-secondary fw-normal">(opcional)</span></label>
                <Controller
                  control={control}
                  name="categoria"
                  render={({ field }) => (
                    <select {...field} id="categoria" className="form-select">
                      <option value="">Sin categoría</option>
                      {categorias.map(c => (
                        <option key={c._id} value={c._id}>{c.nombre}</option>
                      ))}
                    </select>
                  )}
                />
              </div>
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Estado</span>
              <Controller
                control={control}
                name="estado"
                render={({ field: { value, onChange } }) => (
                  <div className="chips" role="group" aria-label="Estado del viaje">
                    {estados.map(e => (
                      <span key={e.id}>
                        <input type="radio" className="btn-check" name="estado" id={e.id}
                          checked={value === e.valor} onChange={() => onChange(e.valor)} />
                        <label className="btn" htmlFor={e.id}>{e.texto}</label>
                      </span>
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="descripcion" className="form-label">Notas <span className="text-secondary fw-normal">(opcional)</span></label>
              <Controller
                control={control}
                name="descripcion"
                render={({ field }) => (
                  <textarea {...field} id="descripcion" rows="3"
                    className={errors.descripcion ? "form-control is-invalid" : "form-control"} />
                )}
              />
              {errors.descripcion && <div className="invalid-feedback">{errors.descripcion.message}</div>}
              <div className="form-text">Hasta 200 caracteres.</div>
            </div>

            {errorViaje && <div className="alert alert-danger" role="alert">{errorViaje}</div>}

            <div className="d-flex flex-wrap gap-2 justify-content-end">
              <Link to="/dashboard" className="btn btn-borde">Cancelar</Link>
              <BotonCargando
                texto="Guardar viaje"
                textoCargando="Guardando viaje…"
                cargando={guardando}
                onClick={handleSubmit(onSubmit)}
                deshabilitado={!isValid}
                clases=""
              />
            </div>
          </form>
        </div>

   
        <aside className="col-lg-5 position-sticky" style={{ top: "1.5rem" }}>
          <p className="fw-semibold text-secondary mb-2">Así se va a ver en tu lista</p>
          <div className="pase">
            <div className="pase-cuerpo">
              <p className="pase-codigo">{destino ? destino.slice(0, 3).toUpperCase() : "———"}</p>
              <h3 className="pase-ciudad">{destino || "Tu destino"}</h3>
              <dl className="pase-datos">
                <div><dt>Salida</dt><dd>{formatearFecha(fechaInicio)}</dd></div>
                <div><dt>Regreso</dt><dd>{formatearFecha(fechaFin)}</dd></div>
                <div><dt>Presupuesto</dt><dd>{presupuesto ? `USD ${Number(presupuesto).toLocaleString("es-UY")}` : "—"}</dd></div>
              </dl>
            </div>
            <div className="pase-talon">
              <span className={`estado estado-${estado.replace("_", "-")}`}>{textoEstado ? textoEstado.texto : ""}</span>
              <span className="categoria">
                {buscarNombreCategoria(categoria) ? <><i className="bi bi-tag"></i> {buscarNombreCategoria(categoria)}</> : "Sin categoría"}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default FormViaje;