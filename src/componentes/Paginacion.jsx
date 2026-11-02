const Paginacion = ({ mostrando, total, page, totalPages }) => {
  return (
    <nav
      className="d-flex justify-content-between align-items-center mt-5"
      aria-label="Páginas"
    >
      <span className="text-secondary">
        Mostrando {mostrando} de {total} viajes
      </span>
      <ul className="pagination mb-0">
        <li className={page === 1 ? "page-item disabled" : "page-item"}>
          <a className="page-link" href="#">
            Anterior
          </a>
        </li>
        <li className="page-item active" aria-current="page">
          <a className="page-link" href="#">
            {page}
          </a>
        </li>
        <li
          className={page === totalPages ? "page-item disabled" : "page-item"}
        >
          <a className="page-link" href="#">
            Siguiente
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Paginacion;
