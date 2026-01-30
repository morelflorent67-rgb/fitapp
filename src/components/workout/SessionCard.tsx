import { motion } from 'framer-motion';
import { ChevronRight, Dumbbell } from 'lucide-react';
import { Session } from '@/types/workout';
import { cn } from '@/lib/utils';

interface SessionCardProps {
  session: Session;
  isActive?: boolean;
  onClick: () => void;
  index: number;
}

export function SessionCard({ session, isActive, onClick, index }: SessionCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onClick={onClick}
      className={cn(
        "w-full text-left p-5 rounded-lg transition-all duration-300",
        "bg-card gradient-border hover:bg-muted",
        isActive && "ring-2 ring-primary card-glow"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          )}>
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">{session.name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {session.exercises.length} exercices
            </p>
          </div>
        </div>
        <ChevronRight className={cn(
          "w-5 h-5 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground"
        )} />
      </div>
    </motion.button>
  );
}
