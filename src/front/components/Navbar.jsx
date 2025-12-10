// src/front/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__brand">
          Mis Notas
        </Link>
      </div>

      <div className="navbar__right">
        {!token && (
          <>
            <Link to="/login" className="nav-link">
              Iniciar sesión
            </Link>
            <Link to="/signup" className="btn btn-small">
              Crear cuenta
            </Link>
          </>
        )}

        {token && (
          <>
            <Link to="/private" className="nav-link">
              Notas
            </Link>
            <button
              className="btn btn-small btn-ghost"
              type="button"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
