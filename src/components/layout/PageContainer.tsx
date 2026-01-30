import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function PageContainer({ children, className, title, subtitle }: PageContainerProps) {
  return (
    <div className={cn("min-h-screen pb-24 px-4 pt-6", className)}>
      {(title || subtitle) && (
        <header className="mb-6">
          {title && (
            <h1 className="font-display font-bold text-2xl text-foreground">{title}</h1>
          )}
          {subtitle && (
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          )}
        </header>
      )}
      {children}
    </div>
  );
}
