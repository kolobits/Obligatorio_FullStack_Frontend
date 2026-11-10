import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { eliminarViaje } from "../../store/slices/viajesSlice";
import ModalConfirmar from "../comunes/ModalConfirmar";
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
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const token = useSelector(state => state.usuario.token);
  const [confirmando, setConfirmando] = useState(false);
  const [borrando, setBorrando] = useState(false);

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
    setBorrando(true);
    fetch(`${API_BASE_URL}/v1/viajes/${_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token,
      }
    })
      .then(r => {
        if (r.status === 204) {
          dispatch(eliminarViaje(_id));
          toast.success(`Se eliminó el viaje a ${destino}`);
        } else {
          toast.error("No se pudo eliminar el viaje");
        }
      })
      .catch(() => toast.error("No se pudo conectar con el servidor"))
      .finally(() => {
        setBorrando(false);
        setConfirmando(false);
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
            <Link to={`/viajes/${_id}`} className="btn btn-tinta btn-sm">
              Ver detalle
            </Link>
            <Link to={`/viajes/${_id}/editar`} className="btn btn-borde btn-sm">
              <i className="bi bi-pencil"></i> Editar
            </Link>
            <button type="button" className="btn btn-peligro btn-sm" onClick={() => setConfirmando(true)}>
              <i className="bi bi-trash"></i> Eliminar
            </button>
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

      <ModalConfirmar
        abierto={confirmando}
        titulo={`¿Eliminar el viaje a ${destino}?`}
        mensaje="Se borran también el itinerario y la foto de portada. Esta acción no se puede deshacer."
        textoConfirmar="Sí, eliminar"
        textoCargando="Eliminando…"
        cargando={borrando}
        peligro={true}
        onConfirmar={borrar}
        onCancelar={() => setConfirmando(false)}
      />
    </div>
  );
};

export default PaseViaje;