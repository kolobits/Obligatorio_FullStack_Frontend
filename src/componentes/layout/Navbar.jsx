import { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { borrarToken, guardarPerfil } from "../../store/slices/usuarioSlice";
import { guardarCategorias } from "../../store/slices/categoriasSlice";
import "./styles/navbar.css";

const Navbar = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const perfil = useSelector(state => state.usuario.perfil);

  const logout = () => {
    localStorage.clear();
    dispatch(borrarToken());
    navigate("/");
  }

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/");
    } else {
      fetch("https://obligatorio1-fullstack.vercel.app/v1/usuarios/perfil", {
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

      fetch("https://obligatorio1-fullstack.vercel.app/v1/categorias", {
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
              <li className="nav-item"><NavLink className="nav-link" to="/perfil"><i className="bi bi-person-circle"></i> {perfil && perfil.username}</NavLink></li>
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