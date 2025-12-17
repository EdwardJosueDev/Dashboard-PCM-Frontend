import { useState } from 'react';
import { Icon } from '@iconify/react';
import { AuthService } from '../services/auth.service';
import { useAuth } from '../hooks/useAuth';
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth(); 
  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null); 
      setLoading(true);

      if (!username || !password) {
        setError('Por favor ingresa tu email y contraseña');
        setLoading(false);
        return;
      }

      try {
        await login(username, password);
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Error al iniciar sesión. Intenta de nuevo.';
        setError(message);
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--gob-gray-100))] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-[hsl(var(--gob-red))] rounded-lg flex items-center justify-center">
                {/* <Icon icon="mdi:shield-account" className="text-white text-5xl" /> */}
                <img
                  src="/images/escudo_bw.svg"
                  className="w-12"
                  alt="Bicentenario"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[hsl(var(--gob-gray-900))] mb-2">
              Sistema de Gestión
            </h1>
            <p className="text-[hsl(var(--gob-gray-600))]">
              Presidencia del Consejo de Ministros
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[hsl(var(--gob-gray-700))] mb-2"
              >
                Usuario
              </label>
              <div className="relative">
                <Icon
                  icon="mdi:account"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--gob-gray-500))] text-xl"
                />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[hsl(var(--gob-gray-300))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--gob-red))] focus:border-transparent outline-none transition-all"
                  placeholder="Ingrese su usuario"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[hsl(var(--gob-gray-700))] mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <Icon
                  icon="mdi:lock"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--gob-gray-500))] text-xl"
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-[hsl(var(--gob-gray-300))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--gob-red))] focus:border-transparent outline-none transition-all"
                  placeholder="Ingrese su contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--gob-gray-500))] hover:text-[hsl(var(--gob-gray-700))] transition-colors"
                >
                  <Icon
                    icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'}
                    className="text-xl"
                  />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[hsl(var(--gob-red))] hover:bg-[hsl(var(--gob-red-dark))] text-white font-medium py-3 rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              Iniciar Sesión
            </button>
          </form>
            {error && (<p className='text-red-400 text-sm text-center mt-4 font-semibold'>{error}</p>)}

          {/* <div className="mt-6 text-center">
            <a
              href="#"
              className="text-sm text-[hsl(var(--gob-red))] hover:text-[hsl(var(--gob-red-dark))] transition-colors"
            >
              ¿Olvidó su contraseña?
            </a>
          </div> */}
        </div>

        {/* <div className="mt-6 text-center text-sm text-[hsl(var(--gob-gray-600))]">
          <p>Sistema Oficial del Estado Peruano</p>
        </div> */}
      </div>
    </div>
  );
}
