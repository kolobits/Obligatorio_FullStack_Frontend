import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "./styles/mapa.css";
import { iconoDelDia } from "./utils/iconoMarcador";
import { COLORES_DIAS } from "./utils/coloresDias";
import AjustarVista from "./utils/AjustarVista";

const MapaRecorrido = ({ dias, centro, recorridoTotal }) => {

  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  const diasConColor = dias.map((dia, i) => ({
    ...dia,
    numero: i + 1,
    color: COLORES_DIAS[i % COLORES_DIAS.length],
  }));

  const visibles = diaSeleccionado === null
    ? diasConColor
    : diasConColor.filter(dia => dia.numero === diaSeleccionado);

  const recorrido = diaSeleccionado === null ? recorridoTotal : visibles[0].recorrido;

  const esBajoTecho = (tipo) => tipo === "entertainment.museum" || tipo === "entertainment.culture";

  return (
    <div className="panel mapa-panel">
      <div className="mapa-cabecera">
        <h2 className="mapa-titulo">Recorrido en el mapa</h2>
        {recorrido && (
          <p className="mapa-resumen">
            {recorrido.distanciaKm.toLocaleString("es-UY")} km · {recorrido.duracionHoras.toLocaleString("es-UY")} h en auto
          </p>
        )}
      </div>

      <div className="mapa-dias">
        <button
          type="button"
          className={diaSeleccionado === null ? "mapa-dia activo" : "mapa-dia"}
          onClick={() => setDiaSeleccionado(null)}
        >
          Todo el viaje
        </button>
        {diasConColor.map(dia => (
          <button
            key={dia.fecha}
            type="button"
            className={diaSeleccionado === dia.numero ? "mapa-dia activo" : "mapa-dia"}
            onClick={() => setDiaSeleccionado(dia.numero)}
            disabled={dia.lugares.length === 0}
          >
            <span className="mapa-dia-color" style={{ background: dia.color }}></span>
            Día {dia.numero}
          </button>
        ))}
      </div>

      <MapContainer
        center={[centro.latitude, centro.longitude]}
        zoom={12}
        scrollWheelZoom={false}
        className="mapa-contenedor"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {visibles.map(dia => dia.recorrido && (
          <Polyline
            key={`ruta-${dia.fecha}`}
            positions={dia.recorrido.coordenadas.map(([lng, lat]) => [lat, lng])}
            pathOptions={{ color: dia.color, weight: 4, opacity: 0.85 }}
          />
        ))}

        {visibles.map(dia => dia.lugares.map(lugar => (
          <Marker
            key={`${dia.fecha}-${lugar.nombre}`}
            position={[lugar.latitude, lugar.longitude]}
            icon={iconoDelDia(dia.numero, dia.color)}
          >
            <Popup>
              <strong>{lugar.nombre}</strong>
              <br />
              Día {dia.numero}{esBajoTecho(lugar.tipo) ? " · bajo techo" : ""}
            </Popup>
          </Marker>
        )))}

        <AjustarVista dias={dias} diaSeleccionado={diaSeleccionado} />
      </MapContainer>
    </div>
  );
};

export default MapaRecorrido;
