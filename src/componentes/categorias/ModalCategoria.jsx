import Modal from "react-modal";
import FormCategoria from "./FormCategoria";

Modal.setAppElement("#root");

const ModalCategoria = ({ abierto, onCerrar, categoria, onGuardar }) => {
  return (
    <Modal
      isOpen={abierto}
      onRequestClose={onCerrar}
      contentLabel={categoria ? "Editar categoría" : "Nueva categoría"}
      className="modal-contenido"
      overlayClassName="modal-fondo"
    >
      <FormCategoria categoria={categoria} onGuardar={onGuardar} onCancelar={onCerrar} />
    </Modal>
  );
};

export default ModalCategoria;
