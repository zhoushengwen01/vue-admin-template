import http from './base'
import qs from 'qs'


export const login = (username, password) => {
  return http.requestPostForm('/authentication/form', qs.stringify({
    'username': username, 'password': password
  }))
}
