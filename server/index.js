const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Datos en memoria (luego los cambias por una base de datos)
let tareas = [
  { id: 1, titulo: "Aprender React", completada: false },
  { id: 2, titulo: "Conectar con Node.js", completada: false },
];
let siguienteId = 3;

// GET - Obtener todas las tareas
app.get("/api/tareas", (req, res) => {
  res.json(tareas);
});

// POST - Crear una tarea
app.post("/api/tareas", (req, res) => {
  const { titulo } = req.body;
  if (!titulo || !titulo.trim()) {
    return res.status(400).json({ error: "El titulo es obligatorio" });
  }
  const nueva = { id: siguienteId++, titulo: titulo.trim(), completada: false };
  tareas.push(nueva);
  res.status(201).json(nueva);
});

// PUT - Marcar/desmarcar como completada y/o editar el titulo
app.put("/api/tareas/:id", (req, res) => {
  const tarea = tareas.find((t) => t.id === Number(req.params.id));
  if (!tarea) return res.status(404).json({ error: "Tarea no encontrada" });

  // Reto Oro: permitir editar el titulo con PUT { titulo: "nuevo" }
  if (req.body.titulo !== undefined) {
    if (typeof req.body.titulo !== "string" || !req.body.titulo.trim()) {
      return res.status(400).json({ error: "El titulo no puede estar vacio" });
    }
    tarea.titulo = req.body.titulo.trim();
  }

  // Completada: si viene en el body se usa, si no viene Y tampoco viene
  // titulo, se mantiene el comportamiento original de alternar (toggle).
  if (typeof req.body.completada === "boolean") {
    tarea.completada = req.body.completada;
  } else if (req.body.titulo === undefined) {
    tarea.completada = !tarea.completada;
  }

  res.json(tarea);
});

// DELETE - Eliminar una tarea
app.delete("/api/tareas/:id", (req, res) => {
  const existe = tareas.some((t) => t.id === Number(req.params.id));
  if (!existe) return res.status(404).json({ error: "Tarea no encontrada" });
  tareas = tareas.filter((t) => t.id !== Number(req.params.id));
  res.status(204).send();
});

app.listen(3001, () => {
  console.log("API corriendo en http://localhost:3001");
});
