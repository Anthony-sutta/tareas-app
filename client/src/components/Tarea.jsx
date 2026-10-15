export default function Tarea({ tarea, onEliminar, onToggle }) {
  return (
    <li className={tarea.completada ? "tarea completada" : "tarea"}>
      <span onClick={onToggle} title="Clic para completar/descompletar">
        {tarea.titulo}
      </span>
      <button onClick={onEliminar} className="btn-eliminar" title="Eliminar">
        🗑️
      </button>
    </li>
  );
}
