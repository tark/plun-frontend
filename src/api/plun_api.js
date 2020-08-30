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
  const result = await post('plan-tasks', {tasks})
  console.log(`planTasks - ${result}`)
  return result
}

const post = async (endpoint, body) => {
  console.log(`post - ${JSON.stringify(body)}`)
  const result = await axios.post(`${baseApiUrl}/${endpoint}`, body)
  switch (result.status) {
    case 401:
      throw new UnauthorizedError()
    case 200:
    default:
      return result.data;
  }

}

const get = async (endpoint, params) => {
  console.log(`get - ${JSON.stringify(params)}`)
  const result = await axios.get(`${baseApiUrl}/${endpoint}`, {params})
  switch (result.status) {
    case 401:
      throw new UnauthorizedError()
    case 200:
    default:
      return result.data;
  }

}
