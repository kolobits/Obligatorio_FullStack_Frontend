import InformeUso from "./InformeUso";
import CambioPlan from "./CambioPlan";
import FotoPerfil from "./FotoPerfil";

const Perfil = () => {

  return (
    <main className="container py-5" style={{ maxWidth: "980px" }}>
      <h1 className="mb-4">Mi perfil</h1>

      <FotoPerfil />

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