import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/";

export function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
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
    setMessage(null);
    setLoading(true);

    try {
      const resp = await fetch(`${API_URL}api/reset-password`, {
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
        console.error("Respuesta no JSON /api/reset-password:", text);
        throw new Error("Error de servidor. Revisa la URL del backend.");
      }

      if (!resp.ok) {
        throw new Error(data?.message || "No se pudo actualizar la contraseña");
      }

      setMessage(
        "La contraseña se actualizó correctamente. Ahora puedes iniciar sesión."
      );

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <h2>Restablecer contraseña</h2>
      <p>Ingresa tu correo y una nueva contraseña.</p>

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
          Nueva contraseña
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

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Actualizando..." : "Actualizar contraseña"}
        </button>
      </form>
    </section>
  );
}

export default ResetPassword;
