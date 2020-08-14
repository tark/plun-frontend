import queryString from 'querystring';
import axios from 'axios';
import {UnauthorizedError} from './unauthorized_error';

const baseApiUrl = 'http://localhost:3001';

export const authToAzureByCode = async (code) => {
  return post('auth-by-code', {code})
}

export const authToAzureByUserId = async (userId) => {
  return post('auth', {userId})
}

export const getOrganizations = async (userId) => {
  return get('organizations', {userId})
}

export const getProjects = async (userId) => {
  return get('projects', {userId})
}

export const getSuggestions = async (query) => {
  const result = await get('tasks-suggestions', {query})
  return result.data
}

const post = async (endpoint, body) => {
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
  const result = await axios.get(`${baseApiUrl}/${endpoint}`, params)
  switch (result.status) {
    case 401:
      throw new UnauthorizedError()
    case 200:
    default:
      return result.data;
  }

}
