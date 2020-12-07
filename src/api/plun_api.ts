import axios, {AxiosResponse} from 'axios';
import moment from 'moment';
import {UnauthorizedError} from './unauthorized_error';
import {DATE_FORMAT} from '../config/constants';
import {AzureAuthResponse, Plan, Task, User} from './models/models';
import {
  getAccessTokenFromStorage,
  getRefreshTokenFromStorage,
  saveAccessTokenToStorage, saveRefreshTokenToStorage
} from '../config/storage';

export const configureApi = () => {
  axios.defaults.headers.common.Authorization = `Bearer ${getAccessTokenFromStorage()}`;

  // Add a request interceptor
  axios.interceptors.request.use(
    config => {
      config.headers = {
        Authorization: `Bearer ${getAccessTokenFromStorage()}`,
        Accept: 'application/json',
      }
      return config;
    },
    error => {
      // Do something with request error
      return Promise.reject(error);
    },
  );

  // Response interceptor for API calls
  axios.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;
      // if returned error is 401 and we have refresh token
      if (error.response.status === 401 && getRefreshTokenFromStorage()) {
        console.log('Got 401 error and we have refresh token')
        const azureAuthResponse = await refreshAccessToken(getRefreshTokenFromStorage());
        const {accessToken, refreshToken} = azureAuthResponse
        saveAccessTokenToStorage(accessToken)
        saveRefreshTokenToStorage(refreshToken)
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      }

      console.log(`get error - ${error.response.status}`)
      return Promise.reject(error);
    }
  );

}

/**
 * Ask server to auth by given code.
 * Server auth, save access token and backend token on server
 * side. And returns us a profile.
 */
export const auth = async (authCode: string): Promise<AzureAuthResponse> => {
  console.log('api - auth')
  return post('auth', {authCode})
}

export const refreshAccessToken = (refreshToken: string): Promise<AzureAuthResponse> => {
  return post('refreshToken', {refreshToken})
}

// --- PRIVATE ---

export const getProfile = async (): Promise<User> => {
  console.log('api - getProfile')
  return get('profile')
}

export const getOrganizations = async () => {
  console.log('api - getOrganizations')
  return get('organizations')
}

export const getProjects = async (organizationName: string) => {
  console.log('api - getProjects')
  return get('projects', {organizationName})
}

export const getSuggestions = async (
  organizationName: string,
  projectName: string,
  query: string,
): Promise<Array<Task>> => {
  console.log(`api - getSuggestions - ${organizationName}, ${projectName}, ${query}`)
  const result = await get('tasks-suggestions', {
    organizationName,
    projectName,
    query,
  })
  return result
}

export const planTasks = async (tasks: Array<Task>) => {
  const result = await post('plan', {tasks})
  console.log(`api - planTasks - ${result}`)
  return result
}

export const createPlan = async (
  plan: Plan,
): Promise<Plan> => {
  const result = await post('plan', {plan/*, organizationName, projectName*/})
  console.log(`api - createPlan - ${result}`)
  return result
}

export const updatePlan = async (plan: Plan) => {
  const result = await patch('plan', {plan})
  console.log(`api - updatePlan - ${result}`)
  return result
}

export const getPlan = async (
  organizationName: string,
  projectName: string,
  date: string
): Promise<Plan> => {
  console.log(`getPlan - date - ${date}`)
  const result = await get('plan', {
    organizationName,
    projectName,
    date,
  })
  return result
}

export const getPlans = async (
  organizationName: string,
  projectName: string,
  dateFrom: string,
  dateTo: string,
): Promise<Array<Plan>> => {
  console.log(`getPlans - ${dateFrom}, ${dateTo}`)
  return get('plans', {
    organizationName,
    projectName,
    dateFrom,
    dateTo,
  })
}

/**
 * @deprecated use [getPlan] instead
 * @param organizationName
 * @param projectName
 */
export const getPlanForToday = async (
  organizationName: string,
  projectName: string
): Promise<Plan> => {
  const result = await get('plan', {
    organizationName,
    projectName,
    date: moment().format(DATE_FORMAT),
  })
  return result
}

/**
 * @deprecated use [getPlan] instead
 * @param organizationName
 * @param projectName
 */
export const getPreviousNearestPlan = async (
  organizationName: string,
  projectName: string
): Promise<Plan> => {
  const result = await get('private/plan', {
    organizationName,
    projectName,
  })
  return result
}

export const deleteTask = async (task: Task) => {
  return del('private/plan', {taskId: task.id})
}

export const getUsers = async (organizationName: string) => {
  console.log(`getUsers - ${organizationName}`)
  return get('users', {organizationName})
}

// ----------

const post = async (endpoint: string, body?: any) => {
  console.log(`api - post - ${JSON.stringify(body)}`)
  const result = await axios.post(`${apiHost()}/${endpoint}`, body)
  return checkAndReturn(result)
}

const del = async (endpoint: string, body: any) => {
  console.log('api - del')
  const result = await axios.delete(`${apiHost()}/${endpoint}`, {data: body})
  return checkAndReturn(result)
}

const patch = async (endpoint: string, body: any) => {
  console.log('api - patch')
  const result = await axios.patch(`${apiHost()}/${endpoint}`, body)
  return checkAndReturn(result)
}

const get = async (endpoint: string, params?: any): Promise<any> => {
  console.log(`api - get - ${apiHost()}/${endpoint}, ${JSON.stringify(params)}`)
  const result: AxiosResponse = await axios.get(`${apiHost()}/${endpoint}`, {params})
  return checkAndReturn(result)
}

const apiHost = () => {
  return process.env.REACT_APP_API_HOST
}

const checkAndReturn = (result: AxiosResponse): any => {
  console.log('checkAndReturn')
  switch (result.status) {
    case 401:
      throw new UnauthorizedError()
    case 200:
    default:
      return result.data;
  }
}

