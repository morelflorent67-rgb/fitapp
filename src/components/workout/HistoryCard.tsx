import { motion } from 'framer-motion';
import { Calendar, Dumbbell, TrendingUp, Clock, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { WorkoutEntry } from '@/types/workout';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface HistoryCardProps {
  entry: WorkoutEntry;
  index: number;
}

export function HistoryCard({ entry, index }: HistoryCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Calculate total volume handling string reps/sets
  const totalWeight = entry.exercises.reduce((sum, ex) => {
    const sets = typeof ex.sets === 'number' ? ex.sets : parseInt(ex.sets) || 0;
    const reps = typeof ex.reps === 'number' ? ex.reps : parseInt(ex.reps) || 0;
    return sum + (ex.weight * sets * reps);
  }, 0);

  const completedExercises = entry.exercises.filter(e => e.completed).length;

  // Format duration
  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hrs > 0) {
      return `${hrs}h ${mins}min`;
    }
    return `${mins} min`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-card rounded-lg p-5 gradient-border"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-foreground">{entry.sessionName}</h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(entry.date), "d MMMM yyyy", { locale: fr })}
              </span>
              {entry.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDuration(entry.duration)}
                </span>
              )}
            </div>
          </div>
          <ChevronDown
            className={cn(
              "w-5 h-5 text-muted-foreground transition-transform",
              expanded && "rotate-180"
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary rounded-lg p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Dumbbell className="w-4 h-4" />
              <span>Exercices</span>
            </div>
            <p className="font-display font-semibold text-lg text-foreground">
              {completedExercises}/{entry.exercises.length}
            </p>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Volume</span>
            </div>
            <p className="font-display font-semibold text-lg text-foreground">
              {totalWeight > 0 ? `${totalWeight.toLocaleString()} kg` : '-'}
            </p>
          </div>
        </div>
      </button>

      {/* Expanded exercise list */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-border space-y-2"
        >
          {entry.exercises.map(ex => (
            <div key={ex.exerciseId} className="flex items-center justify-between text-sm">
              <span className={cn(
                "truncate flex-1",
                ex.completed ? "text-muted-foreground" : "text-muted-foreground/50"
              )}>
                {ex.exerciseName}
              </span>
              <div className="flex items-center gap-3 ml-2">
                <span className="text-xs text-muted-foreground">
                  {ex.sets}×{ex.reps}
                </span>
                <span className="font-medium text-foreground min-w-[60px] text-right">
                  {ex.weight > 0 ? `${ex.weight} kg` : '-'}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
