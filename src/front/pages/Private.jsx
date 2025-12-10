import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/";

export function Private() {
  const navigate = useNavigate();
  const [apiMessage, setApiMessage] = useState("");
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const email = sessionStorage.getItem("userEmail");

  // Validar token con el backend y cargar notas desde localStorage
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const checkPrivate = async () => {
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

        const data = await resp.json();
        setApiMessage(data.msg || "Autenticación válida");
      } catch (err) {
        console.error(err);
      }
    };

    const stored = email
      ? window.localStorage.getItem(`notes_${email}`)
      : null;
    if (stored) {
      setNotes(JSON.parse(stored));
    }

    checkPrivate();
  }, [navigate, email]);

  const saveNotes = (updated) => {
    setNotes(updated);
    if (email) {
      window.localStorage.setItem(`notes_${email}`, JSON.stringify(updated));
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    const text = newNote.trim();
    if (!text) return;

    const newItem = {
      id: Date.now(),
      text,
      done: false,
    };

    saveNotes([newItem, ...notes]);
    setNewNote("");
  };

  const toggleDone = (id) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, done: !n.done } : n
    );
    saveNotes(updated);
  };

  const deleteNote = (id) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
  };

  return (
    <section className="private-page">
      <h2>Notas</h2>
      <div className="notes-container">
        <header>
          <h3>Mis notas y tareas</h3>
          <p>
            Este espacio es solo para ti. Agrega notas rápidas o tareas para
            recordar lo importante.
          </p>
        </header>

        <form className="note-form" onSubmit={handleAddNote}>
          <input
            type="text"
            placeholder="Escribe una nota o tarea..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <button type="submit" className="btn btn-small">
            Añadir
          </button>
        </form>

        <ul className="notes-list">
          {notes.length === 0 && (
            <li className="notes-empty">Aún no tienes notas. ¡Empieza arriba!</li>
          )}

          {notes.map((note) => (
            <li key={note.id} className={`note-item ${note.done ? "done" : ""}`}>
              <label>
                <input
                  type="checkbox"
                  checked={note.done}
                  onChange={() => toggleDone(note.id)}
                />
                <span>{note.text}</span>
              </label>
              <button
                type="button"
                className="btn-link"
                onClick={() => deleteNote(note.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Private;
