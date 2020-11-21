import {createAsyncThunk} from '@reduxjs/toolkit'
import * as api from '../api/plun_api';
import {User} from "../api/models/models";

export type FetchUsersParams = {
  organizationName: string,
  projectName: string,
}

interface ThunkError {
  code: number,
  message: string
}

interface ThunkApiType {
  extra: {
    jwt: string
  },
  rejectValue: ThunkError
}

/**
 * Returns users who have plans within current Org/Proj
 */
export const fetchUsers = createAsyncThunk<Array<User>, FetchUsersParams, ThunkApiType>(
  'tasks/fetchUsers',
  async (params, {rejectWithValue}) => {
    console.log(`fetchUsers`)
    try {
      const {organizationName, projectName} = params
      console.log(`fetch users`)
      return <Array<User>>(await api.getUsers(organizationName, projectName))
    } catch (e) {
      console.log(`fetch users - error - ${JSON.stringify(e.response)}`)
      return rejectWithValue({
        code: e.response.status,
        message: e.response.statusText
      })
    }
  }
)
