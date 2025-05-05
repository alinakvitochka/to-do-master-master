import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await fetch('https://api.example.com/tasks');
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
});

export const addTaskAsync = createAsyncThunk('tasks/addTaskAsync', async (task) => {
  const response = await fetch('https://api.example.com/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error('Не удалось добавить задачу');
  }
  return response.json();
});

export const updateTaskAsync = createAsyncThunk('tasks/updateTaskAsync', async ({ id, updates }) => {
  const response = await fetch(`https://api.example.com/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Не удалось обновить задачу');
  }
  return response.json();
});

export const deleteTaskAsync = createAsyncThunk('tasks/deleteTaskAsync', async (id) => {
  const response = await fetch(`https://api.example.com/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Не удалось удалить задачу');
  }
  return id;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addTask: (state, action) => {
      state.items.push({ id: Date.now(), text: action.payload, completed: false });
    },
    toggleTaskCompletion: (state, action) => {
      const task = state.items.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    deleteTask: (state, action) => {
      state.items = state.items.filter((task) => task.id !== action.payload);
    },
    editTask: (state, action) => {
      const task = state.items.find((task) => task.id === action.payload.id);
      if (task) {
        task.text = action.payload.newText;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTaskAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addTaskAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateTaskAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteTaskAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addTask, toggleTaskCompletion, deleteTask, editTask } = taskSlice.actions;

export const selectTasks = (state) => state.tasks.items;
export const selectTaskStatus = (state) => state.tasks.status;
export const selectTaskError = (state) => state.tasks.error;
export const selectCompletedTasks = createSelector(
  [selectTasks],
  (tasks) => tasks.filter((task) => task.completed)
);

export default taskSlice.reducer;