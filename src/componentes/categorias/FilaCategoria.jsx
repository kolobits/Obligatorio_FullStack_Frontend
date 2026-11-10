import { useState } from "react";
import ModalConfirmar from "../comunes/ModalConfirmar";

const FilaCategoria = ({ categoria, esAdmin, onEditar, onBorrar }) => {

  const [confirmando, setConfirmando] = useState(false);
  const [borrando, setBorrando] = useState(false);

  const borrar = () => {
    setBorrando(true);
    onBorrar(categoria).then(() => {
      setBorrando(false);
      setConfirmando(false);
    });
  };

  return (
    <tr>
      <td className="fw-semibold">{categoria.nombre}</td>
      <td className="text-secondary">{categoria.descripcion || "Sin descripción"}</td>
      {esAdmin && (
        <td className="text-end text-nowrap">
          <button type="button" className="btn btn-sm btn-borde me-2" onClick={() => onEditar(categoria)} aria-label={`Editar ${categoria.nombre}`}>
            <i className="bi bi-pencil"></i>
          </button>
          <button type="button" className="btn btn-sm btn-peligro" onClick={() => setConfirmando(true)} aria-label={`Borrar ${categoria.nombre}`}>
            <i className="bi bi-trash"></i>
          </button>

          <ModalConfirmar
            abierto={confirmando}
            titulo={`¿Borrar la categoría ${categoria.nombre}?`}
            mensaje="Si hay viajes que la usan, el sistema no va a dejar borrarla."
            textoConfirmar="Sí, borrar"
            textoCargando="Borrando…"
            cargando={borrando}
            peligro={true}
            onConfirmar={borrar}
            onCancelar={() => setConfirmando(false)}
          />
        </td>
      )}
    </tr>
  );
};

export default FilaCategoria;
