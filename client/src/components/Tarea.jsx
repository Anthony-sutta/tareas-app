import { useEffect, useRef, useState } from "react";

export default function Tarea({ tarea, onEliminar, onToggle, onEditar }) {
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState(tarea.titulo);
  const temporizadorClick = useRef(null);
  const inputRef = useRef(null);
  const yaGuardo = useRef(false);

  // Enfocar y seleccionar el texto al entrar en modo edicion
  useEffect(() => {
    if (editando) {
      yaGuardo.current = false;
      setBorrador(tarea.titulo);
      inputRef.current?.focus();
      inputRef.current?.select();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editando]);

  function guardar() {
    if (yaGuardo.current) return; // evita doble PUT por Enter + blur
    yaGuardo.current = true;
    const limpio = borrador.trim();
    setEditando(false);
    if (limpio && limpio !== tarea.titulo) {
      onEditar(limpio); // App.jsx hace el PUT { titulo }
    }
  }

  function cancelar() {
    setBorrador(tarea.titulo);
    setEditando(false);
  }

  // Un clic = completar/descompletar, doble clic = editar.
  // Se usa un pequeno retardo para que el doble clic no dispare el toggle.
  function manejarClick() {
    if (temporizadorClick.current) return;
    temporizadorClick.current = setTimeout(() => {
      temporizadorClick.current = null;
      onToggle();
    }, 250);
  }

  function manejarDobleClick() {
    if (temporizadorClick.current) {
      clearTimeout(temporizadorClick.current);
      temporizadorClick.current = null;
    }
    setEditando(true);
  }

  useEffect(() => {
    return () => {
      if (temporizadorClick.current) clearTimeout(temporizadorClick.current);
    };
  }, []);

  return (
    <li className={tarea.completada ? "tarea completada" : "tarea"}>
      {editando ? (
        <input
          ref={inputRef}
          className="input-editar"
          value={borrador}
          onChange={(e) => setBorrador(e.target.value)}
          onBlur={guardar}
          onKeyDown={(e) => {
            if (e.key === "Enter") guardar();
            if (e.key === "Escape") cancelar();
          }}
        />
      ) : (
        <span
          onClick={manejarClick}
          onDoubleClick={manejarDobleClick}
          title="Clic para completar/descompletar, doble clic para editar"
        >
          {tarea.titulo}
        </span>
      )}
      <button onClick={onEliminar} className="btn-eliminar" title="Eliminar">
        🗑️
      </button>
    </li>
  );
}
