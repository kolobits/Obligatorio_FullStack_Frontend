import PanelTablero from "./PanelTablero";
import FormRegistro from "./FormRegistro";
import "./styles/auth.css";

const Registro = () => {
  return (
    <main className="auth">
      <PanelTablero />
      <FormRegistro />
    </main>
  );
};

export default Registro;
