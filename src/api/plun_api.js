import queryString from 'querystring';
import axios from 'axios';
import {UnauthorizedError} from './unauthorized_error';

const baseApiUrl = 'http://localhost:3001';

export const getProfile = async (token) => {
  console.log('getProfile')
  return get('profile', {token})
}

export const getToken = async (authCode) => {
  console.log(`getToken`)
  return post('token', {authCode})
}

export const authToAzureByUserId = async (userId) => {
  console.log(`authToAzureByUserId - ${userId}`)
  return post('auth', {userId})
}

export const getOrganizations = async (token) => {
  console.log(`getOrganizations - ${token}`)
  return get('organizations', {token})
}

export const getProjects = async (organizationName, token) => {
  console.log(`getProjects - ${token}`)
  return get('projects', {organizationName, token})
}

export const getSuggestions = async (organizationName, projectName, query, token) => {
  console.log(`getSuggestions - ${organizationName}, ${projectName}, ${query}`)
  const result = await get('tasks-suggestions', {organizationName, projectName, query, token})
  console.log(`getSuggestions - ${result}`)
  return result
}

export const planTasks = async (tasks) => {
  const result = await post('plun', {tasks})
  console.log(`planTasks - ${result}`)
  return result
}

export const getPlanForToday = async (organizationName, projectName, token) => {
  const result = await get('plun', {
    organizationName,
    projectName,
    time: new Date().getTime(),
    token,
  })
  console.log(`getPlanForToday - ${result}`)
  return result
}

export const getPreviousNearestPlan = async (organizationName, projectName, token) => {
  const result = await get('plun', {
    organizationName,
    projectName,
    token,
  })
  console.log(`getPreviousNearestPlan - ${result}`)
  return result
}

export const deleteTask = async (task) => {
  return del('plun', {taskId: task.id})
}

export const updateTask = async (task) => {
  return patch('plun', {task})
}

const post = async (endpoint, body) => {
  console.log(`post - ${JSON.stringify(body)}`)
  const result = await axios.post(`${baseApiUrl}/${endpoint}`, body)
  return checkAndReturn(result)
}

const del = async (endpoint, body) => {
  console.log(`del - ${JSON.stringify(body)}`)
  const result = await axios.delete(`${baseApiUrl}/${endpoint}`, {data: body})
  return checkAndReturn(result)
}

const patch = async (endpoint, body) => {
  console.log(`patch - ${JSON.stringify(body)}`)
  const result = await axios.patch(`${baseApiUrl}/${endpoint}`, body)
  return checkAndReturn(result)
}

const get = async (endpoint, params) => {
  console.log(`get - ${JSON.stringify(params)}`)
  const result = await axios.get(`${baseApiUrl}/${endpoint}`, {params})
  return checkAndReturn(result)
}

const checkAndReturn = (result) => {
  switch (result.status) {
    case 401:
      throw new UnauthorizedError()
    case 200:
    default:
      return result.data;
  }
}
