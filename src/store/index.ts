import {configureStore} from '@reduxjs/toolkit'
import profileReducer from './slices/profile_slice'
import planReducer from './slices/plan_slice'
import tasksReducer from './slices/tasks_slice'

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    plan: planReducer,
    tasks: tasksReducer,
  },
})

export type ReduxStore = ReturnType<typeof store.getState>
