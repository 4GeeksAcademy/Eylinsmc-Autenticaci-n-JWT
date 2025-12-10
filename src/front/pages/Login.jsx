import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/";

export function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [Loading, setLoading] = useState(false);

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
      const resp = await fetch(`${API_URL}api/login`, {
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
        console.error("Respuesta no JSON /api/login:", text);
        throw new Error("Error de servidor. Revisa la URL del backend.");
      }

      if (!resp.ok) {
        throw new Error(data?.message || data?.msg || "Credenciales inválidas");
      }

      const token = data.token;
      if (!token) throw new Error("El servidor no devolvió un token.");

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userEmail", form.email);

      navigate("/private");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <h2>Iniciar sesión</h2>
      <p>Accede a tu Panel Seguro con las credenciales que registraste.</p>

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
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? (
                <i className="fa-regular fa-eye-slash"></i>
              ) : (
                <i className="fa-regular fa-eye"></i>
              )}
            </button>

          </div>
        </label>

        <div className="auth-links">
          <Link to="/reset-password">¿Olvidaste tu contraseña?</Link>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="btn" disabled={Loading}>
          {Loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </section>
  );
}

export default Login;
