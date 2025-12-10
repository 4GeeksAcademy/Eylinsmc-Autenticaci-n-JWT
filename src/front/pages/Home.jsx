import { Link } from "react-router-dom";

export function Home() {
  return (
    <section className="home">
      <div>
        <h1>Welcome!</h1>
        <p>
          Un espacio privado para organizar tus notas y tareas importantes.
        </p>
        <p>
          Crea tu cuenta, inicia sesión y accede a una zona solo para usuarios
          autenticados.
        </p>
      </div>

      <div className="home__actions">
        <Link to="/login" className="btn">
          Ya tengo cuenta
        </Link>
        <Link to="/signup" className="btn btn-ghost">
          Crear una cuenta nueva
        </Link>
      </div>
    </section>
  );
}
