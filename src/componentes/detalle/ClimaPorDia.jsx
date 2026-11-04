const ClimaPorDia = ({ plan }) => {

  const partesFecha = (fecha) => {
    const d = new Date(fecha);
    const dia = d.toLocaleDateString("es-UY", { weekday: "short", timeZone: "UTC" }).replace(".", "");
    const fechaCorta = d.toLocaleDateString("es-UY", { day: "numeric", month: "short", timeZone: "UTC" }).replace(".", "");
    return [dia, fechaCorta];
  };

  const climaDe = (codigo) => {
    if (codigo === 0) return { icono: "bi bi-sun-fill", animacion: "sol", texto: "Despejado" };
    if (codigo <= 3) return { icono: "bi bi-cloud-sun-fill", animacion: "nube", texto: "Parcialmente nublado" };
    if (codigo <= 48) return { icono: "bi bi-cloud-fog2-fill", animacion: "nube", texto: "Niebla" };
    if (codigo <= 67 || (codigo >= 80 && codigo <= 82)) return { icono: "bi bi-cloud-rain-heavy-fill", animacion: "lluvia", texto: "Lluvia" };
    if (codigo <= 77) return { icono: "bi bi-cloud-snow-fill", animacion: "lluvia", texto: "Nieve" };
    return { icono: "bi bi-cloud-lightning-rain-fill", animacion: "lluvia", texto: "Tormenta" };
  };

  if (plan.tipo !== "pronostico") {
    const h = plan.resumenHistorico;
    return (
      <div className="clima-historico">
        <div className="clima-tarjeta" style={{ animationDelay: "0s" }}>
          <span className="clima-etiqueta">Máxima promedio</span>
          <i className="bi bi-thermometer-sun clima-icono clima-sol"></i>
          <strong className="clima-temp">{Math.round(h.temperaturaMaximaPromedio)}°</strong>
        </div>
        <div className="clima-tarjeta" style={{ animationDelay: "0.1s" }}>
          <span className="clima-etiqueta">Mínima promedio</span>
          <i className="bi bi-thermometer-snow clima-icono clima-nube"></i>
          <strong className="clima-temp">{Math.round(h.temperaturaMinimaPromedio)}°</strong>
        </div>
        <div className="clima-tarjeta" style={{ animationDelay: "0.2s" }}>
          <span className="clima-etiqueta">Días con lluvia</span>
          <i className="bi bi-umbrella-fill clima-icono clima-lluvia"></i>
          <strong className="clima-temp">{h.probabilidadDeLluvia}%</strong>
        </div>
      </div>
    );
  }

  const p = plan.pronostico;

  return (
    <div className="clima-dias">
      {p.time.map((fecha, i) => {
        const clima = climaDe(p.weathercode[i]);
        const lluvia = p.precipitation_sum[i];
        const [dia, fechaCorta] = partesFecha(fecha);
        return (
          <div
            key={fecha}
            className={lluvia >= 1 ? "clima-tarjeta clima-lluviosa" : "clima-tarjeta"}
            style={{ animationDelay: `${i * 0.09}s` }}
          >
            <span className="clima-etiqueta">Día {i + 1} · {dia}</span>
            <span className="clima-fecha">{fechaCorta}</span>
            <i className={`${clima.icono} clima-icono clima-${clima.animacion}`} title={clima.texto}></i>
            <strong className="clima-temp">
              {Math.round(p.temperature_2m_max[i])}°<small>/ {Math.round(p.temperature_2m_min[i])}°</small>
            </strong>
            <span className="clima-lluvia-mm">
              <i className="bi bi-droplet-fill"></i> {lluvia >= 1 ? `${Math.round(lluvia)} mm` : "Sin lluvia"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ClimaPorDia;
