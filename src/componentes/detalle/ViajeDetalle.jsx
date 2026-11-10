import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { eliminarViaje } from "../../store/slices/viajesSlice";
import { mostrarSpinner, ocultarSpinner } from "../../store/slices/spinnerSlice";
import PaseGrande from "./PaseGrande";
import Itinerario from "./Itinerario";
import Distancia from "./Distancia";
import LugaresCerca from "./LugaresCerca";
import ModalConfirmar from "../comunes/ModalConfirmar";
import "../viajes/styles/pase.css";
import "./styles/detalle.css";

const ViajeDetalle = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(state => state.usuario.token);
  const perfil = useSelector(state => state.usuario.perfil);

  const [viaje, setViaje] = useState(null);
  const [error, setError] = useState("");
  const [pestana, setPestana] = useState("itinerario");
  const [confirmando, setConfirmando] = useState(false);
  const [borrando, setBorrando] = useState(false);

  useEffect(() => {
    dispatch(mostrarSpinner("Buscando tu viaje…"));

    fetch(`${API_BASE_URL}/v1/viajes/${id}`, {
      headers: {
        'Authorization': token,
      }
    })
      .then(r => r.json())
      .then(datos => {
        console.log(datos);
        if (datos._id) {
          setViaje(datos);
        } else {
          setError(datos.message);
        }
      })
      .catch(() => setError("No se pudo conectar con el servidor."))
      .finally(() => dispatch(ocultarSpinner()))
  }, [id])

  const borrar = () => {
    setBorrando(true);
    fetch(`${API_BASE_URL}/v1/viajes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token,
      }
    })
      .then(r => {
        if (r.status === 204) {
          dispatch(eliminarViaje(id));
          toast.success(`Se eliminó el viaje a ${viaje.destino}`);
          navigate("/dashboard");
        } else {
          setBorrando(false);
          setConfirmando(false);
          toast.error("No se pudo eliminar el viaje");
        }
      })
      .catch(() => {
        setBorrando(false);
        setConfirmando(false);
        toast.error("No se pudo conectar con el servidor");
      })
  }

  const esPremium = perfil && perfil.perfil === "premium";

  const pestanas = [
    { valor: "itinerario", texto: "Itinerario y clima" },
    { valor: "distancia", texto: "Cómo llegar" },
    { valor: "lugares", texto: "Lugares cerca" },
  ];

  if (error) {
    return (
      <main className="container py-5">
        <div className="panel text-center py-5">
          <h1 className="h2">No encontramos ese viaje</h1>
          <p className="text-secondary">{error}</p>
          <Link to="/dashboard" className="btn btn-senal">Volver a mis viajes</Link>
        </div>
      </main>
    );
  }

  if (viaje === null) {
    return <main className="container py-5" style={{ minHeight: "60vh" }}></main>;
  }

  return (
    <main className="container py-5">
      <Link to="/dashboard" className="volver mb-3"><i className="bi bi-arrow-left"></i> Volver a mis viajes</Link>

      <PaseGrande {...viaje} />

      <div className="d-flex flex-wrap align-items-center gap-2 mb-5">
        <Link to={`/viajes/${id}/editar`} className="btn btn-borde"><i className="bi bi-pencil"></i> Editar viaje</Link>
        <button type="button" className="btn btn-peligro" onClick={() => setConfirmando(true)}><i className="bi bi-trash"></i> Borrar viaje</button>
      </div>

      <ul className="nav pestanas mb-4" role="tablist">
        {pestanas.map(p => (
          <li key={p.valor} className="nav-item" role="presentation">
            <button
              type="button"
              role="tab"
              aria-selected={pestana === p.valor}
              className={pestana === p.valor ? "nav-link active" : "nav-link"}
              onClick={() => setPestana(p.valor)}
            >
              {p.valor === "lugares" && !esPremium && <i className="bi bi-lock"></i>} {p.texto}
            </button>
          </li>
        ))}
      </ul>

      {pestana === "itinerario" && <Itinerario id={id} />}
      {pestana === "distancia" && <Distancia id={id} />}
      {pestana === "lugares" && <LugaresCerca id={id} />}

      <ModalConfirmar
        abierto={confirmando}
        titulo={`¿Borrar el viaje a ${viaje.destino}?`}
        mensaje="Se borran también el itinerario y la foto de portada. Esta acción no se puede deshacer."
        textoConfirmar="Sí, borrar"
        textoCargando="Borrando…"
        cargando={borrando}
        peligro={true}
        onConfirmar={borrar}
        onCancelar={() => setConfirmando(false)}
      />
    </main>
  );
};

export default ViajeDetalle;
