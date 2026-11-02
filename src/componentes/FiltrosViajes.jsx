import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { guardarCategorias } from "../store/slices/categoriasSlice";
import { cambiarEstado, cambiarCategoria } from "../store/slices/viajesSlice";

const FiltrosViajes = () => {

  const dispatch = useDispatch();
  const token = useSelector(state => state.usuario.token);
  const categorias = useSelector(state => state.categorias.listaCategorias);
  const filtroEstado = useSelector(state => state.viajes.filtroEstado);
  const filtroCategoria = useSelector(state => state.viajes.filtroCategoria);

  const estados = [
    { id: "e-todos", valor: "", texto: "Todos" },
    { id: "e-plan", valor: "planificado", texto: "Planificados" },
    { id: "e-curso", valor: "en_curso", texto: "En curso" },
    { id: "e-fin", valor: "finalizado", texto: "Finalizados" },
    { id: "e-canc", valor: "cancelado", texto: "Cancelados" },
  ];

  useEffect(() => {
    fetch("https://obligatorio1-fullstack.vercel.app/v1/categorias", {
      headers: {
        'Authorization': token,
      }
    })
      .then(r => r.json())
      .then(datos => {
        console.log(datos);
        dispatch(guardarCategorias(datos));
      })
  }, [])

  return (
    <form
      className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"
      aria-label="Filtrar viajes"
    >
      <div className="chips" role="group" aria-label="Estado">
        {estados.map((estado) => (
          <span key={estado.id}>
            <input
              type="radio"
              className="btn-check"
              name="estado"
              id={estado.id}
              value={estado.valor}
              defaultChecked={estado.valor === filtroEstado}
              onChange={(e) => dispatch(cambiarEstado(e.target.value))}
            />
            <label className="btn" htmlFor={estado.id}>
              {estado.texto}
            </label>
          </span>
        ))}
      </div>
      <div>
        <label htmlFor="filtro-categoria" className="visually-hidden">
          Categoría
        </label>
        <select
          className="form-select"
          id="filtro-categoria"
          defaultValue={filtroCategoria}
          onChange={(e) => dispatch(cambiarCategoria(e.target.value))}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria._id} value={categoria._id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
};

export default FiltrosViajes;