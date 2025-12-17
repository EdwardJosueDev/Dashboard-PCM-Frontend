import { Icon } from '@iconify/react';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { AuthService } from '../services/auth.service';
import { User } from '../services/users.service';

interface HeaderProps {
  isCollapsed: boolean;
}

export default function Header({ isCollapsed }: HeaderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const {logout} = useAuth()

  useEffect(() => {
    AuthService.getProfile().then((user)=>
    {
      setCurrentUser(user)
    })
  }, [])

  const handleLogout = () => {
    logout()
  };

  return (
    <header
      className={`fixed top-0 right-0 h-20 bg-white border-b border-[hsl(var(--border))] shadow-sm transition-all duration-300 z-30 ${
        isCollapsed ? 'left-20' : 'left-[280px]'
      }`}
    >
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex-1 items-center gap-6 mx-4">
            <img
              src="/images/logo.svg"
              alt="Banner institucional"
              className="h-12 object-contain"
            />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-[hsl(var(--gob-gray-100))] rounded-lg">
            <Icon icon="mdi:account-circle" className="text-2xl text-[hsl(var(--gob-gray-600))]" />
            <div className="text-sm">
              <p className="font-medium text-[hsl(var(--gob-gray-900))]">{currentUser?.fullName}</p>
              <p className="text-xs text-[hsl(var(--gob-gray-600))]">{currentUser?.role.name}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--gob-red))] hover:bg-[hsl(var(--gob-red-dark))] text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
            title="Cerrar Sesión"
          >
            <Icon icon="mdi:logout" className="text-xl" />
            <span className="hidden sm:inline font-medium text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}
