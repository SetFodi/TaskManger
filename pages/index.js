import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTrash, FaPlus, FaSun, FaMoon, FaHourglassHalf } from 'react-icons/fa';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('low'); // New Priority Feature
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDarkMode = localStorage.getItem("darkMode") === "true";
      setDarkMode(storedDarkMode);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", newMode);
      }
      return newMode;
    });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('/api/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (!title) {
      toast.error("Task cannot be empty!");
      return;
    }
    try {
      const { data } = await axios.post('/api/tasks', { title, priority }); // ✅ Send priority to API
      setTasks([...tasks, data]);
      setTitle('');
      toast.success("Task added!");
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  
  const toggleTask = async (id, completed) => {
    try {
      const updatedTask = await axios.put(`/api/tasks/${id}`, { completed: !completed });
      
      // ✅ Ensure the updated task is placed in the correct category
      setTasks(tasks.map(task => (task._id === id ? updatedTask.data : task)));
  
      // ✅ Refresh the filter so it updates correctly
      fetchTasks();
  
      toast.success(completed ? "Task moved to Pending!" : "Task marked as Completed!");
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  
  

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      toast.error("Task deleted!");
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed === true;
    if (filter === 'pending') return task.completed === false;
    return true; // "All" category
  });
  

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen flex items-center justify-center p-6 transition-all`}>
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6 relative">
        <Toaster />

        {/* Dark Mode Toggle */}
        <button onClick={toggleDarkMode} className="absolute top-4 right-4 text-xl">
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-500" />}
        </button>

        <h1 className="text-3xl font-bold text-center mb-6">📝 Task Manager</h1>

        {/* Task Input */}
        <div className="flex mb-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-600 rounded-l bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-r" onClick={addTask}>
            <FaPlus />
          </button>
        </div>

        {/* Priority Selection */}
        <div className="mb-4">
          <label className="text-sm font-semibold">Priority:</label>
          <select
            className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center space-x-3 mb-4">
          <button className={`px-4 py-1 rounded ${filter === 'all' ? 'bg-blue-500' : 'bg-gray-700'}`} onClick={() => setFilter('all')}>All</button>
          <button className={`px-4 py-1 rounded ${filter === 'completed' ? 'bg-green-500' : 'bg-gray-700'}`} onClick={() => setFilter('completed')}>Completed</button>
          <button className={`px-4 py-1 rounded ${filter === 'pending' ? 'bg-yellow-500' : 'bg-gray-700'}`} onClick={() => setFilter('pending')}>Pending</button>
        </div>

        {/* Task List */}
        <ul className="space-y-3">
  {filteredTasks.length === 0 ? (
    <p className="text-center text-gray-400">No tasks found in this category.</p>
  ) : (
    filteredTasks.map(task => (
      <motion.li
        key={task._id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center p-3 bg-gray-700 rounded-lg shadow-md"
      >
        {/* Task Title & Priority */}
        <div className="flex-1">
          <span className={`cursor-pointer ${task.completed ? 'line-through text-gray-400' : ''}`} onClick={() => toggleTask(task._id, task.completed)}>
            {task.title} 
          </span>
          <span className="text-sm ml-2">
            {task.priority === "high" ? "🔴" : task.priority === "medium" ? "🟡" : "🟢"}
          </span>
        </div>

        {/* Task Actions */}
        <div className="flex space-x-2">
          {!task.completed ? (
            <button className="text-green-400 hover:text-green-600" onClick={() => toggleTask(task._id, task.completed)}>
              <FaCheckCircle />
            </button>
          ) : (
            <button className="text-yellow-400 hover:text-yellow-600" onClick={() => toggleTask(task._id, task.completed)}>
              <FaHourglassHalf />
            </button>
          )}
          <button className="text-red-500 hover:text-red-700" onClick={() => deleteTask(task._id)}>
            <FaTrash />
          </button>
        </div>
      </motion.li>
    ))
  )}
</ul>

      </div>
    </div>
  );
}
