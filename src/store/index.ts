import {configureStore} from '@reduxjs/toolkit'
import profileReducer from './slices/profile_slice'
import planReducer from './slices/plan_slice'
import tasksReducer from './slices/tasks_slice'
import usersReducer from './slices/users_slice'
import errorReducer from './slices/error_slice'

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    plan: planReducer,
    tasks: tasksReducer,
    users: usersReducer,
    error: errorReducer,
  },
})

export type ReduxStore = ReturnType<typeof store.getState>
