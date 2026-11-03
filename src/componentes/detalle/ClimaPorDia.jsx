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
    const gotas = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const diasConLluvia = Math.round(h.probabilidadDeLluvia / 10);

    return (
      <div className="panel clima-historico">
        <div>
          <p className="clima-rotulo">Temperatura habitual</p>
          <p className="clima-rango">
            <span>{Math.round(h.temperaturaMinimaPromedio)}°</span>
            <span className="clima-rango-linea"></span>
            <span>{Math.round(h.temperaturaMaximaPromedio)}°</span>
          </p>
        </div>
        <div>
          <p className="clima-rotulo">Llueve {h.probabilidadDeLluvia}% de los días</p>
          <div className="clima-gotas" aria-hidden="true">
            {gotas.map(i => (
              <i key={i} className={i < diasConLluvia ? "bi bi-droplet-fill" : "bi bi-droplet"}></i>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const p = plan.pronostico;
  const maximaDelViaje = Math.max(...p.temperature_2m_max);
  const minimaDelViaje = Math.min(...p.temperature_2m_min);
  const rango = maximaDelViaje - minimaDelViaje || 1;

  return (
    <div className="panel clima-panel">
      <div className="clima-dias" style={{ gridTemplateColumns: `repeat(${p.time.length}, minmax(64px, 1fr))` }}>
        {p.time.map((fecha, i) => {
          const clima = climaDe(p.weathercode[i]);
          const max = p.temperature_2m_max[i];
          const min = p.temperature_2m_min[i];
          const lluvia = p.precipitation_sum[i];
          const [dia, fechaCorta] = partesFecha(fecha);
          const arriba = ((maximaDelViaje - max) / rango) * 100;
          const alto = Math.max(((max - min) / rango) * 100, 6);

          return (
            <div key={fecha} className={lluvia >= 1 ? "clima-dia clima-dia-lluvia" : "clima-dia"}>
              <span className="clima-dia-nombre">{dia}</span>
              <span className="clima-dia-fecha">{fechaCorta}</span>
              <i className={`${clima.icono} clima-icono clima-${clima.animacion}`} title={clima.texto}></i>
              <span className="clima-max">{Math.round(max)}°</span>
              <div className="clima-pista">
                <div
                  className="clima-barra"
                  style={{ top: `${arriba}%`, height: `${alto}%`, animationDelay: `${i * 0.06}s` }}
                ></div>
              </div>
              <span className="clima-min">{Math.round(min)}°</span>
              <span className="clima-mm">
                {lluvia >= 1 ? <><i className="bi bi-droplet-fill"></i> {Math.round(lluvia)} mm</> : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClimaPorDia;
