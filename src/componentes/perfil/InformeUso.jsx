import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { guardarCantidad } from "../../store/slices/viajesSlice";
import "../viajes/styles/pase.css";
import "./styles/plan.css";

const InformeUso = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const token = useSelector(state => state.usuario.token);
  const perfil = useSelector(state => state.usuario.perfil);
  const cantidad = useSelector(state => state.viajes.cantidad);

  const lugares = [1, 2, 3, 4];
  const porcentaje = Math.round((cantidad / 4) * 100);

  
  useEffect(() => {
    fetch(`${API_BASE_URL}/v1/viajes?limit=1`, {
      headers: {
        'Authorization': token,
      }
    })
      .then(r => r.json())
      .then(datos => {
        console.log(datos);
        if (datos.data) {
          dispatch(guardarCantidad(datos.total));
        }
      })
  }, [])

  if (perfil === null) {
    return <div className="panel text-secondary">Cargando tu plan…</div>;
  }

  if (perfil.perfil === "plus") {
    return (
      <div className="pase plan">
        <div className="pase-cuerpo">
          <span className="plan-etiqueta"><i className="bi bi-check-circle-fill"></i> Tu plan actual</span>
          <p className="pase-codigo" style={{ fontSize: "2.75rem" }}>Plus</p>
          <p className="pase-ciudad">El plan con el que arrancás</p>
          <ul className="plan-lista">
            <li><i className="bi bi-check-lg"></i> Hasta 4 viajes</li>
            <li><i className="bi bi-check-lg"></i> Itinerario según el clima</li>
            <li><i className="bi bi-check-lg"></i> Cómo llegar desde tu ciudad</li>
            <li className="no"><i className="bi bi-x-lg"></i> Lugares cerca</li>
          </ul>
        </div>
        <div className="pase-talon">
          <span className="pase-dias">{porcentaje}%<small>usado</small></span>
          <div className="asientos flex-wrap" aria-hidden="true">
            {lugares.map(lugar => (
              <span key={lugar} className={lugar <= cantidad ? "asiento ocupado" : "asiento"}></span>
            ))}
          </div>
          <span className="small">{cantidad} de 4 viajes</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pase plan">
      <div className="pase-cuerpo">
        <span className="plan-etiqueta"><i className="bi bi-check-circle-fill"></i> Tu plan actual</span>
        <p className="pase-codigo" style={{ fontSize: "2.75rem" }}>Premium</p>
        <p className="pase-ciudad">Sin límite de viajes</p>
        <ul className="plan-lista">
          <li><i className="bi bi-check-lg"></i> Viajes ilimitados</li>
          <li><i className="bi bi-check-lg"></i> Itinerario según el clima</li>
          <li><i className="bi bi-check-lg"></i> Cómo llegar desde tu ciudad</li>
          <li><i className="bi bi-check-lg"></i> Lugares cerca</li>
        </ul>
      </div>
      <div className="pase-talon">
        <span className="pase-dias">{cantidad}<small>viajes</small></span>
        <i className="bi bi-infinity fs-1"></i>
      </div>
    </div>
  );
};

export default InformeUso;