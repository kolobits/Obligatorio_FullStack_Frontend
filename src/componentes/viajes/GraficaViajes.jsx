import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "./styles/grafica.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const GraficaViajes = () => {

  const token = useSelector(state => state.usuario.token);
  const cantidad = useSelector(state => state.viajes.cantidad);
  const [viajes, setViajes] = useState([]);

  useEffect(() => {
    fetch("https://obligatorio1-fullstack.vercel.app/v1/viajes?limit=50", {
      headers: {
        'Authorization': token,
      }
    })
      .then(r => r.json())
      .then(datos => {
        console.log(datos);
        if (datos.data) {
          setViajes(datos.data);
        }
      })
  }, [cantidad])

  const estados = [
    { valor: "planificado", texto: "Planificados", color: "#2f5bea" },
    { valor: "en_curso", texto: "En curso", color: "#ffc82e" },
    { valor: "finalizado", texto: "Finalizados", color: "#6b7a90" },
    { valor: "cancelado", texto: "Cancelados", color: "#c93a32" },
  ];

  const cantidades = estados.map(estado => viajes.filter(viaje => viaje.estado === estado.valor).length);

  const data = {
    labels: estados.map(estado => estado.texto),
    datasets: [
      {
        label: "Viajes",
        data: cantidades,
        backgroundColor: estados.map(estado => estado.color),
        borderColor: "#ffffff",
        borderWidth: 3,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: {
        display: false,
      }
    }
  };

  return (
    <section className="panel grafica mb-4" aria-label="Viajes por estado">
      <div className="grafica-texto">
        <h2 className="mb-1">Tus viajes por estado</h2>
        <p className="text-secondary mb-3">Cómo vienen todos tus viajes, sin contar los filtros.</p>
        <ul className="grafica-leyenda">
          {estados.map((estado, i) => (
            <li key={estado.valor}>
              <span className="grafica-color" style={{ background: estado.color }}></span>
              {estado.texto}
              <strong>{cantidades[i]}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="grafica-dona">
        {viajes.length > 0 ? (
          <>
            <Doughnut options={options} data={data} />
            <div className="grafica-centro">
              <strong>{viajes.length}</strong>
              <span>{viajes.length === 1 ? "viaje" : "viajes"}</span>
            </div>
          </>
        ) : (
          <p className="text-secondary text-center mb-0">Cuando crees tu primer viaje, acá vas a ver cómo se reparten.</p>
        )}
      </div>
    </section>
  );
};

export default GraficaViajes;
