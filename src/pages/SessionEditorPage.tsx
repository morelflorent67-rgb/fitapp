import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  GripVertical,
  Save,
  Video,
  Clock,
  Copy,
  ChevronDown,
  BookOpen,
  FileText,
  Target
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useWorkoutStore } from '@/hooks/useWorkoutStore';
import { Exercise, ExerciseCategory, Session } from '@/types/workout';
import { exerciseLibrary } from '@/data/exerciseLibrary';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CATEGORIES: { value: ExerciseCategory; label: string; icon: string }[] = [
  { value: 'warmup', label: 'Échauffement', icon: '🔥' },
  { value: 'main', label: 'Début de séance', icon: '💪' },
  { value: 'superset', label: 'Superset', icon: '⚡' },
  { value: 'finisher', label: 'Finisher', icon: '🏁' },
];

interface ExerciseFormData {
  id: string;
  name: string;
  sets: string;
  reps: string;
  restTime: string;
  videoUrl: string;
  notes: string;
  category: ExerciseCategory;
  targetWeight: string;
}

const createEmptyExercise = (): ExerciseFormData => ({
  id: Date.now().toString(),
  name: '',
  sets: '3',
  reps: '10',
  restTime: '1 min 30',
  videoUrl: '',
  notes: '',
  category: 'main',
  targetWeight: '',
});

// Helper pour parser le temps de repos en secondes
const parseRestTimeToSeconds = (restTime: string): number => {
  if (!restTime) return 90; // Default 1 min 30
  const lower = restTime.toLowerCase().trim();

  // Format "X min Y" ou "X min Y s"
  const minSecMatch = lower.match(/(\d+)\s*min\s*(\d+)?/);
  if (minSecMatch) {
    const mins = parseInt(minSecMatch[1]) || 0;
    const secs = parseInt(minSecMatch[2]) || 0;
    return mins * 60 + secs;
  }

  // Format "X s" ou "Xs"
  const secMatch = lower.match(/(\d+)\s*s/);
  if (secMatch) {
    return parseInt(secMatch[1]) || 0;
  }

  // Juste un nombre (on suppose des secondes)
  const numMatch = lower.match(/^(\d+)$/);
  if (numMatch) {
    return parseInt(numMatch[1]) || 90;
  }

  return 90;
};

// Helper pour formater les secondes en temps lisible
const formatSecondsToRestTime = (seconds: number): string => {
  if (seconds <= 0) return '0 s';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins === 0) return `${secs} s`;
  if (secs === 0) return `${mins} min`;
  return `${mins} min ${secs}`;
};

export default function SessionEditorPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { getSession, addSession, updateSession, deleteSession, duplicateSession, customExercises } = useWorkoutStore();

  const isEditing = !!sessionId;
  const existingSession = sessionId ? getSession(sessionId) : null;

  const [sessionName, setSessionName] = useState('');
  const [exercises, setExercises] = useState<ExerciseFormData[]>([createEmptyExercise()]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Combine default and custom exercises
  const allExercises = useMemo(() => [...exerciseLibrary, ...customExercises], [customExercises]);

  // Load existing session data
  useEffect(() => {
    if (existingSession) {
      setSessionName(existingSession.name);
      setExercises(
        existingSession.exercises.map(ex => ({
          id: ex.id,
          name: ex.name,
          sets: String(ex.sets),
          reps: String(ex.reps),
          restTime: ex.restTime || '',
          videoUrl: ex.videoUrl || '',
          notes: ex.notes || '',
          category: ex.category || 'main',
          targetWeight: ex.targetWeight ? String(ex.targetWeight) : '',
        }))
      );
    }
  }, [existingSession]);

  const handleAddExercise = () => {
    const newExercise = createEmptyExercise();
    setExercises([...exercises, newExercise]);
    setExpandedExercise(newExercise.id);
  };

  const handleAddFromLibrary = (template: typeof exerciseLibrary[0]) => {
    const newExercise: ExerciseFormData = {
      id: Date.now().toString(),
      name: template.name,
      sets: String(template.defaultSets),
      reps: String(template.defaultReps),
      restTime: template.defaultRestTime || '1 min 30',
      videoUrl: template.videoUrl || '',
      notes: template.notes || '',
      category: 'main',
      targetWeight: '',
    };
    setExercises([...exercises, newExercise]);
    setExpandedExercise(newExercise.id);
    setShowLibrary(false);
    setSearchQuery('');
  };

  const handleRemoveExercise = (id: string) => {
    if (exercises.length <= 1) {
      toast.error('Une séance doit avoir au moins un exercice');
      return;
    }
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleExerciseChange = (id: string, field: keyof ExerciseFormData, value: string) => {
    setExercises(exercises.map(ex =>
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const handleSave = () => {
    // Validation
    if (!sessionName.trim()) {
      toast.error('Le nom de la séance est requis');
      return;
    }

    const validExercises = exercises.filter(ex => ex.name.trim());
    if (validExercises.length === 0) {
      toast.error('Ajoutez au moins un exercice avec un nom');
      return;
    }

    const sessionData: Session = {
      id: sessionId || Date.now().toString(),
      name: sessionName.trim(),
      exercises: validExercises.map(ex => ({
        id: ex.id,
        name: ex.name.trim(),
        sets: isNaN(parseInt(ex.sets)) ? ex.sets : parseInt(ex.sets),
        reps: ex.reps,
        restTime: ex.restTime || undefined,
        videoUrl: ex.videoUrl || undefined,
        notes: ex.notes || undefined,
        category: ex.category,
        targetWeight: ex.targetWeight ? parseFloat(ex.targetWeight) : undefined,
      })),
    };

    try {
      if (isEditing) {
        updateSession(sessionId!, sessionData);
        toast.success('Séance mise à jour');
      } else {
        addSession(sessionData);
        toast.success('Séance créée');
      }

      // Petit délai pour s'assurer que le state est sauvegardé avant la navigation
      setTimeout(() => {
        navigate('/');
      }, 100);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = () => {
    if (!sessionId) return;
    deleteSession(sessionId);
    toast.success('Séance supprimée');
    navigate('/');
  };

  const handleDuplicate = () => {
    if (!sessionId) return;
    duplicateSession(sessionId);
    toast.success('Séance dupliquée');
    navigate('/');
  };

  // Filter exercises
  const filteredExercises = useMemo(() => {
    if (!searchQuery) return allExercises;
    const query = searchQuery.toLowerCase();
    return allExercises.filter(ex =>
      ex.name.toLowerCase().includes(query) ||
      ex.muscleGroup?.toLowerCase().includes(query) ||
      ex.notes?.toLowerCase().includes(query)
    );
  }, [allExercises, searchQuery]);

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
            {isEditing ? 'Modifier la séance' : 'Nouvelle séance'}
          </h1>
        </div>
        <button
          onClick={handleSave}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center button-glow"
        >
          <Save className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* Session Name */}
      <div className="mb-6">
        <label className="text-sm text-muted-foreground mb-2 block">
          Nom de la séance
        </label>
        <input
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          placeholder="Ex: Haut du corps, Push, Legs..."
          className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Exercises List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm text-muted-foreground">
            Exercices ({exercises.length})
          </label>
        </div>

        <Reorder.Group
          axis="y"
          values={exercises}
          onReorder={setExercises}
          className="space-y-3"
        >
          {exercises.map((exercise, index) => (
            <Reorder.Item
              key={exercise.id}
              value={exercise}
              className="bg-card rounded-lg border border-border overflow-hidden"
            >
              {/* Exercise Header */}
              <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => setExpandedExercise(
                  expandedExercise === exercise.id ? null : exercise.id
                )}
              >
                <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium truncate",
                    exercise.name ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {exercise.name || `Exercice ${index + 1}`}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{exercise.sets}×{exercise.reps}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full",
                      exercise.category === 'warmup' && 'bg-amber-500/20 text-amber-400',
                      exercise.category === 'main' && 'bg-primary/20 text-primary',
                      exercise.category === 'superset' && 'bg-purple-500/20 text-purple-400',
                      exercise.category === 'finisher' && 'bg-red-500/20 text-red-400',
                    )}>
                      {CATEGORIES.find(c => c.value === exercise.category)?.icon}
                    </span>
                    {exercise.videoUrl && <Video className="w-3 h-3 text-primary" />}
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform",
                    expandedExercise === exercise.id && "rotate-180"
                  )}
                />
              </div>

              {/* Exercise Details (Expanded) */}
              <AnimatePresence>
                {expandedExercise === exercise.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border"
                  >
                    <div className="p-4 space-y-4">
                      {/* Exercise Name */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">
                          Nom de l'exercice
                        </label>
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(e) => handleExerciseChange(exercise.id, 'name', e.target.value)}
                          placeholder="Ex: Développé couché"
                          className="w-full bg-secondary border-0 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      {/* Sets & Reps */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">
                            Séries
                          </label>
                          <div className="flex items-center bg-secondary rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() => {
                                const current = parseInt(exercise.sets) || 0;
                                if (current > 1) handleExerciseChange(exercise.id, 'sets', String(current - 1));
                              }}
                              className="p-2 hover:bg-muted transition-colors"
                            >
                              <Minus className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <input
                              type="text"
                              value={exercise.sets}
                              onChange={(e) => handleExerciseChange(exercise.id, 'sets', e.target.value)}
                              className="flex-1 bg-transparent border-0 px-2 py-2 text-foreground text-center focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const current = parseInt(exercise.sets) || 0;
                                handleExerciseChange(exercise.id, 'sets', String(current + 1));
                              }}
                              className="p-2 hover:bg-muted transition-colors"
                            >
                              <Plus className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">
                            Reps
                          </label>
                          <div className="flex items-center bg-secondary rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() => {
                                const current = parseInt(exercise.reps) || 0;
                                if (current > 1) handleExerciseChange(exercise.id, 'reps', String(current - 1));
                              }}
                              className="p-2 hover:bg-muted transition-colors"
                            >
                              <Minus className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <input
                              type="text"
                              value={exercise.reps}
                              onChange={(e) => handleExerciseChange(exercise.id, 'reps', e.target.value)}
                              placeholder="10, 8-12..."
                              className="flex-1 bg-transparent border-0 px-2 py-2 text-foreground text-center focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const current = parseInt(exercise.reps) || 0;
                                handleExerciseChange(exercise.id, 'reps', String(current + 1));
                              }}
                              className="p-2 hover:bg-muted transition-colors"
                            >
                              <Plus className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Target Weight */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          Poids cible (kg)
                        </label>
                        <input
                          type="number"
                          value={exercise.targetWeight}
                          onChange={(e) => handleExerciseChange(exercise.id, 'targetWeight', e.target.value)}
                          placeholder="Ex: 30"
                          step="0.5"
                          min="0"
                          className="w-full bg-secondary border-0 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      {/* Rest Time */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Temps de repos
                        </label>
                        <div className="flex items-center bg-secondary rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => {
                              const currentSecs = parseRestTimeToSeconds(exercise.restTime);
                              const newSecs = Math.max(0, currentSecs - 15);
                              handleExerciseChange(exercise.id, 'restTime', formatSecondsToRestTime(newSecs));
                            }}
                            className="p-2 hover:bg-muted transition-colors"
                          >
                            <Minus className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <input
                            type="text"
                            value={exercise.restTime}
                            onChange={(e) => handleExerciseChange(exercise.id, 'restTime', e.target.value)}
                            placeholder="1 min 30"
                            className="flex-1 bg-transparent border-0 px-2 py-2 text-foreground text-center focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const currentSecs = parseRestTimeToSeconds(exercise.restTime);
                              const newSecs = currentSecs + 15;
                              handleExerciseChange(exercise.id, 'restTime', formatSecondsToRestTime(newSecs));
                            }}
                            className="p-2 hover:bg-muted transition-colors"
                          >
                            <Plus className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">
                          Catégorie
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {CATEGORIES.map(cat => (
                            <button
                              key={cat.value}
                              onClick={() => handleExerciseChange(exercise.id, 'category', cat.value)}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                                exercise.category === cat.value
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-secondary text-muted-foreground hover:bg-muted'
                              )}
                            >
                              <span>{cat.icon}</span>
                              <span>{cat.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Video URL */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          Lien vidéo (YouTube)
                        </label>
                        <input
                          type="url"
                          value={exercise.videoUrl}
                          onChange={(e) => handleExerciseChange(exercise.id, 'videoUrl', e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full bg-secondary border-0 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          Notes / Instructions
                        </label>
                        <textarea
                          value={exercise.notes}
                          onChange={(e) => handleExerciseChange(exercise.id, 'notes', e.target.value)}
                          placeholder="Conseils d'exécution, points d'attention..."
                          rows={2}
                          className="w-full bg-secondary border-0 rounded-lg px-3 py-2 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      {/* Delete Exercise */}
                      <button
                        onClick={() => handleRemoveExercise(exercise.id)}
                        className="w-full flex items-center justify-center gap-2 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Supprimer cet exercice</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {/* Add Exercise Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowLibrary(true)}
            className="py-4 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Bibliothèque
          </button>
          <button
            onClick={handleAddExercise}
            className="py-4 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Manuel
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pb-24">
        <button
          onClick={handleSave}
          className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-lg button-glow flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {isEditing ? 'Enregistrer les modifications' : 'Créer la séance'}
        </button>

        {isEditing && (
          <>
            <button
              onClick={handleDuplicate}
              className="w-full bg-secondary text-foreground font-semibold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-muted transition-colors"
            >
              <Copy className="w-5 h-5" />
              Dupliquer la séance
            </button>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full text-destructive font-semibold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Supprimer la séance
              </button>
            ) : (
              <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20">
                <p className="text-foreground text-center mb-3">
                  Supprimer cette séance ?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-destructive text-destructive-foreground font-semibold py-3 rounded-lg"
                  >
                    Confirmer
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-secondary text-foreground font-semibold py-3 rounded-lg"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Library Modal */}
      <AnimatePresence>
        {showLibrary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-t-2xl sm:rounded-2xl p-6 max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-xl text-foreground">
                  Bibliothèque
                </h2>
                <button
                  onClick={() => {
                    setShowLibrary(false);
                    setSearchQuery('');
                  }}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un exercice..."
                className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              />

              <div className="flex-1 overflow-y-auto space-y-2">
                {filteredExercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => handleAddFromLibrary(exercise)}
                    className="w-full bg-secondary hover:bg-muted rounded-lg p-4 text-left transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {exercise.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {exercise.defaultSets}×{exercise.defaultReps}
                          {exercise.muscleGroup && (
                            <span className="ml-2 text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                              {exercise.muscleGroup}
                            </span>
                          )}
                        </p>
                      </div>
                      <Plus className="w-5 h-5 text-primary flex-shrink-0 ml-2" />
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                {allExercises.length} exercices disponibles
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
