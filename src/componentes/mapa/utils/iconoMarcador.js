import L from "leaflet";

export const iconoDelDia = (numero, color) => L.divIcon({
  className: "marcador-dia",
  html: `<span style="background:${color}"><b>${numero}</b></span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 34],
  popupAnchor: [0, -30],
});
