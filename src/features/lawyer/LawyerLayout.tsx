import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthAPI } from '@/shared/api/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Calendar, 
  Settings, 
  LogOut,
  Bell
} from 'lucide-react';

interface LawyerLayoutProps {
  children: React.ReactNode;
}

function LawyerLayout({ children }: LawyerLayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    AuthAPI.logoutLawyer();
    window.location.reload();
  };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dossiers', label: 'Dossiers', icon: FolderOpen },
    { href: '/calendrier', label: 'Calendrier', icon: Calendar },
    { href: '/parametres', label: 'Paramètres', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') return currentPath === '/';
    return currentPath.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold text-primary">
              ⚖️ LegalPulse Pro
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
              >
                3
              </Badge>
            </Button>
            
            <div className="flex items-center gap-2 text-sm">
              <div className="text-right">
                <div className="font-medium">Maître Dubois</div>
                <div className="text-xs text-muted-foreground">SCP Dubois & Associés</div>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card/30 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default LawyerLayout;