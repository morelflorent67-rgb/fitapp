import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Trophy,
  Plus,
  ChevronDown,
  ChevronRight,
  Clock,
  Award,
  Settings2,
  Trash2
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { RestTimer } from '@/components/workout/RestTimer';
import { AddExerciseModal } from '@/components/workout/AddExerciseModal';
import { useWorkoutStore } from '@/hooks/useWorkoutStore';
import { WorkoutEntry, ExerciseLog, ExerciseCategory } from '@/types/workout';
import { toast } from 'sonner';

const CATEGORY_ORDER: ExerciseCategory[] = ['warmup', 'main', 'superset', 'finisher'];
const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  warmup: 'Échauffement',
  main: 'Début de séance',
  superset: 'Superset',
  finisher: 'Finisher',
};
const CATEGORY_ICONS: Record<ExerciseCategory, string> = {
  warmup: '🔥',
  main: '💪',
  superset: '⚡',
  finisher: '🏁',
};

export default function WorkoutPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const {
    getSession,
    getLastWeightForExercise,
    getPersonalRecord,
    startWorkout,
    completeWorkout,
    addExerciseToSession
  } = useWorkoutStore();

  const [workout, setWorkout] = useState<WorkoutEntry | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timerDuration, setTimerDuration] = useState(90);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [newRecords, setNewRecords] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);

  // Chronomètre de durée de séance
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSession = sessionId ? getSession(sessionId) : null;

  // Démarrer le chronomètre et initialiser la séance
  useEffect(() => {
    if (currentSession && !workout) {
      setWorkout(startWorkout(currentSession.id));
      startTimeRef.current = Date.now();

      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentSession]);

  // Auto-collapse categories when all exercises are completed
  useEffect(() => {
    if (!workout) return;

    const groupedExercises = workout.exercises.reduce((acc, exercise) => {
      const category = exercise.category || 'main';
      if (!acc[category]) acc[category] = [];
      acc[category].push(exercise);
      return acc;
    }, {} as Record<string, ExerciseLog[]>);

    const newCollapsed = new Set<string>();
    Object.entries(groupedExercises).forEach(([category, exercises]) => {
      const allCompleted = exercises.every(e => e.completed);
      if (allCompleted && exercises.length > 0) {
        newCollapsed.add(category);
      }
    });

    setCollapsedCategories(newCollapsed);
  }, [workout?.exercises.map(e => e.completed).join(',')]);

  const handleExerciseChange = (index: number, updated: ExerciseLog) => {
    if (!workout) return;
    const newExercises = [...workout.exercises];
    newExercises[index] = updated;
    setWorkout({ ...workout, exercises: newExercises });
  };

  const handleComplete = () => {
    if (!workout) return;

    // Ajouter la durée à l'entrée
    const completedWorkout = { ...workout, duration: elapsedTime };
    const records = completeWorkout(completedWorkout);

    if (records && records.length > 0) {
      setNewRecords(records);
      records.forEach(exerciseName => {
        toast.success(`Nouveau record sur ${exerciseName} !`, {
          icon: '🏆',
          duration: 5000
        });
      });
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setShowComplete(true);
  };

  const handleAddExercise = (exercise: any) => {
    if (!currentSession || !workout) return;
    addExerciseToSession(currentSession.id, exercise);

    const newExerciseLog: ExerciseLog = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      restTime: exercise.restTime,
      weight: 0,
      completed: false,
      videoUrl: exercise.videoUrl,
      category: exercise.category,
      notes: exercise.notes
    };
    setWorkout({ ...workout, exercises: [...workout.exercises, newExerciseLog] });
  };

  const handleRemoveExercise = (index: number) => {
    if (!workout) return;
    const newExercises = workout.exercises.filter((_, i) => i !== index);
    setWorkout({ ...workout, exercises: newExercises });
    toast.success('Exercice supprimé');
  };

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const openTimerWithDuration = (duration?: string) => {
    if (duration) {
      // Parse duration string like "1 min 30", "2 min", "45 s"
      let seconds = 90;
      const minMatch = duration.match(/(\d+)\s*min/);
      const secMatch = duration.match(/(\d+)\s*s(?:ec)?/);

      if (minMatch) {
        seconds = parseInt(minMatch[1]) * 60;
      }
      if (secMatch) {
        seconds += parseInt(secMatch[1]);
      }
      setTimerDuration(seconds);
    } else {
      setTimerDuration(90);
    }
    setShowTimer(true);
  };

  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Group exercises by category
  const groupedExercises = workout?.exercises.reduce((acc, exercise, index) => {
    const category = exercise.category || 'main';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ exercise, index });
    return acc;
  }, {} as Record<string, { exercise: ExerciseLog; index: number }[]>) || {};

  const allCompleted = workout?.exercises.every(e => e.completed) ?? false;
  const completedCount = workout?.exercises.filter(e => e.completed).length ?? 0;
  const totalCount = workout?.exercises.length ?? 0;

  if (showComplete) {
    return (
      <PageContainer className="flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
            className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Trophy className="w-12 h-12 text-primary" />
          </motion.div>
          <h1 className="font-display font-bold text-3xl text-foreground mb-2">
            Bien joué ! 🔥
          </h1>
          <p className="text-muted-foreground mb-4">
            Séance terminée en {formatElapsedTime(elapsedTime)}
          </p>

          {newRecords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-yellow-500/20 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center justify-center gap-2 text-yellow-500 mb-2">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Nouveaux records !</span>
              </div>
              <div className="text-sm text-yellow-400">
                {newRecords.map((name, i) => (
                  <div key={i}>{name}</div>
                ))}
              </div>
            </motion.div>
          )}

          <button
            onClick={() => navigate('/')}
            className="bg-primary text-primary-foreground font-semibold py-4 px-8 rounded-lg button-glow"
          >
            Retour à l'accueil
          </button>
        </motion.div>
      </PageContainer>
    );
  }

  if (!currentSession || !workout) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground mb-4">Séance introuvable</p>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            Retour à l'accueil
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-xl text-foreground">
            {currentSession.name}
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{completedCount}/{totalCount} exercices</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatElapsedTime(elapsedTime)}
            </span>
          </div>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            editMode ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
          }`}
        >
          <Settings2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowAddExercise(true)}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center button-glow"
        >
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-secondary rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(completedCount / totalCount) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Exercises grouped by category (collapsible) */}
      <div className="space-y-4 mb-6">
        {CATEGORY_ORDER.map(category => {
          const exercises = groupedExercises[category];
          if (!exercises || exercises.length === 0) return null;

          const categoryCompletedCount = exercises.filter(e => e.exercise.completed).length;
          const isCollapsed = collapsedCategories.has(category);
          const allCategoryCompleted = categoryCompletedCount === exercises.length;

          return (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  allCategoryCompleted
                    ? 'bg-primary/20 text-primary'
                    : 'bg-card text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{CATEGORY_ICONS[category]}</span>
                  <span className="font-medium">{CATEGORY_LABELS[category]}</span>
                  <span className="text-sm text-muted-foreground">
                    ({categoryCompletedCount}/{exercises.length})
                  </span>
                </div>
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 mt-3"
                  >
                    {exercises.map(({ exercise, index }) => (
                      <div key={exercise.exerciseId} className="relative">
                        {editMode && (
                          <button
                            onClick={() => handleRemoveExercise(index)}
                            className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <ExerciseCard
                          exercise={exercise}
                          previousWeight={getLastWeightForExercise(exercise.exerciseName)}
                          personalRecord={getPersonalRecord(exercise.exerciseName)}
                          onChange={(updated) => handleExerciseChange(index, updated)}
                          index={index}
                          onTimerOpen={() => openTimerWithDuration(exercise.restTime)}
                        />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Exercises without category */}
        {Object.keys(groupedExercises).filter(cat => !CATEGORY_ORDER.includes(cat as ExerciseCategory)).map(category => {
          const exercises = groupedExercises[category];
          return (
            <div key={category} className="space-y-4">
              {exercises.map(({ exercise, index }) => (
                <div key={exercise.exerciseId} className="relative">
                  {editMode && (
                    <button
                      onClick={() => handleRemoveExercise(index)}
                      className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <ExerciseCard
                    exercise={exercise}
                    previousWeight={getLastWeightForExercise(exercise.exerciseName)}
                    personalRecord={getPersonalRecord(exercise.exerciseName)}
                    onChange={(updated) => handleExerciseChange(index, updated)}
                    index={index}
                    onTimerOpen={() => openTimerWithDuration(exercise.restTime)}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Complete Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={handleComplete}
        disabled={!allCompleted}
        className={`w-full font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
          allCompleted
            ? 'bg-primary text-primary-foreground button-glow hover:scale-[1.02] active:scale-[0.98]'
            : 'bg-secondary text-muted-foreground cursor-not-allowed'
        }`}
      >
        <CheckCircle2 className="w-5 h-5" />
        {allCompleted ? 'Terminer la séance' : `${totalCount - completedCount} exercice(s) restant(s)`}
      </motion.button>

      {/* Rest Timer Modal */}
      <RestTimer
        isOpen={showTimer}
        onClose={() => setShowTimer(false)}
        defaultSeconds={timerDuration}
      />

      {/* Add Exercise Modal */}
      <AddExerciseModal
        isOpen={showAddExercise}
        onClose={() => setShowAddExercise(false)}
        onAdd={handleAddExercise}
        sessionId={currentSession.id}
      />
    </PageContainer>
  );
}
