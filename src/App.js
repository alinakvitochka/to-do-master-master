import React, { useState, useEffect } from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, addTaskAsync, updateTaskAsync, deleteTaskAsync } from './reducers/taskReducer';
import { selectTasks, selectTaskStatus, selectTaskError } from './reducers/taskReducer';
import { login, logout, selectAuthUser, selectAuthStatus, selectAuthError } from './reducers/authReducer';

const Auth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = () => {
    dispatch(login(credentials));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Вы вошли как: {user.username}</p>
          <button onClick={handleLogout} disabled={status === 'loading'}>
            {status === 'loading' ? 'Выход...' : 'Выйти'}
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          <button onClick={handleLogin} disabled={status === 'loading'}>
            {status === 'loading' ? 'Вход...' : 'Войти'}
          </button>
          {status === 'failed' && <p>Ошибка: {error}</p>}
        </div>
      )}
    </div>
  );
};

const AddTask = () => {
  const [task, setTask] = useState('');
  const dispatch = useDispatch();
  const status = useSelector(selectTaskStatus);
  const error = useSelector(selectTaskError);

  const handleSubmit = () => {
    if (task.trim() !== '') {
      dispatch(addTaskAsync({ text: task, completed: false }));
      setTask('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Новая задача"
      />
      <button onClick={handleSubmit} disabled={status === 'loading'}>
        {status === 'loading' ? 'Добавление...' : 'Добавить'}
      </button>
      {status === 'failed' && <p>Ошибка: {error}</p>}
    </div>
  );
};

const TaskList = () => {
  const tasks = useSelector(selectTasks);
  const status = useSelector(selectTaskStatus);
  const error = useSelector(selectTaskError);
  const dispatch = useDispatch();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newText, setNewText] = useState('');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setNewText(task.text);
  };

  const handleSave = (id) => {
    if (newText.trim() !== '') {
      dispatch(updateTaskAsync({ id, updates: { text: newText } }));
      setEditingTaskId(null);
      setNewText('');
    }
  };

  if (status === 'loading') {
    return <p>Загрузка задач...</p>;
  }

  if (status === 'failed') {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <ul>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            {editingTaskId === task.id ? (
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
              />
            ) : (
              <span>{task.text}</span>
            )}
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => dispatch(updateTaskAsync({ id: task.id, updates: { completed: !task.completed } }))}
            />
            {editingTaskId === task.id ? (
              <button onClick={() => handleSave(task.id)}>Сохранить</button>
            ) : (
              <button onClick={() => handleEdit(task)}>Редактировать</button>
            )}
            <button onClick={() => dispatch(deleteTaskAsync(task.id))}>Удалить</button>
          </li>
        ))
      ) : (
        <p>Список задач пуст</p>
      )}
    </ul>
  );
};

const App = () => {
  return (
    <div className="App">
      <h1>To-Do List</h1>
      <Auth />
      <AddTask />
      <TaskList />
    </div>
  );
};

export default App;
