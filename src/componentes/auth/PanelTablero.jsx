import { Link } from "react-router";

const PanelTablero = () => {
  const destinos = [
    { codigo: "MAD", ciudad: "Madrid", icono: "bi bi-cloud-rain", temp: 12 },
    { codigo: "CUZ", ciudad: "Cusco", icono: "bi bi-sun", temp: 19 },
    { codigo: "ROM", ciudad: "Roma", icono: "bi bi-cloud-sun", temp: 16 },
    { codigo: "FLN", ciudad: "Florianópolis", icono: "bi bi-sun", temp: 27 },
    { codigo: "TYO", ciudad: "Tokio", icono: "bi bi-cloud", temp: 9 },
  ];

  const filas = [0, 1, 2, 3].map((inicio) => {
    const lista = [...destinos.slice(inicio), ...destinos.slice(0, inicio)];
    return [...lista, lista[0]];
  });

  return (
    <section className="auth-tablero">
      <Link className="marca text-white" to="/">
        <span className="marca-icono text-dark">
          <i className="bi bi-airplane-fill"></i>
        </span>
        Planificador
      </Link>
      <h1>¿A dónde vas ahora?</h1>
      <table className="tablero" aria-label="Ejemplos de destinos">
        <tbody>
          {filas.map((lista, fila) => (
            <tr key={fila}>
              <td className="codigo">
                <span className="flap-codigo">
                  {[0, 1, 2].map((letra) => (
                    <span key={letra} className="flap-letra">
                      <span className="flap-cinta" style={{ animationDelay: `${fila * 0.25 + letra * 0.08}s` }}>
                        {lista.map((destino, i) => (
                          <span key={i}>{destino.codigo[letra]}</span>
                        ))}
                      </span>
                    </span>
                  ))}
                </span>
              </td>
              <td>
                <span className="flap-texto">
                  <span className="flap-cinta" style={{ animationDelay: `${fila * 0.25 + 0.3}s` }}>
                    {lista.map((destino, i) => (
                      <span key={i}>{destino.ciudad}</span>
                    ))}
                  </span>
                </span>
              </td>
              <td className="temp">
                <span className="flap-texto">
                  <span className="flap-cinta" style={{ animationDelay: `${fila * 0.25 + 0.4}s` }}>
                    {lista.map((destino, i) => (
                      <span key={i}><i className={destino.icono}></i> {destino.temp}°</span>
                    ))}
                  </span>
                </span>
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
