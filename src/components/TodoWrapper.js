import React, { useState } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { EditTodoForm } from "./EditTodoForm";

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  const addTodo = (todo) => {
    setTodos([
      ...todos,
      { id: uuidv4(), task: todo, completed: false, isEditing: false },
    ]);
  }


  // const deleteTodo = (id) => setTodos(todos.filter((todo) => todo.id !== id));

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  const editTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  }

  const deleteTodo = async (id) => {
    try {
      const res = await fetch("http://localhost/save.php", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.status === "success") {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        alert("Todo deleted successfully!");
      } else {
        alert("Failed to delete todo.");
      }
    } catch (error) {
      console.error("Delete failed", error);
      alert("Something went wrong while deleting.");
    }
  };



  const moveUp = (id) => {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index === 0) return; // Already at the top
    const newTodos = [...todos];
    [newTodos[index - 1], newTodos[index]] = [newTodos[index], newTodos[index - 1]];
    setTodos(newTodos);
  };

  const moveDown = (id) => {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index === todos.length - 1) return;
    const newTodos = [...todos];
    [newTodos[index], newTodos[index + 1]] = [newTodos[index + 1], newTodos[index]];
    setTodos(newTodos);
  };


  const editTask = (task, id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
      )
    );
  };

  const handleSubmit = async () => {
    try {
       if (todos.length === 0) {
    alert("Please add at least one todo before submitting.");
    return; // Prevent the fetch call
  }
  
      const response = await fetch("http://localhost/save.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todos), // `todos` is your state
      });

      const result = await response.json();
      alert(result.message); // Show success message
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit todos");
    }
  };


  return (
    <div className="TodoWrapper">
      <h1>TO DO APP !</h1>
      <TodoForm addTodo={addTodo} />

      {todos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm editTodo={editTask} task={todo} />
        ) : (
          <Todo
            key={todo.id}
            task={todo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            moveDown={moveDown}
            moveUp={moveUp}
            toggleComplete={toggleComplete}
          />
        )
      )}

      <button className='submit-btn' onClick={handleSubmit}>Submit Todos</button>
    </div>
  );
};
