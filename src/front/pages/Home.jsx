import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  const { isLoggedIn, email } = useMemo(() => {
    const token = sessionStorage.getItem("token");
    const userEmail = sessionStorage.getItem("userEmail");
    return {
      isLoggedIn: !!token,
      email: userEmail || null,
    };
  }, []);

  const goToPrivate = () => navigate("/private");
  const goToLogin = () => navigate("/login");
  const goToSignup = () => navigate("/signup");

  return (
    <section className="home-page">
      {!isLoggedIn ? (
        <div className="hero-card">
          <h1 className="hero-title">Bienvenido a tus Notas</h1>
          <p className="hero-text">
            Inicia sesión y comienza a escribir.
          </p>
          <p className="hero-text">
            Crea una cuenta y entra a tus notas para organizar lo que necesites.
          </p>

          <div className="hero-actions">
            <button className="btn btn-secondary" onClick={goToLogin}>
              Ya tengo cuenta
            </button>
            <button className="btn" onClick={goToSignup}>
              Crear una cuenta nueva
            </button>
          </div>
        </div>
      ) : (
        <div className="hero-card hero-card-logged">
          <h2 className="hero-title-small">
            Hola{email ? <span className="hero-email">, {email}</span> : ""} 
          </h2>

          <p className="hero-text">
            Tu sesión está activa y tus Notas están listas.
          </p>
          <p className="hero-text">
            Desde aquí puedes ir directamente a tus notas para gestionar lo que necesites.
          </p>

          <div className="hero-actions">
            <button className="btn" onClick={goToPrivate}>
              Ir a mis notas
            </button>

            <Link to="/login" className="btn-link-subtle">
              Cambiar de usuario
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

export default Home;

