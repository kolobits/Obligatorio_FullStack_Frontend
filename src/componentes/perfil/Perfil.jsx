import { useSelector } from "react-redux";
import InformeUso from "./InformeUso";
import CambioPlan from "./CambioPlan";

const Perfil = () => {

  const perfil = useSelector(state => state.usuario.perfil);

  return (
    <main className="container py-5" style={{ maxWidth: "980px" }}>
      <h1 className="mb-4">Mi perfil</h1>

      <section className="panel d-flex flex-wrap align-items-center gap-4 mb-5">
        <div className="marca-icono" style={{ width: "64px", height: "64px", borderRadius: "16px", fontSize: "1.6rem" }}>
          <i className="bi bi-person"></i>
        </div>
        <div>
          <h2 className="mb-1">{perfil && perfil.username}</h2>
          <p className="mb-0 text-secondary">Plan {perfil && perfil.perfil}</p>
        </div>
      </section>

      <h2 className="mb-3">Tu plan</h2>
      <div className="row g-4">
        <div className="col-md-6">
          <InformeUso />
        </div>
        <div className="col-md-6">
          <CambioPlan />
        </div>
      </div>
    </main>
  );
};

export default Perfil;