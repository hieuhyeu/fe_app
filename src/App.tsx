
import { useState, useEffect } from 'react'
import './App.css'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

const getSampleTodos = (): Todo[] => [
  {
    id: '1',
    text: 'Hoàn thành báo cáo hàng tuần',
    completed: false,
    createdAt: new Date().toLocaleString('vi-VN'),
  },
  {
    id: '2',
    text: 'Họp với nhóm phát triển sản phẩm',
    completed: true,
    createdAt: new Date().toLocaleString('vi-VN'),
  },
  {
    id: '3',
    text: 'Review code từ các thành viên',
    completed: false,
    createdAt: new Date().toLocaleString('vi-VN'),
  },
  {
    id: '4',
    text: 'Cập nhật tài liệu dự án',
    completed: false,
    createdAt: new Date().toLocaleString('vi-VN'),
  },
  {
    id: '5',
    text: 'Gửi email feedback cho khách hàng',
    completed: false,
    createdAt: new Date().toLocaleString('vi-VN'),
  },
]

const initializeTodos = (): Todo[] => {
  const savedTodos = localStorage.getItem('todos')
  if (savedTodos) {
    try {
      return JSON.parse(savedTodos)
    } catch (error) {
      console.error('Failed to load todos:', error)
      return getSampleTodos()
    }
  }
  return getSampleTodos()
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(initializeTodos)
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (input.trim() === '') return

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
      createdAt: new Date().toLocaleString('vi-VN'),
    }

    setTodos([newTodo, ...todos])
    setInput('')
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>📝 Danh sách công việc</h1>
        <p className="subtitle">Quản lý công việc hàng ngày của bạn</p>
      </div>

      <div className="app-content">
        {/* Input Section */}
        <div className="input-section">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Thêm công việc mới..."
            className="todo-input"
          />
          <button onClick={addTodo} className="add-button">
            Thêm
          </button>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Tổng cộng</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">Đang làm</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Hoàn thành</span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="filter-section">
          <button
            onClick={() => setFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          >
            Đang làm
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          >
            Hoàn thành
          </button>
        </div>

        {/* Todo List */}
        <div className="todos-section">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <p className="empty-message">
                {todos.length === 0
                  ? '🎯 Chưa có công việc nào. Hãy thêm một cái!'
                  : '✨ Không có công việc nào phù hợp.'}
              </p>
            </div>
          ) : (
            <ul className="todo-list">
              {filteredTodos.map((todo) => (
                <li key={todo.id} className="todo-item">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="todo-checkbox"
                  />
                  <span
                    className={`todo-text ${
                      todo.completed ? 'completed' : ''
                    }`}
                  >
                    {todo.text}
                  </span>
                  <span className="todo-date">{todo.createdAt}</span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-button"
                    title="Xóa"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
