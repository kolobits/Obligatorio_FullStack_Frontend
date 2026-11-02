import EncabezadoViajes from "./EncabezadoViajes";
import FiltrosViajes from "./FiltrosViajes";
import ListaViajes from "./ListaViajes";
import Paginacion from "./Paginacion";

const Dashboard = () => {
  return (
    <main className="container py-5">
      <EncabezadoViajes />

      {/* Gráfico */}
      <div className="panel text-center text-secondary py-5 mb-4">
        Acá va el gráfico
      </div>

      <FiltrosViajes />
      <ListaViajes />
      <Paginacion />
    </main>
  );
};

export default Dashboard;