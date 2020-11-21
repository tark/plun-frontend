import {createAsyncThunk} from '@reduxjs/toolkit'
import * as api from '../api/plun_api';
import {Plan} from "../api/models/models";

export type FetchPlanParams = {
  organizationName: string,
  projectName: string,
  date: string,
  userId: string,
}

export type FetchPlansParams = {
  organizationName: string,
  projectName: string,
  dateFrom: string,
  dateTo: string,
}

export type CreatePlanParams = {
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

/**
 * Use fetchPlans instead
 *
 * @deprecated
 */
export const fetchPlan = createAsyncThunk<Plan, FetchPlanParams, ThunkApiType>(
  'plan/fetchPlan',
  async (args, {rejectWithValue}) => {
    console.log(`fetching plan - ${JSON.stringify(args)}`)
    try {
      // don't remove await word, otherwise catch will not work
      return <Plan>(await api.getPlan(args.organizationName, args.projectName, args.date))
    } catch (e) {
      console.log(`error - ${JSON.stringify(e.response)}`)
      return rejectWithValue({
        code: e.response.status,
        message: e.response.statusText
      })
    }
  }
)

export const fetchPlans = createAsyncThunk<Array<Plan>, FetchPlansParams, ThunkApiType>(
  'plan/fetchPlans',
  async (args, {rejectWithValue}) => {
    console.log(`fetching plans - ${JSON.stringify(args)}`)
    try {
      // don't remove await word, otherwise catch will not work
      return <Array<Plan>>(await api.getPlans(
        args.organizationName,
        args.projectName,
        args.dateFrom,
        args.dateTo,
      ))
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
    const {plan} = params

    if (!plan) {
      return rejectWithValue({
        code: -1,
        message: 'plan parameter is missing'
      })
    }

    try {
      // don't remove await word, otherwise catch will not work
      return await api.createPlan(plan)
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
