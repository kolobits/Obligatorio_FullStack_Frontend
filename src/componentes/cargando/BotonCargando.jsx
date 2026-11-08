import "./styles/spinners.css";
import { AVION } from "./avion";

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
