import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { eliminarViaje } from "../../store/slices/viajesSlice";
import "./styles/pase.css";

const PaseViaje = ({
  _id,
  destino,
  fechaInicio,
  fechaFin,
  presupuesto,
  estado,
  nombreCategoria,
}) => {

  const dispatch = useDispatch();
  const token = useSelector(state => state.usuario.token);
  const [confirmando, setConfirmando] = useState(false);

  const textosEstado = {
    planificado: "Planificado",
    en_curso: "En curso",
    finalizado: "Finalizado",
    cancelado: "Cancelado",
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha)
      .toLocaleDateString("es-UY", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      })
      .replace(".", "");
  };

  const codigo = destino.slice(0, 3).toUpperCase();
  const dias =
    (new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24) + 1;

  const borrar = () => {
    fetch(`https://obligatorio1-fullstack.vercel.app/v1/viajes/${_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token,
      }
    })
      .then(r => {
        if (r.status === 204) {
          dispatch(eliminarViaje(_id));
        }
      })
  }

  return (
    <div className="col">
      <div className="pase">
        <div className="pase-cuerpo">
          <p className="pase-codigo">{codigo}</p>
          <h3 className="pase-ciudad">{destino}</h3>
          <dl className="pase-datos">
            <div>
              <dt>Salida</dt>
              <dd>{formatearFecha(fechaInicio)}</dd>
            </div>
            <div>
              <dt>Regreso</dt>
              <dd>{formatearFecha(fechaFin)}</dd>
            </div>
            <div>
              <dt>Presupuesto</dt>
              <dd>USD {presupuesto.toLocaleString("es-UY")}</dd>
            </div>
          </dl>

          <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
            {!confirmando && (
              <>
                <Link to={`/viajes/${_id}`} className="btn btn-tinta btn-sm">
                  Ver detalle
                </Link>
                <Link to={`/viajes/${_id}/editar`} className="btn btn-borde btn-sm">
                  <i className="bi bi-pencil"></i> Editar
                </Link>
                <button type="button" className="btn btn-peligro btn-sm" onClick={() => setConfirmando(true)}>
                  <i className="bi bi-trash"></i> Eliminar
                </button>
              </>
            )}
            {confirmando && (
              <>
                <span className="small fw-semibold w-100">¿Eliminar este viaje?</span>
                <button type="button" className="btn btn-peligro btn-sm" onClick={borrar}>Sí, eliminar</button>
                <button type="button" className="btn btn-borde btn-sm" onClick={() => setConfirmando(false)}>Cancelar</button>
              </>
            )}
          </div>
        </div>
        <div className="pase-talon">
          <span className={`estado estado-${estado.replace("_", "-")}`}>
            {textosEstado[estado]}
          </span>
          <span className="pase-dias">
            {dias}
            <small>días</small>
          </span>
          <span className="categoria">
            {nombreCategoria ? (
              <>
                <i className="bi bi-tag"></i> {nombreCategoria}
              </>
            ) : (
              "Sin categoría"
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaseViaje;