const Navbar = ({ nombre }) => {
  return (
    <nav className="navbar navbar-expand-md barra py-0">
      <div className="container">
        <a className="marca py-3" href="#">
          <span className="marca-icono">
            <i className="bi bi-airplane-fill"></i>
          </span>
          Planificador
        </a>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav ms-md-4 me-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#" aria-current="page">
                Mis viajes
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Categorías
              </a>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="bi bi-person-circle"></i> {nombre}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Cerrar sesión
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
