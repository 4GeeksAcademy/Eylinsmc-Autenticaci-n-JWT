import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/";

export function Private() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const email = sessionStorage.getItem("userEmail");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPrivate = async () => {
      try {
        const resp = await fetch(`${API_URL}api/private`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resp.ok) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("userEmail");
          navigate("/login");
          return;
        }

        const json = await resp.json();
        setData(json);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPrivate();
  }, [navigate]);

  return (
    <section className="private-page">
      <h2>Zona privada</h2>
      {email && <p className="subtitle">Sesión iniciada como: {email}</p>}

      <div className="private-content">
        <p>{data?.msg || "Autenticación válida ✅"}</p>
      </div>
    </section>
  );
}

export default Private;
