import {createSlice} from '@reduxjs/toolkit'
import {ReduxStore} from '../index';

type UsersState = {
  error: string | undefined | null,
}
const initialState: UsersState = {
  error: null,
}

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action) => {
      console.log(`setError - ${JSON.stringify(action.payload)}`)
      state.error = action.payload
    },
  },

})

export const errorSelectors = {
  error: (state: ReduxStore) => state.error.error,
}

export const {setError} = errorSlice.actions


export default errorSlice.reducer
