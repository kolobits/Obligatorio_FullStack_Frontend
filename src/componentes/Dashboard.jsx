import Navbar from "./Navbar";
import EncabezadoViajes from "./EncabezadoViajes";
import FiltrosViajes from "./FiltrosViajes";
import ListaViajes from "./ListaViajes";
import Paginacion from "./Paginacion";

const Dashboard = () => {
  const categorias = [
    { _id: "c1", nombre: "Cultural" },
    { _id: "c2", nombre: "Playa" },
    { _id: "c3", nombre: "Aventura" },
  ];

  const respuesta = {
    data: [
      {
        _id: "v1",
        destino: "Madrid, España",
        fechaInicio: "2026-12-10",
        fechaFin: "2026-12-17",
        presupuesto: 1500,
        estado: "planificado",
        categoria: "c1",
      },
      {
        _id: "v2",
        destino: "Cusco, Perú",
        fechaInicio: "2026-10-18",
        fechaFin: "2026-10-24",
        presupuesto: 1100,
        estado: "en_curso",
        categoria: "c3",
      },
      {
        _id: "v3",
        destino: "Roma, Italia",
        fechaInicio: "2026-03-03",
        fechaFin: "2026-03-09",
        presupuesto: 2000,
        estado: "finalizado",
        categoria: null,
      },
    ],
    page: 1,
    limit: 5,
    total: 3,
    totalPages: 1,
  };

  return (
    <>
      <Navbar nombre="Juan" />
      <main className="container py-5">
        <EncabezadoViajes usados={respuesta.total} />

        {/* Gráfico */}
        <div className="panel text-center text-secondary py-5 mb-4">
          Acá va el gráfico
        </div>

        <FiltrosViajes categorias={categorias} />
        <ListaViajes viajes={respuesta.data} categorias={categorias} />
        <Paginacion
          mostrando={respuesta.data.length}
          total={respuesta.total}
          page={respuesta.page}
          totalPages={respuesta.totalPages}
        />
      </main>
    </>
  );
};

export default Dashboard;
