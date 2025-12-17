import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UserService } from '../services/users.service';
import { AuthService } from '../services/auth.service';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}


export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 'init', label: 'Inicio', icon: 'mdi:home', path: '/dashboard' }
  ])
    

  useEffect(() => {
    AuthService.getProfile().then((response)=>
    {
      if(["Admin", "Administrador"].includes(response.role.name))
      {
        setMenuItems([...menuItems, { 
          id: 'users', 
          label: 'Usuarios', 
          icon: 'teenyicons:users-outline', 
          path: '/users' 
        }])
      }
    })
  }, [])

  return (
    <aside
      className={`bg-[hsl(var(--sidebar-background))] h-screen fixed left-0 top-0 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-[280px]'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="h-20 flex items-center justify-between px-4 border-b border-[hsl(var(--sidebar-border))]">
          {!isCollapsed ? (
            <div className="w-full flex items-center gap-3">
          <img
            src="/images/logo-f.svg"
            className="w-12"
            alt="Bicentenario"
          />
          <div className="flextext-sm text-white leading-tight">
            <span>Bicentenario</span>
            <span> Perú</span>
            <br />
            <strong>2024</strong>
          </div>
        </div>
          ) : (
            <div className="w-auto h-15 rounded-lg flex items-center justify-center mx-auto">
              <img src="/images/logo-f.svg" alt="Gob.pe" className="h-12" />
            </div>
          )}
        </div>

        <nav className="flex-1 py-6 px-2 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-[hsl(var(--sidebar-primary))] text-white'
                        : 'text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--gob-gray-800))]'
                    } ${isCollapsed ? 'justify-center' : ''}`
                  }
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon icon={item.icon} className="text-2xl flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-[hsl(var(--sidebar-border))]">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--gob-gray-800))] transition-all"
          >
            <Icon
              icon={isCollapsed ? 'mdi:chevron-right' : 'mdi:chevron-left'}
              className="text-2xl"
            />
            {!isCollapsed && (
              <span className="font-medium text-sm">Colapsar</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
