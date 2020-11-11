import {createAsyncThunk} from '@reduxjs/toolkit'
import * as api from '../api/plun_api';
import {Organization, Project, User} from "../api/models/models";
import {saveAccessTokenToStorage, saveRefreshTokenToStorage} from "../config/storage";

export type Void = void

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

export const fetchProfile = createAsyncThunk<User, Void, ThunkApiType>(
  'profile/fetchProfile',
  async (_, {rejectWithValue}) => {
    try {
      // don't remove await word, otherwise catch will not work
      return <User>(await api.getProfile())
    } catch (e) {
      console.log(`error - ${JSON.stringify(e.response)}`)
      return rejectWithValue({
        code: e.response.status,
        message: e.response.statusText
      })
    }
  }
)

export const fetchOrganizations = createAsyncThunk<Array<Organization>, Void, ThunkApiType>(
  'profile/fetchOrganizations',
  async (_, {rejectWithValue}) => {
    try {
      // don't remove await word, otherwise catch will not work
      return await api.getOrganizations()
    } catch (e) {
      console.log(`error - ${JSON.stringify(e.response)}`)
      return rejectWithValue({
        code: e.response.status,
        message: e.response.statusText
      })
    }
  }
)

export const fetchProjects = createAsyncThunk<Array<Project>, string, ThunkApiType>(
  'profile/fetchProjects',
  async (organizationName, {rejectWithValue}) => {
    try {
      // don't remove await word, otherwise catch will not work
      return await api.getProjects(organizationName)
    } catch (e) {
      console.log(`error - ${JSON.stringify(e.response)}`)
      return rejectWithValue({
        code: e.response.status,
        message: e.response.statusText
      })
    }
  }
)

export const auth = createAsyncThunk<User, string, ThunkApiType>(
  'profile/auth',
  async (code, {rejectWithValue}) => {
    try {
      const azureAuthResponse = await api.auth(code)
      saveAccessTokenToStorage(azureAuthResponse.accessToken)
      saveRefreshTokenToStorage(azureAuthResponse.refreshToken)
      return <User>(await api.getProfile())
    } catch (e) {
      console.log(`error - ${JSON.stringify(e.response)}`)
      return rejectWithValue({
        code: e.response.status,
        message: e.response.statusText
      })
    }
  }
)
