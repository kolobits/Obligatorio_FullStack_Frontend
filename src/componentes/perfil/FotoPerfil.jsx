import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { guardarPerfil } from "../../store/slices/usuarioSlice";
import Avatar from "./Avatar";
import { AVION } from "../cargando/avion";
import "../cargando/styles/spinners.css";

const TAMANO_MAXIMO = 5 * 1024 * 1024;

const FotoPerfil = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const token = useSelector(state => state.usuario.token);
  const perfil = useSelector(state => state.usuario.perfil);
  const archivoRef = useRef(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const elegirArchivo = () => {
    archivoRef.current.click();
  };

  const subirFoto = (e) => {
    const archivo = e.target.files[0];
    e.target.value = "";

    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      setError("Elegí un archivo de imagen (JPG, PNG o WebP).");
      return;
    }

    if (archivo.size > TAMANO_MAXIMO) {
      setError("La imagen no puede superar los 5 MB.");
      return;
    }

    setError("");
    setCargando(true);

    const datos = new FormData();
    datos.append("imagen", archivo);
    datos.append("folder", "avatars");

    fetch(`${API_BASE_URL}/v1/uploads`, {
      method: "POST",
      headers: {
        'Authorization': token,
      },
      body: datos,
    })
      .then(r => r.json())
      .then(respuesta => {
        if (!respuesta.url) {
          throw new Error(respuesta.error || respuesta.message || "No se pudo subir la imagen.");
        }
        return fetch(`${API_BASE_URL}/v1/usuarios/avatar`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          body: JSON.stringify({ avatarUrl: respuesta.url }),
        });
      })
      .then(r => r.json())
      .then(usuario => {
        if (usuario.username) {
          dispatch(guardarPerfil(usuario));
        } else {
          setError(usuario.message || "No se pudo guardar la foto.");
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  };

  return (
    <section className="panel foto-perfil mb-5">
      <button
        type="button"
        className="foto-perfil-avatar"
        onClick={elegirArchivo}
        disabled={cargando}
        aria-label="Cambiar foto de perfil"
        title="Cambiar foto de perfil"
      >
        <Avatar perfil={perfil} tamano={88} />
        {cargando ? (
          <span className="foto-perfil-cargando">
            <span className="btn-cargando-avion" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d={AVION} /></svg>
            </span>
          </span>
        ) : (
          <span className="foto-perfil-camara"><i className="bi bi-camera-fill"></i></span>
        )}
      </button>
      <input ref={archivoRef} type="file" accept="image/*" hidden onChange={subirFoto} />

      <div>
        <h2 className="mb-1">{perfil && perfil.username}</h2>
        <p className="mb-2 text-secondary">Plan {perfil && perfil.perfil}</p>
        {error && <p className="text-danger small mb-0">{error}</p>}
        {!error && (
          <p className="small text-secondary mb-0">
            {cargando ? "Subiendo foto…" : "Tocá la foto para cambiarla. JPG, PNG o WebP, hasta 5 MB."}
          </p>
        )}
      </div>
    </section>
  );
};

export default FotoPerfil;
