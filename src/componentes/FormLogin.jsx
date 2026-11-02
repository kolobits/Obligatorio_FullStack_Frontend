import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { guardarToken } from "../store/slices/usuarioSlice";
import loginSchema from "./validations/loginSchema";

const FormLogin = () => {

  const dispatch = useDispatch();
  const [errorLogin, setErrorLogin] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: ""
    }
  })

  const onSubmit = data => {
    fetch("https://obligatorio1-fullstack.vercel.app/v1/auth/login", {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    })
      .then(r => r.json())
      .then(datos => {
        console.log(datos);
        if (datos.token) {
          localStorage.setItem("token", datos.token);
          dispatch(guardarToken(datos.token));
          setErrorLogin("");
        } else if (datos.message) {
          setErrorLogin("El usuario o la contraseña no son correctos.");
        } else {
          setErrorLogin(datos.error);
        }
      })
  }

  return (
    <section className="auth-form">
      <form noValidate>
        <h2 className="mb-1">Ingresá a tu cuenta</h2>
        <p className="text-secondary mb-4">Usá tu usuario y contraseña.</p>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">Usuario</label>
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="username"
                autoComplete="username"
                className={errors.username ? "form-control is-invalid" : "form-control"}
              />
            )}
          />
          {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <input
                {...field}
                type="password"
                id="password"
                autoComplete="current-password"
                className={errors.password ? "form-control is-invalid" : "form-control"}
              />
            )}
          />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>

        {errorLogin && <div className="alert alert-danger" role="alert">{errorLogin}</div>}

        <button
          type="button"
          className="btn btn-senal w-100 mt-2"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}>
          Ingresar
        </button>
        <p className="mt-4 mb-0">¿Todavía no tenés cuenta? <a href="#">Creá una</a></p>
      </form>
    </section>
  );
};

export default FormLogin;