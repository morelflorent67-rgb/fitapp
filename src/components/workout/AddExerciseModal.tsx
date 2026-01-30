import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Video, Clock, FileText, Search, BookOpen, ChevronLeft, Target } from 'lucide-react';
import { Exercise, ExerciseCategory, ExerciseTemplate } from '@/types/workout';
import { exerciseLibrary } from '@/data/exerciseLibrary';
import { useWorkoutStore } from '@/hooks/useWorkoutStore';
import { cn } from '@/lib/utils';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (exercise: Exercise) => void;
  sessionId: string;
}

const CATEGORIES: { value: ExerciseCategory; label: string; icon: string }[] = [
  { value: 'warmup', label: 'Échauffement', icon: '🔥' },
  { value: 'main', label: 'Début de séance', icon: '💪' },
  { value: 'superset', label: 'Superset', icon: '⚡' },
  { value: 'finisher', label: 'Finisher', icon: '🏁' },
];

// Helper pour parser le temps de repos en secondes
const parseRestTimeToSeconds = (restTime: string): number => {
  if (!restTime) return 90;
  const lower = restTime.toLowerCase().trim();
  const minSecMatch = lower.match(/(\d+)\s*min\s*(\d+)?/);
  if (minSecMatch) {
    const mins = parseInt(minSecMatch[1]) || 0;
    const secs = parseInt(minSecMatch[2]) || 0;
    return mins * 60 + secs;
  }
  const secMatch = lower.match(/(\d+)\s*s/);
  if (secMatch) return parseInt(secMatch[1]) || 0;
  const numMatch = lower.match(/^(\d+)$/);
  if (numMatch) return parseInt(numMatch[1]) || 90;
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

type Mode = 'library' | 'manual' | 'customize';

export function AddExerciseModal({ isOpen, onClose, onAdd, sessionId }: AddExerciseModalProps) {
  const { customExercises } = useWorkoutStore();
  const [mode, setMode] = useState<Mode>('library');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected exercise from library (for customization)
  const [selectedTemplate, setSelectedTemplate] = useState<ExerciseTemplate | null>(null);

  // Form state (used for both manual and customize modes)
  const [name, setName] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [restTime, setRestTime] = useState('1 min 30');
  const [videoUrl, setVideoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<ExerciseCategory>('main');
  const [targetWeight, setTargetWeight] = useState('');

  // Combine default and custom exercises
  const allExercises = useMemo(() => [...exerciseLibrary, ...customExercises], [customExercises]);

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

  const handleSelectFromLibrary = (template: ExerciseTemplate) => {
    // Pre-fill form with template values
    setSelectedTemplate(template);
    setName(template.name);
    setSets(String(template.defaultSets));
    setReps(String(template.defaultReps));
    setRestTime(template.defaultRestTime || '1 min 30');
    setVideoUrl(template.videoUrl || '');
    setNotes(template.notes || '');
    setMode('customize');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) return;

    const newExercise: Exercise = {
      id: `${sessionId}-${Date.now()}`,
      name: name.trim(),
      sets: isNaN(parseInt(sets)) ? sets : parseInt(sets),
      reps: reps,
      restTime: restTime.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      category,
      targetWeight: targetWeight ? parseFloat(targetWeight) : undefined,
    };

    onAdd(newExercise);
    resetAndClose();
  };

  const resetForm = () => {
    setName('');
    setSets('3');
    setReps('10');
    setRestTime('1 min 30');
    setVideoUrl('');
    setNotes('');
    setCategory('main');
    setTargetWeight('');
    setSelectedTemplate(null);
  };

  const resetAndClose = () => {
    resetForm();
    setSearchQuery('');
    setMode('library');
    onClose();
  };

  const goBackToLibrary = () => {
    resetForm();
    setMode('library');
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="w-full max-w-md bg-card rounded-t-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              {mode === 'customize' ? (
                <button
                  onClick={goBackToLibrary}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Retour</span>
                </button>
              ) : (
                <h2 className="font-display font-bold text-xl text-foreground">
                  Ajouter un exercice
                </h2>
              )}
              <button
                onClick={resetAndClose}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {mode === 'library' && (
              <>
                {/* Mode Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setMode('library')}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium bg-primary text-primary-foreground"
                  >
                    <BookOpen className="w-4 h-4" />
                    Bibliothèque
                  </button>
                  <button
                    onClick={() => setMode('manual')}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium bg-secondary text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Manuel
                  </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un exercice..."
                    className="w-full bg-secondary rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Exercise List */}
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                  {filteredExercises.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucun exercice trouvé
                    </div>
                  ) : (
                    filteredExercises.map((exercise) => (
                      <button
                        key={exercise.id}
                        onClick={() => handleSelectFromLibrary(exercise)}
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
                    ))
                  )}
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  {allExercises.length} exercices disponibles
                </p>
              </>
            )}

            {(mode === 'manual' || mode === 'customize') && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'manual' && (
                  /* Mode Toggle for manual */
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setMode('library')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium bg-secondary text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      Bibliothèque
                    </button>
                    <button
                      type="button"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium bg-primary text-primary-foreground"
                    >
                      <Plus className="w-4 h-4" />
                      Manuel
                    </button>
                  </div>
                )}

                {mode === 'customize' && (
                  <div className="text-center mb-4">
                    <h3 className="font-display font-semibold text-lg text-foreground">
                      {selectedTemplate?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Personnalise avant d'ajouter
                    </p>
                  </div>
                )}

                {/* Category Selection */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Catégorie
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                          category === cat.value
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

                {/* Exercise Name (only for manual mode) */}
                {mode === 'manual' && (
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Nom de l'exercice
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Développé Couché"
                      className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                )}

                {/* Sets & Reps */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Séries
                    </label>
                    <div className="flex items-center bg-secondary rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          const current = parseInt(sets) || 0;
                          if (current > 1) setSets(String(current - 1));
                        }}
                        className="p-3 hover:bg-muted transition-colors"
                      >
                        <Minus className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <input
                        type="text"
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                        placeholder="3"
                        className="flex-1 bg-transparent px-2 py-3 text-foreground text-center font-display font-semibold focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const current = parseInt(sets) || 0;
                          setSets(String(current + 1));
                        }}
                        className="p-3 hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Reps
                    </label>
                    <div className="flex items-center bg-secondary rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          const current = parseInt(reps) || 0;
                          if (current > 1) setReps(String(current - 1));
                        }}
                        className="p-3 hover:bg-muted transition-colors"
                      >
                        <Minus className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <input
                        type="text"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        placeholder="10, 8-12..."
                        className="flex-1 bg-transparent px-2 py-3 text-foreground text-center font-display font-semibold focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const current = parseInt(reps) || 0;
                          setReps(String(current + 1));
                        }}
                        className="p-3 hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Target Weight */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    <Target className="w-4 h-4 inline mr-1" />
                    Poids cible (kg)
                  </label>
                  <input
                    type="number"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    placeholder="Ex: 30"
                    step="0.5"
                    min="0"
                    className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Rest Time */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Temps de repos
                  </label>
                  <div className="flex items-center bg-secondary rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        const currentSecs = parseRestTimeToSeconds(restTime);
                        const newSecs = Math.max(0, currentSecs - 15);
                        setRestTime(formatSecondsToRestTime(newSecs));
                      }}
                      className="p-3 hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <input
                      type="text"
                      value={restTime}
                      onChange={(e) => setRestTime(e.target.value)}
                      placeholder="1 min 30"
                      className="flex-1 bg-transparent px-2 py-3 text-foreground text-center focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const currentSecs = parseRestTimeToSeconds(restTime);
                        const newSecs = currentSecs + 15;
                        setRestTime(formatSecondsToRestTime(newSecs));
                      }}
                      className="p-3 hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    <Video className="w-4 h-4 inline mr-1" />
                    Lien vidéo (optionnel)
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Notes (optionnel)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Conseils d'exécution..."
                    rows={2}
                    className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-lg flex items-center justify-center gap-2 button-glow hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter l'exercice
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
