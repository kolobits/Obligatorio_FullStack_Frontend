import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { guardarPerfil } from "../../store/slices/usuarioSlice";
import ModalConfirmar from "../comunes/ModalConfirmar";
import "../viajes/styles/pase.css";
import "./styles/plan.css";

const CambioPlan = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const token = useSelector(state => state.usuario.token);
  const perfil = useSelector(state => state.usuario.perfil);
  const [confirmando, setConfirmando] = useState(false);
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
        if (datos.perfil) {
          dispatch(guardarPerfil(datos));
          toast.success("Ya sos premium: viajes ilimitados y lugares cerca");
        } else {
          toast.error(datos.message || "No se pudo cambiar el plan");
        }
      })
      .catch(() => toast.error("No se pudo conectar con el servidor"))
      .finally(() => {
        setCargando(false);
        setConfirmando(false);
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
        <button type="button" className="btn btn-senal" onClick={() => setConfirmando(true)}>
          Pasar a premium
        </button>
      </div>
      <div className="pase-talon">
        <i className="bi bi-infinity fs-1"></i>
      </div>

      <ModalConfirmar
        abierto={confirmando}
        titulo="¿Pasar a premium?"
        mensaje="Vas a tener viajes ilimitados y la pestaña Lugares Cerca en cada viaje."
        textoConfirmar="Sí, pasar a premium"
        textoCargando="Cambiando tu plan…"
        cargando={cargando}
        peligro={false}
        onConfirmar={pasarAPremium}
        onCancelar={() => setConfirmando(false)}
      />
    </div>
  );
};

export default CambioPlan;