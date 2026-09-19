'use client';
import { useState } from 'react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('todas');

  // 1. CREATE: Crear escribiendo + Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setTodos([{ id: Date.now(), text: inputValue, completed: false }, ...todos]);
      setInputValue('');
    }
  };

  // 2. READ & UPDATE: El chulito tacha
  const toggleComplete = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  // 4. DELETE: Elimina por completo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 3. UPDATE: Autoguardado al salir del campo
  const updateTodoText = (id, newText) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, text: newText } : todo));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'pendientes') return !todo.completed;
    if (filter === 'completadas') return todo.completed;
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d1117', padding: '50px 20px', fontFamily: 'monospace', color: '#c9d1d9' }}>
      
      <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
        
        {/* Encabezado estilo Terminal */}
        <div style={{ borderBottom: '1px solid #30363d', paddingBottom: '20px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ margin: 0, color: '#58a6ff', fontSize: '24px', letterSpacing: '1px' }}>~/gestor_tareas_grupal</h1>
            <p style={{ margin: '8px 0 0 0', color: '#8b949e', fontSize: '14px' }}>Estado: En ejecución...</p>
          </div>
          <span style={{ backgroundColor: '#238636', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
            {todos.filter(t => !t.completed).length} Pendientes
          </span>
        </div>

        {/* Input de consola */}
        <div style={{ position: 'relative', marginBottom: '25px' }}>
          <span style={{ position: 'absolute', left: '15px', top: '16px', color: '#58a6ff', fontSize: '16px', fontWeight: 'bold' }}>&gt;</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un comando o tarea nueva..."
            style={{ width: '100%', padding: '15px 20px 15px 40px', backgroundColor: '#010409', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', fontSize: '15px', outline: 'none', fontFamily: 'monospace' }}
          />
        </div>

        {/* Botones de filtro minimalistas */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
          {['todas', 'pendientes', 'completadas'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: 'none', border: 'none', color: filter === f ? '#58a6ff' : '#8b949e', borderBottom: filter === f ? '2px solid #58a6ff' : '2px solid transparent', padding: '5px 10px', cursor: 'pointer', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.2s'
              }}
            >
              [{f}]
            </button>
          ))}
        </div>

        {/* Lista de Tareas */}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, minHeight: '200px' }}>
          {filteredTodos.length === 0 ? (
            <div style={{ color: '#484f58', marginTop: '40px', fontStyle: 'italic' }}>// No hay registros en esta categoría.</div>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} toggleComplete={toggleComplete} deleteTodo={deleteTodo} updateTodoText={updateTodoText} />
            ))
          )}
        </ul>

      </div>
    </div>
  );
}

// Componente secundario
function TodoItem({ todo, toggleComplete, deleteTodo, updateTodoText }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleBlur = () => {
    if(editText.trim() !== '') {
      updateTodoText(todo.id, editText);
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  return (
    <li style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0d1117', padding: '12px 15px', border: '1px solid #30363d', borderLeft: `3px solid ${todo.completed ? '#238636' : '#58a6ff'}`, borderRadius: '6px', marginBottom: '10px' }}>
      
      {/* Checkbox cuadrado */}
      <button 
        onClick={() => toggleComplete(todo.id)}
        style={{ width: '20px', height: '20px', backgroundColor: todo.completed ? '#238636' : 'transparent', border: `1px solid ${todo.completed ? '#238636' : '#8b949e'}`, borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginRight: '15px', flexShrink: 0 }}
      >
        {todo.completed && <span style={{ color: 'white', fontSize: '14px' }}>✓</span>}
      </button>
      
      {/* Texto o Input */}
      <div style={{ flexGrow: 1 }}>
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            autoFocus
            style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #58a6ff', color: '#c9d1d9', fontSize: '15px', outline: 'none', fontFamily: 'monospace' }}
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            style={{ fontSize: '15px', color: todo.completed ? '#8b949e' : '#c9d1d9', textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'text' }}
          >
            {todo.text}
          </span>
        )}
      </div>
      
      {/* Botón Eliminar rojo minimalista */}
      <button 
        onClick={() => deleteTodo(todo.id)} 
        style={{ background: 'transparent', border: '1px solid #f85149', color: '#f85149', borderRadius: '4px', cursor: 'pointer', padding: '4px 8px', marginLeft: '10px', fontSize: '12px', fontWeight: 'bold' }}
        title="Borrar"
      >
        X
      </button>

    </li>
  );
}