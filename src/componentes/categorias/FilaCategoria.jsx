import { useState } from "react";

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
          {!confirmando && (
            <>
              <button type="button" className="btn btn-sm btn-borde me-2" onClick={() => onEditar(categoria)} aria-label={`Editar ${categoria.nombre}`}>
                <i className="bi bi-pencil"></i>
              </button>
              <button type="button" className="btn btn-sm btn-peligro" onClick={() => setConfirmando(true)} aria-label={`Borrar ${categoria.nombre}`}>
                <i className="bi bi-trash"></i>
              </button>
            </>
          )}
          {confirmando && (
            <>
              <span className="me-2 small">¿Borrar?</span>
              <button type="button" className="btn btn-sm btn-peligro me-2" onClick={borrar} disabled={borrando}>
                {borrando ? "Borrando…" : "Sí, borrar"}
              </button>
              <button type="button" className="btn btn-sm btn-borde" onClick={() => setConfirmando(false)} disabled={borrando}>
                No
              </button>
            </>
          )}
        </td>
      )}
    </tr>
  );
};

export default FilaCategoria;
