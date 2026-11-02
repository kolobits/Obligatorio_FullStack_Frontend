import { useDispatch, useSelector } from "react-redux";
import { cambiarPagina } from "../../store/slices/viajesSlice";

const Paginacion = () => {

  const dispatch = useDispatch();
  const page = useSelector(state => state.viajes.page);
  const totalPages = useSelector(state => state.viajes.totalPages);
  const total = useSelector(state => state.viajes.total);
  const mostrando = useSelector(state => state.viajes.listaViajes.length);

  return (
    <nav
      className="d-flex justify-content-between align-items-center mt-5"
      aria-label="Páginas"
    >
      <span className="text-secondary">
        Mostrando {mostrando} de {total} viajes
      </span>
      <ul className="pagination mb-0">
        <li className={page <= 1 ? "page-item disabled" : "page-item"}>
          <button type="button" className="page-link" onClick={() => dispatch(cambiarPagina(page - 1))}>
            Anterior
          </button>
        </li>
        <li className="page-item active" aria-current="page">
          <span className="page-link">{page}</span>
        </li>
        <li className={page >= totalPages ? "page-item disabled" : "page-item"}>
          <button type="button" className="page-link" onClick={() => dispatch(cambiarPagina(page + 1))}>
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Paginacion;