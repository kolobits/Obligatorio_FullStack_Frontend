import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mostrarSpinner, ocultarSpinner } from "../../store/slices/spinnerSlice";
import ClimaPorDia from "./ClimaPorDia";
import MapaRecorrido from "../mapa/MapaRecorrido";

const Itinerario = ({ id }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const token = useSelector(state => state.usuario.token);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(mostrarSpinner("Mirando el clima y armando tu itinerario…"));

    fetch(`${API_BASE_URL}/v1/viajes/${id}/clima`, {
      headers: {
        'Authorization': token,
      }
    })
      .then(r => r.json())
      .then(datos => {
        console.log(datos);
        if (datos.itinerarioPorDia) {
          setPlan(datos);
        } else if (datos.message) {
          setError(datos.message);
        } else {
          setError(datos.error);
        }
      })
      .catch(() => setError("No se pudo conectar con el servidor."))
      .finally(() => dispatch(ocultarSpinner()))
  }, [id])

  const formatearDia = (fecha) => {
    return new Date(fecha)
      .toLocaleDateString("es-UY", { weekday: "long", day: "numeric", month: "short", timeZone: "UTC" })
      .replace(".", "");
  };

  const esBajoTecho = (tipo) => tipo === "entertainment.museum" || tipo === "entertainment.culture";

  const iconoLugar = (tipo) => {
    if (esBajoTecho(tipo)) return "bi bi-bank";
    if (tipo.startsWith("leisure")) return "bi bi-tree";
    if (tipo.startsWith("tourism")) return "bi bi-camera";
    return "bi bi-geo-alt";
  };

  if (error) {
    return (
      <div className="panel text-center py-5">
        <i className="bi bi-calendar-x fs-1"></i>
        <h2 className="mt-2">No hay itinerario para este viaje</h2>
        <p className="text-secondary mb-0">{error}</p>
      </div>
    );
  }

  if (plan === null) {
    return null;
  }

  const esPronostico = plan.tipo === "pronostico";
  const dias = plan.itinerarioPorDia;
  const hayLugares = dias.some(dia => dia.lugares.length > 0);
  const primerDia = formatearDia(dias[0].fecha).split(" ").slice(1).join(" ");
  const ultimoDia = formatearDia(dias[dias.length - 1].fecha).split(" ").slice(1).join(" ");

  return (
    <section>
      <div className="sugerencia">
        <div className={esPronostico ? "sello" : "sello sello-historico"} aria-hidden="true">
          <i className={esPronostico ? "bi bi-cloud-sun" : "bi bi-clock-history"}></i>
          <strong>{esPronostico ? "Pronóstico" : "Histórico"}</strong>
          <span>{primerDia} al {ultimoDia}</span>
        </div>
        <div>
          <p className="sugerencia-texto">
            {plan.recomendacion || "La sugerencia de la IA no está disponible ahora. El reparto de lugares por día ya tiene en cuenta el clima."}
          </p>
          <p className="sugerencia-fuente">
            {esPronostico
              ? "Sugerencia generada con IA a partir del pronóstico de Open-Meteo."
              : `Estimación a partir de ${plan.resumenHistorico.aniosAnalizados} años de historial, porque el viaje todavía está lejos para tener pronóstico.`}
          </p>
        </div>
      </div>

      <ClimaPorDia plan={plan} />
      {hayLugares && plan.destinoCoordenadas && (
        <MapaRecorrido dias={dias} centro={plan.destinoCoordenadas} recorridoTotal={plan.recorrido} />
      )}

      <div className="row g-4">
        <div className="col-lg-9">
          <ol className="list-unstyled panel py-2 mb-0">
            {dias.map((dia, i) => {
              return (
                <li key={dia.fecha} className={dia.lluvioso ? "dia dia-lluvioso" : "dia"}>
                  <div>
                    <div className="dia-numero">Día {i + 1}</div>
                    <div className="dia-fecha">{formatearDia(dia.fecha)}</div>
                    {dia.lluvioso && (
                      <div className="dia-clima">
                        <i className="bi bi-cloud-rain-heavy"></i> Día de lluvia
                      </div>
                    )}
                  </div>
                  <div className="lugares">
                    {dia.lugares.length === 0 && <span className="text-secondary">Día libre, sin lugares sugeridos.</span>}
                    {dia.lugares.map(lugar => (
                      <span key={lugar.nombre} className={esBajoTecho(lugar.tipo) ? "lugar lugar-techo" : "lugar"}>
                        <i className={iconoLugar(lugar.tipo)}></i> {lugar.nombre}
                      </span>
                    ))}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="col-lg-3">
          <div className="panel">
            {plan.recorrido ? (
              <>
                <p className="text-secondary mb-1">Recorrido total</p>
                <p className="titulo fs-2 mb-0">{plan.recorrido.distanciaKm.toLocaleString("es-UY")} km</p>
                <p className="mb-3">{plan.recorrido.duracionHoras.toLocaleString("es-UY")} h en auto</p>
              </>
            ) : (
              <p className="mb-3">Todavía no hay recorrido para calcular.</p>
            )}
            <p className="small text-secondary mb-0"><i className="bi bi-bank"></i> Borde oscuro: lugar bajo techo, para días de lluvia.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Itinerario;
