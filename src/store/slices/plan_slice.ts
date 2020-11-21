import {createSlice} from '@reduxjs/toolkit'
import {ReduxStore} from '../index';
import {createPlan, fetchPlans, updatePlan} from '../../services/plan_service';
import {Plan} from '../../api/models/models';

type PlanState = {
  // Not using maps, because they are serialized badly.
  // using plain objects

  // plans: Map<date, Map<userId, Plan>>
  plans: any,
  // loading: Map<date, bool>
  plansLoading: PlansLoading,
  // error: Map<date, bool>
  plansError: PlansError,
  // plan updating is for my plans only
  // Map<date, bool>
  planUpdating: any,
  // plan update error is for my plans only
  // Map<date, string | undefined>
  planUpdateError: any,
}

type PlansLoading = {
  dateFrom?: string,
  dateTo?: string,
  loading?: boolean,
}

type PlansError = {
  dateFrom?: string,
  dateTo?: string,
  error?: string | null,
}

const initialState: PlanState = {
  plans: {},
  plansLoading: {},
  plansError: {},
  planUpdating: {},
  planUpdateError: {},
}

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(
        fetchPlans.pending,
        (state, action) => {
          console.log('fetchPlans.pending')
          const {dateFrom, dateTo} = action.meta.arg
          state.plansLoading = {dateFrom, dateTo, loading: true}
          state.plansError = {dateFrom, dateTo, error: null}
        }
      )
      .addCase(
        fetchPlans.fulfilled,
        (state, action) => {
          console.log(`fetchPlans.fulfilled - ${JSON.stringify(action.payload)}`)
          const {dateFrom, dateTo} = action.meta.arg
          state.plansLoading = {dateFrom, dateTo, loading: false}
          state.plansError = {dateFrom, dateTo, error: null}

          // we have array of plans
          // need to create structure Map<date, Map<userId, Plan>>
          state.plans = {}
          action.payload.forEach(plan => {
            state.plans[plan.date] = {
              [plan.userId]: plan
            }
          })
        }
      )
      .addCase(
        fetchPlans.rejected,
        (state, action) => {
          console.log(`fetchPlans.rejected - error code - ${JSON.stringify(action)}`)
          const {dateFrom, dateTo} = action.meta.arg
          state.plansLoading = {dateFrom, dateTo, loading: false}
          state.plansError = {dateFrom, dateTo, error: action.payload?.message}
        }
      )
      .addCase(
        createPlan.pending,
        (state, action) => {
          console.log('createPlan.pending')
          const {date} = action.meta.arg.plan
          state.planUpdating[date] = true
          state.planUpdateError[date] = null
        }
      )
      .addCase(
        createPlan.fulfilled,
        (state, action) => {
          console.log(`createPlan.fulfilled - ${JSON.stringify(action.payload)}`)
          const {date} = action.meta.arg.plan
          state.planUpdating[date] = false
          state.planUpdateError[date] = null

          // we received plan in payload
          const plan: Plan = action.payload
          if (!state.plans[date]) {
            state.plans[date] = {}
          }
          state.plans[date][plan.userId] = plan

        }
      )
      .addCase(
        createPlan.rejected,
        (state, action) => {
          console.log(`createPlan.rejected - ${JSON.stringify(action.payload)}`)
          const {date} = action.meta.arg.plan
          state.planUpdating[date] = false
          state.planUpdateError[date] = action.payload?.message
        }
      )
      .addCase(
        updatePlan.pending,
        (state, action) => {
          console.log('updatePlan.pending')
          const {date} = action.meta.arg
          state.planUpdating[date] = true
          state.planUpdateError[date] = null
        }
      )
      .addCase(
        updatePlan.fulfilled,
        (state, action) => {
          console.log(`updatePlan.fulfilled - ${JSON.stringify(action.payload)}`)
          const {date} = action.meta.arg

          state.planUpdating[date] = false
          state.planUpdateError[date] = null

          // we received plan in payload
          const plan: Plan = action.payload
          state.plans[date][plan.userId] = plan
        }
      )
      .addCase(
        updatePlan.rejected,
        (state, action) => {
          console.log(`updatePlan.rejected - ${JSON.stringify(action.payload)}`)
          const {date} = action.meta.arg
          state.planUpdating[date] = false
          state.planUpdateError[date] = action.payload?.message
        }
      )
  }
})

export const plansSelectors = {
  plans: (state: ReduxStore) => state.plan.plans,
  plansLoading: (state: ReduxStore) => state.plan.plansLoading,
  plansError: (state: ReduxStore) => state.plan.plansError,
  planUpdating: (state: ReduxStore) => state.plan.planUpdating,
  planUpdateError: (state: ReduxStore) => state.plan.planUpdateError,
}

export default planSlice.reducer
