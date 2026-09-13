'use client';
import { useState } from 'react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // 1. CREATE: Crear escribiendo + Enter (sin botón)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }]);
      setInputValue('');
    }
  };

  // 2. READ & UPDATE (Tachar): El chulito solo tacha, no borra
  const toggleComplete = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  // 4. DELETE: Botón aparte que elimina por completo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 3. UPDATE (Editar): Autoguardado al salir del campo
  const updateTodoText = (id, newText) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, text: newText } : todo));
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2>TODO List - Práctica Grupal</h2>
      
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe una tarea y presiona Enter..."
        style={{ width: '100%', padding: '10px', marginBottom: '20px', fontSize: '16px' }}
      />

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            toggleComplete={toggleComplete} 
            deleteTodo={deleteTodo} 
            updateTodoText={updateTodoText} 
          />
        ))}
      </ul>
    </div>
  );
}

// Componente secundario para manejar el estado de edición por cada ítem
function TodoItem({ todo, toggleComplete, deleteTodo, updateTodoText }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleBlur = () => {
    updateTodoText(todo.id, editText);
    setIsEditing(false); // Autoguardado al salir del campo
  };

  return (
    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleComplete(todo.id)}
        style={{ marginRight: '15px', transform: 'scale(1.5)' }}
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur} // Se dispara al hacer clic fuera
          onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
          autoFocus
          style={{ flexGrow: 1, padding: '5px', fontSize: '16px' }}
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)} // Editar con clic sobre el ítem
          style={{
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? 'gray' : 'black',
            flexGrow: 1,
            cursor: 'pointer',
            fontSize: '16px'
          }}
          title="Haz clic para editar"
        >
          {todo.text}
        </span>
      )}
      
      <button 
        onClick={() => deleteTodo(todo.id)} 
        style={{ marginLeft: '15px', padding: '5px 10px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
      >
        Eliminar
      </button>
    </li>
  );
}