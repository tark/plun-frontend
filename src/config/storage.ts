export const getAccessTokenFromStorage = (): string => {
  return localStorage.getItem('access_token') ?? '';
}

export const saveAccessTokenToStorage = (accessToken: string) => {
  localStorage.setItem('access_token', accessToken);
}

export const getRefreshTokenFromStorage = (): string => {
  return localStorage.getItem('refresh_token') ?? '';
}

export const saveRefreshTokenToStorage = (refreshToken: string) => {
  localStorage.setItem('refresh_token', refreshToken)
}
