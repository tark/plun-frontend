import {createSlice} from '@reduxjs/toolkit'
import {ReduxStore} from '../index';
import {User} from '../../api/models/models';
import {fetchUsers} from '../../services/users_service';

type UsersState = {
  users: Array<User> | null,
  usersLoading: boolean,
  usersError: string | undefined | null,
}

const emptyUser = {
  id: '',
  azureProfileId: '',
  name: '',
  email: '',
}

const initialState: UsersState = {
  users: [
    emptyUser,
    emptyUser,
    emptyUser,
    emptyUser,
  ],
  usersLoading: false,
  usersError: null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(
        fetchUsers.pending,
        (state) => {
          console.log('fetchUsers.pending')
          state.usersLoading = true
          state.usersError = null
        }
      )
      .addCase(
        fetchUsers.fulfilled,
        (state, action) => {
          console.log(`fetchUsers.fulfilled - ${JSON.stringify(action.payload)}`)
          state.usersLoading = false
          state.usersError = null
          const users = action.payload
          users.sort()
          state.users = users
        }
      )
      .addCase(
        fetchUsers.rejected,
        (state, action) => {
          console.log(`fetchUsers.rejected - error code - ${JSON.stringify(action)}`)
          state.usersLoading = false
          state.usersError = action.payload?.message
        }
      )
  }
})


export const usersSelectors = {
  users: (state: ReduxStore) => state.users.users,
  usersLoading: (state: ReduxStore) => state.users.usersLoading,
  usersError: (state: ReduxStore) => state.users.usersError,
}

export default usersSlice.reducer
