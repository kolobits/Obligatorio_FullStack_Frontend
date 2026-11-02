import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { guardarCantidad } from "../store/slices/viajesSlice";

const EncabezadoViajes = () => {

  const dispatch = useDispatch();
  const token = useSelector(state => state.usuario.token);
  const perfil = useSelector(state => state.usuario.perfil);
  const cantidad = useSelector(state => state.viajes.cantidad);

  const lugares = [1, 2, 3, 4];

 
  useEffect(() => {
    fetch("https://obligatorio1-fullstack.vercel.app/v1/viajes?limit=1", {
      headers: {
        'Authorization': token,
      }
    })
      .then(r => r.json())
      .then(datos => {
        console.log(datos);
        if (datos.data) {
          dispatch(guardarCantidad(datos.total));
        }
      })
  }, [])

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-end gap-4 mb-4">
      <div>
        <h1 className="mb-2">Mis viajes</h1>
        {perfil && perfil.perfil === "plus" && (
          <div className="d-flex align-items-center gap-3">
            <div className="asientos" aria-hidden="true">
              {lugares.map((lugar) => (
                <span
                  key={lugar}
                  className={lugar <= cantidad ? "asiento ocupado" : "asiento"}
                ></span>
              ))}
            </div>
            <span>
              Plan plus: usaste {cantidad} de {lugares.length} lugares.{" "}
              <a href="#">Pasar a premium</a>
            </span>
          </div>
        )}
        {perfil && perfil.perfil === "premium" && (
          <span>Plan premium: tenés {cantidad} viajes.</span>
        )}
      </div>
      <a href="#" className="btn btn-senal">
        <i className="bi bi-plus-lg"></i> Nuevo viaje
      </a>
    </div>
  );
};

export default EncabezadoViajes;