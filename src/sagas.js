import { all, call, put, takeEvery } from 'redux-saga/effects';
import { fetchTasks, addTaskAsync, updateTaskAsync, deleteTaskAsync } from './reducers/taskReducer';
import { addUserAsync, updateUserAsync, deleteUserAsync } from './reducers/userReducer';

// Worker Saga: Fetch tasks
function* fetchTasksSaga() {
  try {
    const response = yield call(fetch, 'https://api.example.com/tasks');
    const data = yield response.json();
    yield put(fetchTasks.fulfilled(data));
  } catch (error) {
    yield put(fetchTasks.rejected(error.message));
  }
}

// Watcher Saga: Watch for task-related actions
function* watchTaskActions() {
  yield takeEvery('tasks/fetchTasks/pending', fetchTasksSaga);
  // Add more watchers for addTaskAsync, updateTaskAsync, deleteTaskAsync if needed
}

// Root Saga
export default function* rootSaga() {
  yield all([
    watchTaskActions(),
    // Add more watchers for user-related actions if needed
  ]);
}