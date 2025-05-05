import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронна дія для додавання користувача
export const addUserAsync = createAsyncThunk('users/addUserAsync', async (user) => {
  const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error('Не вдалося додати користувача');
  }
  return response.json();
});

// Асинхронна дія для оновлення користувача
export const updateUserAsync = createAsyncThunk('users/updateUserAsync', async ({ id, updates }) => {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Не вдалося оновити користувача');
  }
  return response.json();
});

// Асинхронна дія для видалення користувача
export const deleteUserAsync = createAsyncThunk('users/deleteUserAsync', async (id) => {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Не вдалося видалити користувача');
  }
  return id;
});

const userSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    addUser: (state, action) => {
      state.push({ id: Date.now(), name: action.payload.name, email: action.payload.email });
    },
    deleteUser: (state, action) => {
      return state.filter((user) => user.id !== action.payload);
    },
    updateUser: (state, action) => {
      const user = state.find((user) => user.id === action.payload.id);
      if (user) {
        user.name = action.payload.name;
        user.email = action.payload.email;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.push(action.payload);
      })
      .addCase(addUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        return state.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addUser, deleteUser, updateUser } = userSlice.actions;
export default userSlice.reducer;