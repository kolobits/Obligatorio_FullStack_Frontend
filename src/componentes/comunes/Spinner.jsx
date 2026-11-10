import { useSelector } from "react-redux";
import VueltaAlMundo from "../cargando/VueltaAlMundo";
import "./styles/spinner.css";

const Spinner = () => {

  const cargando = useSelector(state => state.spinner.cargando);
  const texto = useSelector(state => state.spinner.texto);

  return (
    <div className={cargando ? "spinner-fondo visible" : "spinner-fondo"} aria-live="polite" aria-busy={cargando}>
      <div className="spinner-tarjeta">
        <VueltaAlMundo tamano={120} texto={texto} />
      </div>
    </div>
  );
};

export default Spinner;
