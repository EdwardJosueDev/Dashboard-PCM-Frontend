import HttpClient from '../api/httpClient'
// import { User } from '../types/user'

export class MetabaseService {
  public static  getDashboard() {
    return HttpClient.get<any>('/metabase/dashboard',{})
  }
}
