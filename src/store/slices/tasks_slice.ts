import {createSlice} from '@reduxjs/toolkit'
import {ReduxStore} from '../index';
import {Task} from '../../api/models/models';
import {fetchSuggestions} from '../../services/tasks_service';

type TasksState = {
  suggestions: Array<Task> | null,
  suggestionsLoading: boolean,
  suggestionsError: string | undefined | null,
}

const initialState: TasksState = {
  suggestions: null,
  suggestionsLoading: false,
  suggestionsError: null,
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(
        fetchSuggestions.pending,
        (state) => {
          console.log('fetchSuggestions.pending')
          state.suggestionsLoading = true
          state.suggestionsError = null
        }
      )
      .addCase(
        fetchSuggestions.fulfilled,
        (state, action) => {
          console.log(`fetchSuggestions.fulfilled - ${JSON.stringify(action.payload)}`)
          state.suggestionsLoading = false
          state.suggestionsError = null
          state.suggestions = action.payload
        }
      )
      .addCase(
        fetchSuggestions.rejected,
        (state, action) => {
          console.log(`v.rejected - error code - ${JSON.stringify(action)}`)
          state.suggestionsLoading = false
          state.suggestionsError = action.payload?.message
        }
      )
  }
})

export const tasksSelectors = {
  suggestions: (state: ReduxStore) => state.tasks.suggestions,
  suggestionsLoading: (state: ReduxStore) => state.tasks.suggestionsLoading,
  suggestionsError: (state: ReduxStore) => state.tasks.suggestionsError,
}

export default tasksSlice.reducer
