import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { guardarToken } from "../../store/slices/usuarioSlice";
import loginSchema from "./validations/loginSchema";
import { Link, useNavigate } from "react-router";
import BotonCargando from "../cargando/BotonCargando";

const FormLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorLogin, setErrorLogin] = useState("");

  const [cargando, setCargando] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    setCargando(true);
    fetch("https://obligatorio1-fullstack.vercel.app/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((r) => r.json())
      .then((datos) => {
        console.log(datos);
        if (datos.token) {
          localStorage.setItem("token", datos.token);
          dispatch(guardarToken(datos.token));
          setErrorLogin("");
          navigate("/dashboard");
        } else if (datos.message) {
          setCargando(false);
          setErrorLogin("El usuario o la contraseña no son correctos.");
        } else {
          setCargando(false);
          setErrorLogin(datos.error);
        }
      });
  };

  return (
    <section className="auth-form">
      <form noValidate>
        <h2 className="mb-1">Ingresá a tu cuenta</h2>
        <p className="text-secondary mb-4">Usá tu usuario y contraseña.</p>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Usuario
          </label>
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="username"
                autoComplete="username"
                className={
                  errors.username ? "form-control is-invalid" : "form-control"
                }
              />
            )}
          />
          {errors.username && (
            <div className="invalid-feedback">{errors.username.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <input
                {...field}
                type="password"
                id="password"
                autoComplete="current-password"
                className={
                  errors.password ? "form-control is-invalid" : "form-control"
                }
              />
            )}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </div>

        {errorLogin && (
          <div className="alert alert-danger" role="alert">
            {errorLogin}
          </div>
        )}

        <BotonCargando
          texto="Ingresar"
          textoCargando="Ingresando…"
          cargando={cargando}
          onClick={handleSubmit(onSubmit)}
          deshabilitado={!isValid}
          clases="w-100 mt-2"
        />
        <p className="mt-4 mb-0">
          ¿Todavía no tenés cuenta? <Link to="/registro">Creá una</Link>{" "}
        </p>
      </form>
    </section>
  );
};

export default FormLogin;
