import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { guardarPerfil } from "../../store/slices/usuarioSlice";
import BotonCargando from "../cargando/BotonCargando";
import "../viajes/styles/pase.css";
import "./styles/plan.css";

const CambioPlan = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const token = useSelector(state => state.usuario.token);
  const perfil = useSelector(state => state.usuario.perfil);
  const [errorPlan, setErrorPlan] = useState("");
  const [cargando, setCargando] = useState(false);

  const pasarAPremium = () => {
    setCargando(true);
    fetch(`${API_BASE_URL}/v1/usuarios/plan`, {
      method: 'PUT',
      headers: {
        'Authorization': token,
      }
    })
      .then(r => r.json())
      .then(datos => {
        console.log(datos);
        setCargando(false);
        if (datos.perfil) {
          dispatch(guardarPerfil(datos));
          setErrorPlan("");
        } else {
          setErrorPlan(datos.message);
        }
      })
  }

  if (perfil === null) {
    return null;
  }

  if (perfil.perfil === "premium") {
    return null;
  }

  return (
    <div className="pase plan">
      <div className="pase-cuerpo">
        <span className="plan-etiqueta plan-etiqueta-suave">Mejorá tu plan</span>
        <p className="pase-codigo" style={{ fontSize: "2.75rem" }}>Premium</p>
        <p className="pase-ciudad">Sin límite de viajes</p>
        <ul className="plan-lista">
          <li><i className="bi bi-check-lg"></i> Viajes ilimitados</li>
          <li><i className="bi bi-check-lg"></i> Itinerario según el clima</li>
          <li><i className="bi bi-check-lg"></i> Cómo llegar desde tu ciudad</li>
          <li><i className="bi bi-check-lg"></i> Lugares cerca</li>
        </ul>
        {errorPlan && <div className="alert alert-danger" role="alert">{errorPlan}</div>}
        <BotonCargando
          texto="Pasar a premium"
          textoCargando="Cambiando tu plan…"
          cargando={cargando}
          onClick={pasarAPremium}
          deshabilitado={false}
          clases=""
        />
      </div>
      <div className="pase-talon">
        <i className="bi bi-infinity fs-1"></i>
      </div>
    </div>
  );
};

export default CambioPlan;