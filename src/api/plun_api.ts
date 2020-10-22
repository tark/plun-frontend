import axios, {AxiosResponse} from 'axios';
import moment from 'moment';
import {UnauthorizedError} from './unauthorized_error';
import {DATE_FORMAT} from '../config/constants';
import {Plan, Task} from './models/models';

const baseApiUrl = 'http://localhost:3001';

export const getProfile = async (token: string) => {
  console.log('getProfile')
  return get('profile', {token})
}

export const getToken = async (authCode: string) => {
  console.log('getToken')
  return post('token', {authCode})
}

export const authToAzureByUserId = async (userId: string) => {
  console.log(`authToAzureByUserId - ${userId}`)
  return post('auth', {userId})
}

export const getOrganizations = async (token: string) => {
  console.log(`getOrganizations`)
  return get('organizations', {token})
}

export const getProjects = async (organizationName: string, token: string) => {
  console.log(`getProjects`)
  return get('projects', {organizationName, token})
}

export const getSuggestions = async (
  organizationName: string,
  projectName: string,
  query: string,
  token: string
) : Promise<Array<Task>> => {
  console.log(`getSuggestions - ${organizationName}, ${projectName}, ${query}`)
  const result = await get('tasks-suggestions', {organizationName, projectName, query, token})
  console.log(`getSuggestions - ${result}`)
  return result
}

export const planTasks = async (tasks: Array<Task>) => {
  const result = await post('plan', {tasks})
  console.log(`planTasks - ${result}`)
  return result
}

export const createPlan = async (plan: Plan) => {
  const result = await post('plan', {plan})
  console.log(`createPlan - ${result}`)
  return result
}

export const updatePlan = async (plan: Plan) => {
  const result = await patch('plan', {plan})
  console.log(`updatePlan - ${result}`)
  return result
}

export const getPlanForToday = async (
  organizationName: string,
  projectName: string,
  token: string
) :Promise<Plan> => {
  const result = await get('plan', {
    organizationName,
    projectName,
    date: moment().format(DATE_FORMAT),
    token,
  })
  console.log(`getPlanForToday - ${result}`)
  return result
}

export const getPreviousNearestPlan = async (
  organizationName: string,
  projectName: string,
  token: string
) : Promise<Plan> => {
  const result = await get('plan', {
    organizationName,
    projectName,
    token,
  })
  console.log(`getPreviousNearestPlan - ${result}`)
  return result
}

export const deleteTask = async (task: Task) => {
  return del('plan', {taskId: task.id})
}

export const updateTask = async (task: Task) => {
  return patch('plan', {task})
}

const post = async (endpoint: string, body: any) => {
  console.log('post')
  const result = await axios.post(`${baseApiUrl}/${endpoint}`, body)
  return checkAndReturn(result)
}

const del = async (endpoint: string, body: any) => {
  console.log('del')
  const result = await axios.delete(`${baseApiUrl}/${endpoint}`, {data: body})
  return checkAndReturn(result)
}

const patch = async (endpoint:string, body: any) => {
  console.log('patch')
  const result = await axios.patch(`${baseApiUrl}/${endpoint}`, body)
  return checkAndReturn(result)
}

const get = async (endpoint: string, params: any): Promise<any> => {
  console.log('get')
  const result: AxiosResponse = await axios.get(`${baseApiUrl}/${endpoint}`, {params})
  return checkAndReturn(result)
}

const checkAndReturn = (result: AxiosResponse): any => {
  switch (result.status) {
    case 401:
      throw new UnauthorizedError()
    case 200:
    default:
      return result.data;
  }
}
