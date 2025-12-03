import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  
  
  const [formData, setFormData] = useState({
    title: "",        
    description: "",
    due_date: "",
  });

  // Ambil data saat aplikasi dibuka
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const result = await axios.get("http://localhost:3001/todos");
      setTodos(result.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  // Handle perubahan input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Tambah Tugas
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi input tidak boleh kosong
    if (!formData.title) return alert("Judul wajib diisi!");
    
    try {
      // 2. SAAT DIKIRIM, DATA SUDAH BERISI 'title'
      // axios akan mengirim: { title: "...", description: "...", due_date: "..." }
      await axios.post("http://localhost:3001/todos", formData);
      
      setFormData({ title: "", description: "", due_date: "" }); // Reset form
      loadTodos(); // Refresh list
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Gagal menyimpan data ke server.");
    }
  };

  // Hapus Tugas
  const handleDelete = async (id) => {
    if (window.confirm("Yakin mau hapus?")) {
      try {
        await axios.delete(`http://localhost:3001/todos/${id}`);
        loadTodos();
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  // Update Status (Selesai/Belum)
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "completed" ? "incomplete" : "completed";
      await axios.put(`http://localhost:3001/todos/status/${id}`, { status: newStatus });
      loadTodos();
    } catch (error) {
      console.error("Gagal update status:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="app-title">✨ My Todo List</h1>

      {/* Form Input */}
      <div className="card form-card">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            {/* Input Judul (name="title") */}
            <input
              type="text"
              name="title" 
              placeholder="Judul Tugas..."
              value={formData.title}
              onChange={handleChange}
              className="input-field"
            />
            {/* Input Tanggal */}
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="input-field date-input"
            />
          </div>
          {/* Input Deskripsi */}
          <textarea
            name="description"
            placeholder="Deskripsi tugas (opsional)..."
            value={formData.description}
            onChange={handleChange}
            className="input-field textarea-field"
          ></textarea>
          <button type="submit" className="btn-add">Tambah Tugas</button>
        </form>
      </div>

      {/* Daftar Tugas */}
      <div className="todo-list">
        {todos.map((todo) => (
          <div key={todo.id} className={`card todo-item ${todo.status}`}>
            <div className="todo-content">
              <h3>{todo.title}</h3>
              <p className="desc">{todo.description}</p>
              <div className="meta">
                <span className="date">📅 {todo.due_date ? todo.due_date.split('T')[0] : 'No Date'}</span>
                <span className={`status-badge ${todo.status}`}>
                  {todo.status === "completed" ? "Selesai" : "Belum Selesai"}
                </span>
              </div>
            </div>
            <div className="todo-actions">
              <button onClick={() => toggleStatus(todo.id, todo.status)} className="btn-check">
                {todo.status === "completed" ? "↩️" : "✅"}
              </button>
              <button onClick={() => handleDelete(todo.id)} className="btn-delete">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;