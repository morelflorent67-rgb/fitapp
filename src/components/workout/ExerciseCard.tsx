import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronUp, ChevronDown, Timer, Video, Trophy, Info, Target } from 'lucide-react';
import { ExerciseLog, ExerciseCategory, PersonalRecord } from '@/types/workout';
import { VideoPlayer } from './VideoPlayer';
import { cn } from '@/lib/utils';

interface ExerciseCardProps {
  exercise: ExerciseLog;
  previousWeight: number | null;
  personalRecord?: PersonalRecord | null;
  onChange: (updated: ExerciseLog) => void;
  index: number;
  onTimerOpen: () => void;
}

const CATEGORY_COLORS: Record<ExerciseCategory, string> = {
  warmup: 'bg-amber-500/20 text-amber-400',
  main: 'bg-primary/20 text-primary',
  superset: 'bg-purple-500/20 text-purple-400',
  finisher: 'bg-red-500/20 text-red-400',
};

export function ExerciseCard({
  exercise,
  previousWeight,
  personalRecord,
  onChange,
  index,
  onTimerOpen
}: ExerciseCardProps) {
  const [weight, setWeight] = useState(exercise.weight || previousWeight || 0);
  const [showNotes, setShowNotes] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const isFirstRender = useRef(true);

  // Only update parent when weight changes (not on initial render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Set initial weight from previous or 0
      if (previousWeight && exercise.weight === 0) {
        onChange({ ...exercise, weight: previousWeight });
      }
      return;
    }
    onChange({ ...exercise, weight });
  }, [weight]);

  const incrementWeight = () => setWeight(prev => prev + 2.5);
  const decrementWeight = () => setWeight(prev => Math.max(0, prev - 2.5));

  const toggleComplete = () => {
    onChange({ ...exercise, weight, completed: !exercise.completed });
    // Timer n'est plus lancé automatiquement - uniquement via le bouton manuel
  };

  const isNewRecord = personalRecord && weight > personalRecord.weight;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className={cn(
          "bg-card rounded-lg p-5 gradient-border transition-all duration-300",
          exercise.completed && "opacity-60"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={cn(
                "font-display font-semibold text-lg text-foreground transition-all",
                exercise.completed && "line-through text-muted-foreground"
              )}>
                {exercise.exerciseName}
              </h3>
              {exercise.videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                  title="Voir la vidéo"
                >
                  <Video className="w-4 h-4 text-primary" />
                </button>
              )}
              {exercise.notes && (
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                    showNotes ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:bg-muted"
                  )}
                  title="Notes"
                >
                  <Info className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-muted-foreground">
                {exercise.sets} séries × {exercise.reps}
              </p>
              {exercise.restTime && exercise.restTime !== '0' && (
                <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  {exercise.restTime}
                </span>
              )}
            </div>

            {/* Notes */}
            <AnimatePresence>
              {showNotes && exercise.notes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 p-3 bg-secondary/50 rounded-lg"
                >
                  <p className="text-sm text-muted-foreground">{exercise.notes}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTimerOpen}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
              title="Timer de repos"
            >
              <Timer className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={toggleComplete}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                exercise.completed
                  ? "bg-primary text-primary-foreground button-glow"
                  : "bg-secondary text-muted-foreground hover:bg-muted"
              )}
            >
              <Check className="w-5 h-5" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {!exercise.completed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5"
            >
              {/* Target weight, Previous weight & PR info */}
              <div className="flex items-center gap-4 mb-3 flex-wrap">
                {exercise.targetWeight !== undefined && exercise.targetWeight > 0 && (
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-muted-foreground">Cible :</span>
                    <span className="text-sm font-medium text-blue-400">{exercise.targetWeight} kg</span>
                  </div>
                )}
                {previousWeight !== null && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Dernière fois :</span>
                    <span className="text-sm font-medium text-primary">{previousWeight} kg</span>
                  </div>
                )}
                {personalRecord && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs text-muted-foreground">Record :</span>
                    <span className="text-sm font-medium text-yellow-500">{personalRecord.weight} kg</span>
                  </div>
                )}
              </div>

              {/* Weight input */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Poids :</span>
                <div className="flex items-center bg-secondary rounded-lg overflow-hidden">
                  <button
                    onClick={decrementWeight}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-20 text-center bg-transparent text-xl font-display font-semibold text-foreground focus:outline-none"
                    step="0.5"
                  />
                  <button
                    onClick={incrementWeight}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">kg</span>

                {/* New record indicator */}
                {isNewRecord && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 text-yellow-500"
                  >
                    <Trophy className="w-4 h-4" />
                    <span className="text-xs font-medium">Nouveau PR !</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Video Player Modal */}
      {exercise.videoUrl && (
        <VideoPlayer
          isOpen={showVideo}
          onClose={() => setShowVideo(false)}
          videoUrl={exercise.videoUrl}
          exerciseName={exercise.exerciseName}
        />
      )}
    </>
  );
}
