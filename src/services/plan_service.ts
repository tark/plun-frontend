import {createAsyncThunk} from '@reduxjs/toolkit'
import * as api from '../api/plun_api';
import {Plan} from "../api/models/models";

export type FetchPlanParams = {
  organizationName: string,
  projectName: string,
  date: string,
}

export type CreatePlanParams = {
  organizationName: string,
  projectName: string,
  plan: Plan,
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

export const fetchPlan = createAsyncThunk<Plan, FetchPlanParams, ThunkApiType>(
  'plan/fetchPlan',
  async (args, {rejectWithValue}) => {
    console.log(`fetching plan - ${JSON.stringify(args)}`)
    try {
      // don't remove await word, otherwise catch will not work
      return <Plan>(await api.getPlan(args.date, args.organizationName, args.projectName))
    } catch (e) {
      console.log(`error - ${JSON.stringify(e.response)}`)
      return rejectWithValue({
        code: e.response.status,
        message: e.response.statusText
      })
    }
  }
)

export const createPlan = createAsyncThunk<Plan, CreatePlanParams, ThunkApiType>(
  'plan/createPlan',
  async (params, {rejectWithValue}) => {
    const {plan, organizationName, projectName} = params

    if (!plan) {
      return rejectWithValue({
        code: -1,
        message: 'plan parameter is missing'
      })
    }

    try {
      // don't remove await word, otherwise catch will not work
      return await api.createPlan(plan, organizationName, projectName)
    } catch (e) {
      console.log(`error - ${JSON.stringify(e.response)}`)
      return rejectWithValue({
        code: e.response.status,
        message: e.response.statusText
      })
    }
  }
)

export const updatePlan = createAsyncThunk<Plan, Plan, ThunkApiType>(
  'plan/updatePlan',
  async (plan, {rejectWithValue}) => {
    if (!plan) {
      return rejectWithValue({
        code: -1,
        message: 'plan parameter is missing'
      })
    }

    try {
      return await api.updatePlan(plan)
    } catch (e) {
      console.log(`error - ${JSON.stringify(e.response)}`)
      return rejectWithValue({
        code: e.response.status,
        message: e.response.statusText
      })
    }
  }
)
