const PaseViaje = ({
  destino,
  fechaInicio,
  fechaFin,
  presupuesto,
  estado,
  nombreCategoria,
}) => {
  const textosEstado = {
    planificado: "Planificado",
    en_curso: "En curso",
    finalizado: "Finalizado",
    cancelado: "Cancelado",
  };

  // Para el formato de las fechas"
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

  return (
    <div className="col">
      <a href="#" className="pase">
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
      </a>
    </div>
  );
};

export default PaseViaje;
