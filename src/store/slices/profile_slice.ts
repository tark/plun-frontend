import {createSlice} from '@reduxjs/toolkit'
import {ReduxStore} from '../index';
import {
  fetchProfile,
  auth,
  fetchOrganizations,
  fetchProjects
} from '../../services/profile_service';
import {Organization, Project, User} from '../../api/models/models';

type ProfileState = {
  profile: User | null,
  loading: boolean,
  error: any,
  unauthorized: boolean,
  authLoading: boolean,
  authError: any,
  organizations: Array<Organization> | null,
  organizationsLoading: boolean,
  organizationsError: string | undefined | null,
  projects: Array<Project> | null,
  projectsLoading: boolean,
  projectsError: string | undefined | null,
  selectedOrganization: Organization | null,
  selectedProject: Organization | null,
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  unauthorized: false,
  error: null,
  authLoading: false,
  authError: null,
  organizations: null,
  organizationsLoading: false,
  organizationsError: null,
  projects: null,
  projectsLoading: false,
  projectsError: null,
  selectedOrganization: null,
  selectedProject: null,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    selectOrganization: (state, action) => {
      console.log(`selectOrganization - ${JSON.stringify(action.payload.name)}`)
      state.selectedOrganization = action.payload
    },
    selectProject: (state, action) => {
      console.log(`selectProject - ${action.payload?.name}`)
      state.selectedProject = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(
        fetchProfile.pending,
        (state) => {
          console.log('fetchProfile.pending')
          state.loading = true
          state.error = false
        }
      )
      .addCase(
        fetchProfile.fulfilled,
        (state, action) => {
          console.log(`fetchProfile.fulfilled - ${JSON.stringify(action.payload)}`)
          state.loading = false
          state.unauthorized = false
          state.error = null
          state.profile = action.payload
        }
      )
      .addCase(
        fetchProfile.rejected,
        (state, action) => {
          console.log(`fetchProfile.rejected - error code - ${JSON.stringify(action)}`)
          state.loading = false
          state.unauthorized = action.payload?.code === 401
          state.error = action.payload?.message
        }
      )
      .addCase(
        auth.pending,
        (state) => {
          console.log('auth.pending')
          state.authLoading = true
        }
      )
      .addCase(
        auth.fulfilled,
        (state, action) => {
          console.log(`auth.fulfilled - ${JSON.stringify(action.payload)}`)
          state.authLoading = false
          state.profile = action.payload
        }
      )
      .addCase(
        auth.rejected,
        (state, action) => {
          console.log(`rejected - ${JSON.stringify(action.payload)}`)
          state.authLoading = false
          state.unauthorized = action.payload?.code === 401
          state.error = action.payload?.message
        }
      )
      .addCase(
        fetchOrganizations.pending,
        (state) => {
          console.log('fetchOrganizations.pending')
          state.organizationsLoading = true
          state.organizationsError = null
        }
      )
      .addCase(
        fetchOrganizations.fulfilled,
        (state, action) => {
          console.log(`fetchOrganizations.fulfilled - ${JSON.stringify(action.payload)}`)
          state.organizationsLoading = false
          state.organizationsError = null
          state.organizations = action.payload
        }
      )
      .addCase(
        fetchOrganizations.rejected,
        (state, action) => {
          console.log(`fetchOrganizations.rejected - ${JSON.stringify(action.payload)}`)
          state.organizationsLoading = false
          state.unauthorized = action.payload?.code === 401
          state.organizationsError = action.payload?.message
        }
      )
      .addCase(
        fetchProjects.pending,
        (state) => {
          console.log('fetchProjects.pending')
          state.projectsLoading = true
          state.projectsError = null
        }
      )
      .addCase(
        fetchProjects.fulfilled,
        (state, action) => {
          console.log(`fetchProjects.fulfilled - ${JSON.stringify(action.payload)}`)
          state.projectsLoading = false
          state.projectsError = null
          state.projects = action.payload
        }
      )
      .addCase(
        fetchProjects.rejected,
        (state, action) => {
          console.log(`fetchProjects.rejected - ${JSON.stringify(action.payload)}`)
          state.projectsLoading = false
          state.unauthorized = action.payload?.code === 401
          state.projectsError = action.payload?.message
        }
      )
  }
})

export const profileSelectors = {
  profile: (state: ReduxStore) => state.profile.profile,
  loading: (state: ReduxStore) => state.profile.loading,
  error: (state: ReduxStore) => state.profile.error,
  authLoading: (state: ReduxStore) => state.profile.authLoading,
  authError: (state: ReduxStore) => state.profile.authError,
  unauthorized: (state: ReduxStore) => state.profile.unauthorized,
  organizations: (state: ReduxStore) => state.profile.organizations,
  organizationsLoading: (state: ReduxStore) => state.profile.organizationsLoading,
  organizationsError: (state: ReduxStore) => state.profile.organizationsError,
  projects: (state: ReduxStore) => state.profile.projects,
  projectsLoading: (state: ReduxStore) => state.profile.projectsLoading,
  projectsError: (state: ReduxStore) => state.profile.projectsError,
  selectedOrganization: (state: ReduxStore) => state.profile.selectedOrganization,
  selectedProject: (state: ReduxStore) => state.profile.selectedProject,
}

export const {selectOrganization, selectProject} = profileSlice.actions

export default profileSlice.reducer
