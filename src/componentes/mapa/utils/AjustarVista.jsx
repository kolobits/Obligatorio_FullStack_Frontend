import { useEffect } from "react";
import { useMap } from "react-leaflet";

const AjustarVista = ({ dias, diaSeleccionado }) => {

  const map = useMap();

  useEffect(() => {
    const visibles = diaSeleccionado === null ? dias : [dias[diaSeleccionado - 1]];
    const puntos = [];

    visibles.forEach(dia => {
      dia.lugares.forEach(lugar => puntos.push([lugar.latitude, lugar.longitude]));
    });

    if (puntos.length > 0) {
      map.flyToBounds(puntos, { padding: [40, 40], maxZoom: 15, duration: 0.8 });
    }
  }, [dias, diaSeleccionado, map]);

  return null;
};

export default AjustarVista;
