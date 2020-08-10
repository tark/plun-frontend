import queryString from 'querystring';
import axios from 'axios';
import {UnauthorizedError} from './unauthorized_error';

const baseApiUrl = 'http://localhost:3001';

export const authToAzureByCode = async () => {
  const search = window.location.search.replace('?', '')
  console.log(`search - ${JSON.stringify(queryString.parse(search), null, 2)}`)
  const {code} = queryString.parse(search)
  const response = await post('auth-by-code', {code})
  return response.data;
}

export const authToAzureByUserId = async (userId) => {
  const result = await post('auth', {userId})
  console.log(`authToAzureByUserId - after`)
  switch (result.status) {
    case 401:
      throw new UnauthorizedError()
    case 200:
    default:
      return result.data;
  }
}

export const getSuggestions = async (query) => {
  console.log(`getSuggestions`)
  const result = await get('tasks-suggestions', {query})
  return result.data
}

const post = async (endpoint, body) => {
  return axios.post(`${baseApiUrl}/${endpoint}`, body)
}

const get = async (endpoint, params) => {
  return axios.get(`${baseApiUrl}/${endpoint}`, params)
}
