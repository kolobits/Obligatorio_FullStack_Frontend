const EncabezadoViajes = ({ usados }) => {
  const lugares = [1, 2, 3, 4];

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-end gap-4 mb-4">
      <div>
        <h1 className="mb-2">Mis viajes</h1>
        <div className="d-flex align-items-center gap-3">
          <div className="asientos" aria-hidden="true">
            {lugares.map((lugar) => (
              <span
                key={lugar}
                className={lugar <= usados ? "asiento ocupado" : "asiento"}
              ></span>
            ))}
          </div>
          <span>
            Plan plus: usaste {usados} de {lugares.length} lugares.{" "}
            <a href="#">Pasar a premium</a>
          </span>
        </div>
      </div>
      <a href="#" className="btn btn-senal">
        <i className="bi bi-plus-lg"></i> Nuevo viaje
      </a>
    </div>
  );
};

export default EncabezadoViajes;
