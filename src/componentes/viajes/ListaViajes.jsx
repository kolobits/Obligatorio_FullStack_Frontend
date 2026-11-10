import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { guardarViajes, vaciarViajes } from "../../store/slices/viajesSlice";
import { borrarToken } from "../../store/slices/usuarioSlice";
import { mostrarSpinner, ocultarSpinner } from "../../store/slices/spinnerSlice";
import PaseViaje from "./PaseViaje";

const ListaViajes = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(state => state.usuario.token);
  const viajes = useSelector(state => state.viajes.listaViajes);
  const cargando = useSelector(state => state.spinner.cargando);
  const categorias = useSelector(state => state.categorias.listaCategorias);
  const filtroEstado = useSelector(state => state.viajes.filtroEstado);
  const filtroCategoria = useSelector(state => state.viajes.filtroCategoria);
  const page = useSelector(state => state.viajes.page);
  const recargas = useSelector(state => state.viajes.recargas);

  useEffect(() => {
    let url = `${API_BASE_URL}/v1/viajes?page=${page}&limit=4`;
    if (filtroEstado !== "") {
      url = url + `&estado=${filtroEstado}`;
    }
    if (filtroCategoria !== "") {
      url = url + `&categoria=${filtroCategoria}`;
    }

    const mostrarCarga = viajes.length === 0;
    if (mostrarCarga) {
      dispatch(mostrarSpinner("Buscando tus viajes…"));
    }

    fetch(url, {
      headers: {
        'Authorization': token,
      }
    })
      .then(r => r.json())
      .then(datos => {
        console.log(datos);
        if (datos.data) {
          dispatch(guardarViajes(datos));
        } else if (datos.message === "unauthorized invalid token provided") {
          localStorage.clear();
          dispatch(borrarToken());
          dispatch(vaciarViajes());
          navigate("/");
        }
      })
      .catch(() => toast.error("No se pudieron cargar tus viajes"))
      .finally(() => {
        if (mostrarCarga) {
          dispatch(ocultarSpinner());
        }
      })
  }, [filtroEstado, filtroCategoria, page, recargas])

  const buscarNombreCategoria = (idCategoria) => {
    const encontrada = categorias.find(
      (categoria) => categoria._id === idCategoria,
    );
    return encontrada ? encontrada.nombre : null;
  };

  if (viajes.length === 0) {
    if (cargando) {
      return null;
    }

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
    <div className="row row-cols-1 row-cols-lg-2 g-4">
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
