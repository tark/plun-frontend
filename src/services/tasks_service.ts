import {createAsyncThunk} from '@reduxjs/toolkit'
import * as api from '../api/plun_api';
import {Task} from "../api/models/models";

export type FetchSuggestionsParams = {
  organizationName: string,
  projectName: string,
  query: string,
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

export const fetchSuggestions = createAsyncThunk<Array<Task>, FetchSuggestionsParams, ThunkApiType>(
  'tasks/fetchSuggestions',
  async (params, {rejectWithValue}) => {
    try {
      const {query, organizationName, projectName} = params
      // don't remove await word, otherwise catch will not work
      return <Array<Task>>(await api.getSuggestions(organizationName, projectName, query))
    } catch (e) {
      console.log(`error - ${JSON.stringify(e.response)}`)
      return rejectWithValue({
        code: e.response.status,
        message: e.response.statusText
      })
    }
  }
)
