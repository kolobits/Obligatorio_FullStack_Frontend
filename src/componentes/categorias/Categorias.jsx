import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { agregarCategoria, actualizarCategoria, eliminarCategoria } from "../../store/slices/categoriasSlice";
import FilaCategoria from "./FilaCategoria";
import ModalCategoria from "./ModalCategoria";
import "./styles/categorias.css";

const URL_CATEGORIAS = `${import.meta.env.VITE_API_BASE_URL}/v1/categorias`;

const Categorias = () => {

  const dispatch = useDispatch();
  const token = useSelector(state => state.usuario.token);
  const perfil = useSelector(state => state.usuario.perfil);
  const categorias = useSelector(state => state.categorias.listaCategorias);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const esAdmin = perfil !== null && perfil.rol === "admin";

  const abrirModal = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCategoriaSeleccionada(null);
  };

  const guardar = (datos) => {
    const editando = categoriaSeleccionada !== null;
    const url = editando ? `${URL_CATEGORIAS}/${categoriaSeleccionada._id}` : URL_CATEGORIAS;

    return fetch(url, {
      method: editando ? "PUT" : "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(datos),
    })
      .then(r => r.json())
      .then(respuesta => {
        if (respuesta._id) {
          if (editando) {
            dispatch(actualizarCategoria(respuesta));
            toast.success("Categoría actualizada");
          } else {
            dispatch(agregarCategoria(respuesta));
            toast.success(`Se creó ${respuesta.nombre}`);
          }
          cerrarModal();
        } else {
          toast.error(respuesta.message || "No se pudo guardar la categoría");
        }
      })
      .catch(() => toast.error("No se pudo conectar con el servidor"));
  };

  const borrar = (categoria) => {
    return fetch(`${URL_CATEGORIAS}/${categoria._id}`, {
      method: "DELETE",
      headers: {
        'Authorization': token,
      },
    })
      .then(r => {
        if (r.status === 204) {
          dispatch(eliminarCategoria(categoria._id));
          toast.success(`Se borró ${categoria.nombre}`);
        } else {
          return r.json().then(datos => toast.error(datos.message || "No se pudo borrar la categoría"));
        }
      })
      .catch(() => toast.error("No se pudo conectar con el servidor"));
  };

  return (
    <main className="container py-5" style={{ maxWidth: "980px" }}>
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h1 className="mb-1">Categorías</h1>
          <p className="text-secondary mb-0">
            {esAdmin
              ? "Los usuarios eligen una al crear un viaje. Como administrador, podés crearlas, editarlas y borrarlas."
              : "Las categorías que podés elegir al crear un viaje. Solo un administrador puede cambiarlas."}
          </p>
        </div>
        {esAdmin && (
          <button type="button" className="btn btn-senal" onClick={() => abrirModal(null)}>
            <i className="bi bi-plus-lg"></i> Nueva categoría
          </button>
        )}
      </div>

      {categorias.length === 0 ? (
        <div className="panel text-center py-5">
          <i className="bi bi-tags fs-1"></i>
          <h2 className="mt-2">Todavía no hay categorías</h2>
          <p className="text-secondary mb-0">
            {esAdmin ? "Creá la primera con el botón Nueva categoría." : "Cuando un administrador las cree, van a aparecer acá."}
          </p>
        </div>
      ) : (
        <div className="panel p-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table tabla align-middle">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  {esAdmin && <th className="text-end">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {categorias.map(categoria => (
                  <FilaCategoria
                    key={categoria._id}
                    categoria={categoria}
                    esAdmin={esAdmin}
                    onEditar={abrirModal}
                    onBorrar={borrar}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ModalCategoria
        abierto={modalAbierto}
        onCerrar={cerrarModal}
        categoria={categoriaSeleccionada}
        onGuardar={guardar}
      />
    </main>
  );
};

export default Categorias;
