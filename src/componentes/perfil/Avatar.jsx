import "./styles/avatar.css";

const Avatar = ({ perfil, tamano }) => {

  const medidas = { width: `${tamano}px`, height: `${tamano}px` };

  if (perfil && perfil.avatarUrl) {
    const recortada = perfil.avatarUrl.replace("/upload/", `/upload/c_fill,g_face,w_${tamano * 2},h_${tamano * 2}/`);
    return <img src={recortada} alt="" className="avatar" style={medidas} />;
  }

  const inicial = perfil && perfil.username ? perfil.username[0].toUpperCase() : "";

  return (
    <span className="avatar avatar-inicial" style={{ ...medidas, fontSize: `${tamano * 0.42}px` }}>
      {inicial}
    </span>
  );
};

export default Avatar;
