import { NavLink, useLocation } from 'react-router-dom';
import { Home, BarChart3, History, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: Home, label: 'Accueil' },
  { path: '/stats', icon: BarChart3, label: 'Stats' },
  { path: '/history', icon: History, label: 'Historique' },
  { path: '/settings', icon: Settings, label: 'Réglages' },
];

export function BottomNav() {
  const location = useLocation();

  // Hide nav on workout and session editor pages
  const hideNav = location.pathname.startsWith('/workout/') ||
                  location.pathname.startsWith('/session/');

  if (hideNav) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center py-2 px-4"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className={cn(
                "w-6 h-6 transition-colors relative z-10",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-xs mt-1 transition-colors relative z-10",
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
