import PaseViaje from "./PaseViaje";

const ListaViajes = ({ viajes, categorias }) => {
  const buscarNombreCategoria = (idCategoria) => {
    const encontrada = categorias.find(
      (categoria) => categoria._id === idCategoria,
    );
    return encontrada ? encontrada.nombre : null;
  };

  if (viajes.length === 0) {
    return (
      <div className="panel text-center py-5 mt-4">
        <h2>Todavía no tenés viajes</h2>
        <p className="text-secondary">
          Creá el primero y te armamos el itinerario según el clima.
        </p>
        <a href="#" className="btn btn-senal">
          Crear mi primer viaje
        </a>
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-lg-2 g-4">
      {viajes.map((viaje) => (
        <PaseViaje
          key={viaje._id}
          {...viaje}
          nombreCategoria={buscarNombreCategoria(viaje.categoria)}
        />
      ))}
    </div>
  );
};

export default ListaViajes;
