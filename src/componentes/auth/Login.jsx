import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import PanelTablero from './PanelTablero';
import FormLogin from './FormLogin';
import "./styles/auth.css";

const Login = () => {

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      navigate("/dashboard");
    }
  }, [])

  return (
    <main className="auth">
      <PanelTablero />
      <FormLogin />
    </main>
  );
};

export default Login;