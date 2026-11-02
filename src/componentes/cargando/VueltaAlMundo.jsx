import "./styles/spinners.css";

const AVION = "M12 2c.8 0 1.5.7 1.5 1.5V9l7.5 4.5v2L13.5 13v4.8l2.5 1.9V21L12 20l-4 1v-1.3l2.5-1.9V13L3 15.5v-2L10.5 9V3.5C10.5 2.7 11.2 2 12 2z";

const VueltaAlMundo = ({ tamano, texto }) => {
  return (
    <div className="cargando" role="status">
      <div className="vuelta-mundo mx-auto mb-3" style={{ "--tamano": `${tamano}px` }}>
        <div className="vuelta-mundo-orbita"></div>
        <div className="vuelta-mundo-globo">
          <span className="vuelta-mundo-meridiano"></span>
          <span className="vuelta-mundo-meridiano"></span>
          <span className="vuelta-mundo-meridiano"></span>
          <span className="vuelta-mundo-paralelo"></span>
          <span className="vuelta-mundo-paralelo"></span>
          <span className="vuelta-mundo-paralelo"></span>
        </div>
        <div className="vuelta-mundo-giro">
          <svg className="vuelta-mundo-avion" viewBox="0 0 24 24" aria-hidden="true">
            <path d={AVION} />
          </svg>
        </div>
      </div>
      <p className="mb-0">{texto}</p>
    </div>
  );
};

export default VueltaAlMundo;
