import Modal from "react-modal";
import BotonCargando from "../cargando/BotonCargando";
import "./styles/modal.css";

Modal.setAppElement("#root");

const ModalConfirmar = ({ abierto, titulo, mensaje, textoConfirmar, textoCargando, cargando, peligro, onConfirmar, onCancelar }) => {
  return (
    <Modal
      isOpen={abierto}
      onRequestClose={cargando ? undefined : onCancelar}
      contentLabel={titulo}
      className="modal-contenido modal-confirmar"
      overlayClassName="modal-fondo"
    >
      <div className={peligro ? "modal-confirmar-icono peligro" : "modal-confirmar-icono"} aria-hidden="true">
        <i className={peligro ? "bi bi-trash" : "bi bi-stars"}></i>
      </div>
      <h2 className="modal-titulo">{titulo}</h2>
      <p>{mensaje}</p>
      <div className="acciones">
        <button type="button" className="btn btn-borde" onClick={onCancelar} disabled={cargando}>
          Cancelar
        </button>
        <BotonCargando
          texto={textoConfirmar}
          textoCargando={textoCargando}
          cargando={cargando}
          onClick={onConfirmar}
          variante={peligro ? "btn-peligro" : "btn-senal"}
        />
      </div>
    </Modal>
  );
};

export default ModalConfirmar;
