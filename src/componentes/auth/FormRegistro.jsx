import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { guardarToken } from "../../store/slices/usuarioSlice";
import registroSchema from "./validations/registroSchema";
import { Link, useNavigate } from "react-router";
import BotonCargando from "../cargando/BotonCargando";

const FormRegistro = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorRegistro, setErrorRegistro] = useState("");
  const [cargando, setCargando] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(registroSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

  const ingresar = (username, password) => {
    let objLogin = {
      "username": username,
      "password": password
    }

    fetch("https://obligatorio1-fullstack.vercel.app/v1/auth/login", {
      method: 'POST',
      body: JSON.stringify(objLogin),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    })
      .then(r => r.json())
      .then(datos => {
        console.log(datos);
        localStorage.setItem("token", datos.token);
        dispatch(guardarToken(datos.token));
        navigate("/dashboard"); 
      })
  }

  const onSubmit = data => {
    setCargando(true);
    let objRegistro = {
      "name": data.name,
      "username": data.username,
      "email": data.email,
      "password": data.password
    }

    fetch("https://obligatorio1-fullstack.vercel.app/v1/auth/signup", {
      method: 'POST',
      body: JSON.stringify(objRegistro),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    })
      .then(r => r.json())
      .then(datos => {
        console.log(datos);
        if (datos.id) {
          setErrorRegistro("");
          ingresar(data.username, data.password);
          reset();
        } else if (datos.message) {
          setCargando(false);
          setErrorRegistro(datos.message);
        } else {
          setCargando(false);
          setErrorRegistro(datos.error);
        }
      })
  }

  return (
    <section className="auth-form">
      <form noValidate>
        <h2 className="mb-1">Creá tu cuenta</h2>
        <p className="text-secondary mb-3">Arrancás en el plan plus, con lugar para 4 viajes.</p>

        <div className="mb-2">
          <label htmlFor="name" className="form-label">Nombre</label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="name"
                className={errors.name ? "form-control is-invalid" : "form-control"}
              />
            )}
          />
          {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
        </div>

        <div className="mb-2">
          <label htmlFor="username" className="form-label">Usuario</label>
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="username"
                className={errors.username ? "form-control is-invalid" : "form-control"}
              />
            )}
          />
          {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
        </div>

        <div className="mb-2">
          <label htmlFor="email" className="form-label">Email</label>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <input
                {...field}
                type="email"
                id="email"
                className={errors.email ? "form-control is-invalid" : "form-control"}
              />
            )}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>

        <div className="mb-2">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <input
                {...field}
                type="password"
                id="password"
                className={errors.password ? "form-control is-invalid" : "form-control"}
              />
            )}
          />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>

        <div className="mb-2">
          <label htmlFor="confirmPassword" className="form-label">Repetir contraseña</label>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <input
                {...field}
                type="password"
                id="confirmPassword"
                className={errors.confirmPassword ? "form-control is-invalid" : "form-control"}
              />
            )}
          />
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
        </div>

        {errorRegistro && <div className="alert alert-danger" role="alert">{errorRegistro}</div>}
        <BotonCargando
          texto="Crear cuenta"
          textoCargando="Creando tu cuenta…"
          cargando={cargando}
          onClick={handleSubmit(onSubmit)}
          deshabilitado={!isValid}
          clases="w-100 mt-2"
        />
        <p className="mt-4 mb-0">¿Ya tenés cuenta? <Link to="/">Ingresá</Link></p>
      </form>
    </section>
  );
};

export default FormRegistro;