import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { guardarViajes, vaciarViajes, empezarCarga, terminarCarga } from "../../store/slices/viajesSlice";
import { borrarToken } from "../../store/slices/usuarioSlice";
import PaseViaje from "./PaseViaje";
import VueltaAlMundo from "../cargando/VueltaAlMundo";

const URL_VIAJES = `${import.meta.env.VITE_API_BASE_URL}/v1/viajes`;

const ListaViajes = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(state => state.usuario.token);
  const viajes = useSelector(state => state.viajes.listaViajes);
  const cargando = useSelector(state => state.viajes.cargando);
  const categorias = useSelector(state => state.categorias.listaCategorias);
  const filtroEstado = useSelector(state => state.viajes.filtroEstado);
  const filtroCategoria = useSelector(state => state.viajes.filtroCategoria);
  const page = useSelector(state => state.viajes.page);

  useEffect(() => {
    let url = `${URL_VIAJES}?page=${page}&limit=4`;
    if (filtroEstado !== "") {
      url = url + `&estado=${filtroEstado}`;
    }
    if (filtroCategoria !== "") {
      url = url + `&categoria=${filtroCategoria}`;
    }

    dispatch(empezarCarga());

    fetch(url, {
      headers: {
        'Authorization': token,
      }
    })
      .then(r => r.json())
      .then(datos => {
        console.log(datos);
        dispatch(terminarCarga());
        if (datos.data) {
          dispatch(guardarViajes(datos));
        } else if (datos.message === "unauthorized invalid token provided") {
          localStorage.clear();
          dispatch(borrarToken());
          dispatch(vaciarViajes());
          navigate("/");
        }
      })
  }, [filtroEstado, filtroCategoria, page])

  const buscarNombreCategoria = (idCategoria) => {
    const encontrada = categorias.find(
      (categoria) => categoria._id === idCategoria,
    );
    return encontrada ? encontrada.nombre : null;
  };

  if (cargando && viajes.length === 0) {
    return <VueltaAlMundo tamano={110} texto="Buscando tus viajes…" />;
  }

  if (viajes.length === 0) {
    return (
      <div className="panel text-center py-5 mt-4">
        <h2>No hay viajes para mostrar</h2>
        <p className="text-secondary">
          Creá uno nuevo o probá con otros filtros.
        </p>
        <Link to="/viajes/nuevo" className="btn btn-senal">
          Crear un viaje
        </Link>
      </div>
    );
  }

  return (
    <div
      className="row row-cols-1 row-cols-lg-2 g-4"
      style={{ opacity: cargando ? 0.5 : 1, transition: "opacity 0.2s ease" }}
    >
      {viajes.map((viaje) => (
        <PaseViaje
          key={viaje._id}
          {...viaje}
          nombreCategoria={buscarNombreCategoria(viaje.categoria)}
        />
      ))}
    </div>
  );
};

export default ListaViajes;