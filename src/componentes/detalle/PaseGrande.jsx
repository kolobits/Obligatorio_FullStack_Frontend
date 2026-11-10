import { useState } from "react";
import { useSelector } from "react-redux";

const PaseGrande = ({ destino, fechaInicio, fechaFin, presupuesto, estado, categoria, descripcion, imagenUrl }) => {

  const categorias = useSelector(state => state.categorias.listaCategorias);
  const [fotoRota, setFotoRota] = useState(false);

  const textosEstado = {
    planificado: "Planificado",
    en_curso: "En curso",
    finalizado: "Finalizado",
    cancelado: "Cancelado",
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha)
      .toLocaleDateString("es-UY", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
      .replace(".", "");
  };

  const codigo = destino.slice(0, 3).toUpperCase();
  const dias = (new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24) + 1;
  const encontrada = categorias.find(c => c._id === categoria);
  const foto = imagenUrl ? imagenUrl.replace("/upload/", "/upload/c_limit,w_1200,h_1200,q_auto,f_auto/") : "";

  return (
    <article className="pase pase-grande mb-3">
      <div className="pase-cuerpo p-4 p-md-5">
        <span className={`estado estado-${estado.replace("_", "-")} mb-3`}>{textosEstado[estado]}</span>
        <h1 className="pase-codigo">{codigo}</h1>
        <p className="pase-ciudad fs-5">{destino}</p>
        <dl className="pase-datos">
          <div><dt>Salida</dt><dd>{formatearFecha(fechaInicio)}</dd></div>
          <div><dt>Regreso</dt><dd>{formatearFecha(fechaFin)}</dd></div>
          <div><dt>Duración</dt><dd>{dias} {dias === 1 ? "día" : "días"}</dd></div>
          <div><dt>Presupuesto</dt><dd>USD {presupuesto.toLocaleString("es-UY")}</dd></div>
          <div><dt>Categoría</dt><dd>{encontrada ? encontrada.nombre : "Sin categoría"}</dd></div>
        </dl>
        {descripcion && <p className="mt-4 mb-0">{descripcion}</p>}
      </div>
      <div className="pase-talon">
        {foto && !fotoRota ? (
          <img src={foto} alt={`Foto de portada del viaje a ${destino}`} onError={() => setFotoRota(true)} />
        ) : (
          <div className="pase-sin-foto">
            <i className="bi bi-airplane-fill"></i>
            <span>Sin foto de portada</span>
          </div>
        )}
      </div>
    </article>
  );
};

export default PaseGrande;
