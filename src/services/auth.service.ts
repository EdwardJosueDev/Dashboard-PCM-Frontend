import HttpClient from '../api/httpClient'
import { User } from './users.service'
// import { User } from '../types/user'

export class AuthService {
  public static login(email: string, password: string, rememberMe: boolean = false) {
    return HttpClient.post<{
      accessToken: string
    }>('/auth/login', { email, password, rememberMe })
  }

  public static getProfile() {
    return HttpClient.get<User>('/auth/profile')
  }
}
