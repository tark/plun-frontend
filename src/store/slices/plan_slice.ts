import {createSlice} from '@reduxjs/toolkit'
import {ReduxStore} from '../index';
import {createPlan, fetchPlan, updatePlan} from '../../services/plan_service';

type PlanState = {
  plans: any,
  plansLoading: any,
  plansError: any,
}

const initialState: PlanState = {
  plans: {},
  plansLoading: {},
  plansError: {},
}

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(
        fetchPlan.pending,
        (state, action) => {
          console.log('fetchPlan.pending')
          const {date} = action.meta.arg
          state.plansLoading[date] = true
          state.plansError[date] = null
        }
      )
      .addCase(
        fetchPlan.fulfilled,
        (state, action) => {
          console.log(`fetchPlan.fulfilled - ${JSON.stringify(action.payload)}`)
          const {date} = action.meta.arg
          state.plansLoading[date] = false
          state.plansError[date] = null
          state.plans[date] = action.payload
        }
      )
      .addCase(
        fetchPlan.rejected,
        (state, action) => {
          const {date} = action.meta.arg
          console.log(`fetchPlan.rejected - error code - ${JSON.stringify(action)}`)
          state.plansLoading[date] = false
          state.plansError[date] = action.payload?.message
        }
      )
      .addCase(
        createPlan.pending,
        (state, action) => {
          console.log('createPlan.pending')
          const {date} = action.meta.arg.plan
          state.plansLoading[date] = true
          state.plansError[date] = null
        }
      )
      .addCase(
        createPlan.fulfilled,
        (state, action) => {
          console.log(`createPlan.fulfilled - ${JSON.stringify(action.payload)}`)
          const {date} = action.meta.arg.plan
          state.plansLoading[date] = false
          state.plansError[date] = null
          state.plans[date] = action.payload
        }
      )
      .addCase(
        createPlan.rejected,
        (state, action) => {
          console.log(`createPlan.rejected - ${JSON.stringify(action.payload)}`)
          const {date} = action.meta.arg.plan
          state.plansLoading[date] = false
          state.plansError[date] = action.payload?.message
        }
      )
      .addCase(
        updatePlan.pending,
        (state, action) => {
          console.log('updatePlan.pending')
          const {date} = action.meta.arg
          state.plansLoading[date] = true
          state.plansError[date] = null
        }
      )
      .addCase(
        updatePlan.fulfilled,
        (state, action) => {
          console.log(`updatePlan.fulfilled - ${JSON.stringify(action.payload)}`)
          const {date} = action.meta.arg
          state.plansLoading[date] = false
          state.plansError[date] = null
          state.plans[date] = action.payload
        }
      )
      .addCase(
        updatePlan.rejected,
        (state, action) => {
          console.log(`updatePlan.rejected - ${JSON.stringify(action.payload)}`)
          const {date} = action.meta.arg
          state.plansLoading[date] = false
          state.plansError[date] = action.payload?.message
        }
      )
  }
})

export const planSelectors = {
  plan: (state: ReduxStore) => state.plan.plans,
  planLoading: (state: ReduxStore) => state.plan.plansLoading,
  planError: (state: ReduxStore) => state.plan.plansError,
}

export default planSlice.reducer
