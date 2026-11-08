import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import VueltaAlMundo from "../cargando/VueltaAlMundo";

const LugaresCerca = ({ id }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = useSelector(state => state.usuario.token);
  const perfil = useSelector(state => state.usuario.perfil);
  const [lugares, setLugares] = useState(null);
  const [error, setError] = useState("");

  const esPremium = perfil && perfil.perfil === "premium";

  useEffect(() => {
    if (esPremium) {
      fetch(`${API_BASE_URL}/v1/viajes/${id}/puntos-interes`, {
        headers: {
          'Authorization': token,
        }
      })
        .then(r => r.json())
        .then(datos => {
          console.log(datos);
          if (datos.puntosDeInteres) {
            setLugares(datos.puntosDeInteres);
          } else {
            setError(datos.message);
          }
        })
    }
  }, [id, esPremium])

  if (!esPremium) {
    return (
      <div className="panel text-center py-5" style={{ maxWidth: "640px" }}>
        <i className="bi bi-lock fs-1"></i>
        <h2 className="mt-2">Lugares cerca es parte de premium</h2>
        <p className="text-secondary">Con premium ves hasta 20 lugares para visitar cerca de tu destino y tenés viajes ilimitados.</p>
        <Link to="/perfil" className="btn btn-senal">Ver plan premium</Link>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  if (lugares === null) {
    return <VueltaAlMundo tamano={100} texto="Buscando lugares cerca de tu destino…" />;
  }

  return (
    <div className="panel">
      <p className="text-secondary mb-3">{lugares.length} lugares, del más cercano al más lejano.</p>
      <div className="lugares">
        {lugares.map(lugar => (
          <span key={lugar.nombre} className="lugar">
            <i className="bi bi-geo-alt"></i> {lugar.nombre}
            {lugar.distanciaKm !== null && <small className="text-secondary fw-normal">{lugar.distanciaKm.toLocaleString("es-UY")} km</small>}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LugaresCerca;
