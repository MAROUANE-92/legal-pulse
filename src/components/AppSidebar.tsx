
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { FileText, Users, Calendar, Settings } from 'lucide-react';

const navItems = [
  {
    label: 'Dossiers',
    path: '/',
    description: 'Gérer vos contentieux',
    icon: FileText,
  },
  {
    label: 'Clients',
    path: '/clients',
    description: 'Base de données clients',
    icon: Users,
  },
  {
    label: 'Calendrier',
    path: '/calendrier',
    description: 'Échéances et audiences',
    icon: Calendar,
  },
  {
    label: 'Paramètres',
    path: '/parametres',
    description: 'Configuration',
    icon: Settings,
  }
];

export const AppSidebar = () => {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">J</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">JusticePulse</h1>
            <p className="text-xs text-gray-500">Gestion juridique</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.path}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 px-2 py-4">
          <Badge variant="secondary" className="text-xs">
            Barreau de Paris
          </Badge>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">ME</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
