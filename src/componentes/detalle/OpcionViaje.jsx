const OpcionViaje = ({ titulo, icono, datos, detalle, recomendada, formatearDuracion }) => {
  return (
    <div className="col-sm-6">
      <div className="opcion-viaje">
        <div className="opcion-cabecera">
          <span className="opcion-titulo"><i className={icono}></i> {titulo}</span>
          {recomendada && <span className="opcion-etiqueta"><i className="bi bi-star-fill"></i> Recomendado</span>}
        </div>
        <p className="opcion-tiempo">{formatearDuracion(datos.duracionHoras)}</p>
        <p className="opcion-detalle">{datos.distanciaKm.toLocaleString("es-UY")} km · {detalle}</p>
      </div>
    </div>
  );
};

export default OpcionViaje;
