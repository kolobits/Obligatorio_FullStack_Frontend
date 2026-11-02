import "./bootstrap.min.css";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./componentes/auth/Login";
import Registro from "./componentes/auth/Registro";
import Navbar from "./componentes/layout/Navbar";
import Dashboard from "./componentes/viajes/Dashboard";
import FormViaje from "./componentes/viajes/FormViaje";
import Perfil from "./componentes/perfil/Perfil";
import ViajeDetalle from "./componentes/detalle/ViajeDetalle";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route element={<Navbar />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/viajes/nuevo" element={<FormViaje />} />
            <Route path="/viajes/:id" element={<ViajeDetalle />} />
            <Route path="/viajes/:id/editar" element={<FormViaje />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
