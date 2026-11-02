import "./styles/spinners.css";

const AVION = "M12 2c.8 0 1.5.7 1.5 1.5V9l7.5 4.5v2L13.5 13v4.8l2.5 1.9V21L12 20l-4 1v-1.3l2.5-1.9V13L3 15.5v-2L10.5 9V3.5C10.5 2.7 11.2 2 12 2z";

const BotonCargando = ({ texto, textoCargando, cargando, onClick, deshabilitado, clases }) => {
  if (cargando) {
    return (
      <button type="button" className={`btn btn-senal btn-cargando ${clases}`} disabled>
        <span className="btn-cargando-avion" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d={AVION} /></svg>
        </span>
        {textoCargando}
      </button>
    );
  }

  return (
    <button type="button" className={`btn btn-senal ${clases}`} onClick={onClick} disabled={deshabilitado}>
      {texto}
    </button>
  );
};

export default BotonCargando;
