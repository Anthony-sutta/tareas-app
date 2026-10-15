import { useEffect, useState } from "react";
import Formulario from "./components/Formulario.jsx";
import ListaTareas from "./components/ListaTareas.jsx";

const API = "https://tareas-api-9wce.onrender.com/api/tareas";

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  // Cargar tareas al montar el componente
  useEffect(() => {
    cargarTareas();
  }, []);

  async function cargarTareas() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("No se pudieron cargar las tareas");
      setTareas(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function agregarTarea(titulo) {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo }),
    });
    const nueva = await res.json();
    setTareas([...tareas, nueva]);
  }

  async function eliminarTarea(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setTareas(tareas.filter((t) => t.id !== id));
  }

  async function toggleTarea(id) {
    const tarea = tareas.find((t) => t.id === id);
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completada: !tarea.completada }),
    });
    const actualizada = await res.json();
    setTareas(tareas.map((t) => (t.id === id ? actualizada : t)));
  }

  // 🥈 Reto Plata: borrar solo las finalizadas con varias peticiones DELETE seguidas
  async function eliminarCompletadas() {
    const ids = tareas.filter((t) => t.completada).map((t) => t.id);
    if (ids.length === 0 || eliminando) return;
    setEliminando(true);
    try {
      // Una peticion DELETE por cada tarea completada, una despues de otra
      for (const id of ids) {
        await fetch(`${API}/${id}`, { method: "DELETE" });
      }
      setTareas(tareas.filter((t) => !t.completada));
    } finally {
      setEliminando(false);
    }
  }

  // 🥇 Reto Oro: guardar el titulo editado con peticion PUT
  async function editarTarea(id, titulo) {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo }),
    });
    if (!res.ok) return;
    const actualizada = await res.json();
    setTareas(tareas.map((t) => (t.id === id ? actualizada : t)));
  }

  if (cargando) return <p className="estado">Cargando...</p>;
  if (error) return <p className="estado">❌ {error}</p>;

  // 🥉 Reto Bronce: contador de completadas
  const completadas = tareas.filter((t) => t.completada).length;

  return (
    <main className="contenedor">
      <h1>✅ Mis tareas</h1>
      <Formulario onAgregar={agregarTarea} />
      <p className="contador">
        {completadas} de {tareas.length} tareas completadas
      </p>
      {completadas > 0 && (
        <button
          className="btn-limpiar"
          onClick={eliminarCompletadas}
          disabled={eliminando}
        >
          {eliminando ? "Eliminando..." : `Eliminar completadas (${completadas})`}
        </button>
      )}
      <ListaTareas
        tareas={tareas}
        onEliminar={eliminarTarea}
        onToggle={toggleTarea}
        onEditar={editarTarea}
      />
    </main>
  );
}
