// src/hooks/useAuth.ts
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/localstorage.service';

export const useAuth = () => {
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await AuthService.login(email, password);
      console.log(response)
      const { accessToken } = response;
      LocalStorageService.setAuthToken(accessToken);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error en login:', error.response?.data?.message || error.message);
      throw error;
    }
  };

//   const register = async (userData: Omit<any, 'passwordConfirmation'>): Promise<void> => {
//     try {
//       const response = await api.post('/auth/register', userData);
//       const { access_token } = response.data;

//       setAuthToken(access_token);
//       navigate('/dashboard');
//     } catch (error: any) {
//       console.error('Error en registro:', error.response?.data?.message || error.message);
//       throw error;
//     }
//   };

  const logout = (): void => {
    LocalStorageService.clear();
    navigate('/login');
  };

  const isAuthenticated = (): boolean => {
    const token = LocalStorageService.getToken();
    return !!token;
  };

  return { login, logout, isAuthenticated };
};