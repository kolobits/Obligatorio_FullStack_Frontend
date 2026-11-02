import EncabezadoViajes from "./EncabezadoViajes";
import FiltrosViajes from "./FiltrosViajes";
import ListaViajes from "./ListaViajes";
import Paginacion from "./Paginacion";
import GraficaViajes from "./GraficaViajes";

const Dashboard = () => {
  return (
    <main className="container py-5">
      <EncabezadoViajes />

      <GraficaViajes />

      <FiltrosViajes />
      <ListaViajes />
      <Paginacion />
    </main>
  );
};

export default Dashboard;