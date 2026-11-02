const PanelTablero = () => {
  const destinos = [
    { codigo: "MAD", ciudad: "Madrid", icono: "bi bi-cloud-rain", temp: 12 },
    { codigo: "CUZ", ciudad: "Cusco", icono: "bi bi-sun", temp: 19 },
    { codigo: "ROM", ciudad: "Roma", icono: "bi bi-cloud-sun", temp: 16 },
    { codigo: "FLN", ciudad: "Florianópolis", icono: "bi bi-sun", temp: 27 },
  ];

  return (
    <section className="auth-tablero">
      <a className="marca text-white" href="#">
        <span className="marca-icono text-dark">
          <i className="bi bi-airplane-fill"></i>
        </span>
        Planificador
      </a>
      <h1>¿A dónde vas ahora?</h1>
      <table className="tablero" aria-label="Ejemplos de destinos">
        <tbody>
          {destinos.map((destino) => (
            <tr key={destino.codigo}>
              <td className="codigo">{destino.codigo}</td>
              <td>{destino.ciudad}</td>
              <td className="temp">
                <i className={destino.icono}></i> {destino.temp}°
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mb-0" style={{ color: "#b9c3d6" }}>
        Armá tu viaje y te sugerimos qué visitar cada día según el clima.
      </p>
    </section>
  );
};

export default PanelTablero;
