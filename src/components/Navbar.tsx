
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navItems = [
  {
    label: 'Dossiers',
    path: '/',
    description: 'Gérer vos contentieux'
  },
  {
    label: 'Clients',
    path: '/clients',
    description: 'Base de données clients'
  },
  {
    label: 'Calendrier',
    path: '/calendrier',
    description: 'Échéances et audiences'
  },
  {
    label: 'Paramètres',
    path: '/parametres',
    description: 'Configuration'
  }
];

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">JusticeApp</h1>
              <p className="text-xs text-gray-500">Gestion juridique</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-purple-100 text-purple-700 shadow-sm" 
                      : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden sm:flex">
              Barreau de Paris
            </Badge>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm font-medium">ME</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                    isActive 
                      ? "bg-purple-100 text-purple-700" 
                      : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
