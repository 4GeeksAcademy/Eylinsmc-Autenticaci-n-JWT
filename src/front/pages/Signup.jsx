import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/";

export function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const resp = await fetch(`${API_URL}api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const contentType = resp.headers.get("content-type") || "";
      let data = null;

      if (contentType.includes("application/json")) {
        data = await resp.json();
      } else {
        const text = await resp.text();
        console.error("Respuesta no JSON /api/signup:", text);
        throw new Error("Error de servidor: respuesta no JSON (revisa la URL).");
      }

      if (!resp.ok) {
        throw new Error(data?.message || data?.msg || "No se pudo crear el usuario");
      }

      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <h2>Crear cuenta</h2>
      <p>Usa un correo y una contraseña segura. Luego podrás acceder a tu zona privada.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Correo electrónico
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Creando..." : "Registrarme"}
        </button>
      </form>
    </section>
  );
}

export default Signup;
