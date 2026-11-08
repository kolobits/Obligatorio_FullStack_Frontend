import { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { borrarToken, guardarPerfil } from "../../store/slices/usuarioSlice";
import { guardarCategorias } from "../../store/slices/categoriasSlice";
import Avatar from "../perfil/Avatar";
import "./styles/navbar.css";
import { vaciarViajes } from "../../store/slices/viajesSlice";

const Navbar = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const perfil = useSelector(state => state.usuario.perfil);

 const logout = () => {
  localStorage.clear();
  dispatch(borrarToken());
  dispatch(vaciarViajes());
  navigate("/");
}

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/");
    } else {
      fetch(`${API_BASE_URL}/v1/usuarios/perfil`, {
        headers: {
          'Authorization': localStorage.getItem("token"),
        }
      })
        .then(r => r.json())
        .then(datos => {
          console.log(datos);
          if (datos.username) {
            dispatch(guardarPerfil(datos));
          } else {
            logout();
          }
        })

      fetch(`${API_BASE_URL}/v1/categorias`, {
        headers: {
          'Authorization': localStorage.getItem("token"),
        }
      })
        .then(r => r.json())
        .then(datos => {
          console.log(datos);
          dispatch(guardarCategorias(datos));
        })
    }
  }, [])

  return (
    <div>
      <nav className="navbar navbar-expand-md barra py-0">
        <div className="container">
          <Link className="marca py-3" to="/dashboard">
            <span className="marca-icono"><i className="bi bi-airplane-fill"></i></span>
            Planificador
          </Link>
          <button className="navbar-toggler" type="button" aria-label="Abrir menú">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="menu">
            <ul className="navbar-nav ms-md-4 me-auto">
              <li className="nav-item"><NavLink className="nav-link" to="/dashboard">Mis viajes</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/categorias">Categorías</NavLink></li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link nav-usuario" to="/perfil">
                  <Avatar perfil={perfil} tamano={28} /> {perfil && perfil.username}
                </NavLink>
              </li>
              <li className="nav-item"><button type="button" className="nav-link" onClick={logout}>Cerrar sesión</button></li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};



export default Navbar;