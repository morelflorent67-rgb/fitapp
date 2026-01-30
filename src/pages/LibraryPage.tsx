import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Search,
  Edit3,
  Trash2,
  Video,
  X,
  Save
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useWorkoutStore } from '@/hooks/useWorkoutStore';
import { exerciseLibrary } from '@/data/exerciseLibrary';
import { ExerciseTemplate } from '@/types/workout';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function LibraryPage() {
  const navigate = useNavigate();
  const { customExercises, addCustomExercise, updateCustomExercise, deleteCustomExercise } = useWorkoutStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseTemplate | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formSets, setFormSets] = useState('3');
  const [formReps, setFormReps] = useState('10');
  const [formRestTime, setFormRestTime] = useState('1 min 30');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formMuscleGroup, setFormMuscleGroup] = useState('');

  // Combine default and custom exercises
  const allExercises = [...exerciseLibrary, ...customExercises];

  // Filter exercises
  const filteredExercises = allExercises.filter(ex => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      ex.name.toLowerCase().includes(query) ||
      ex.muscleGroup?.toLowerCase().includes(query) ||
      ex.notes?.toLowerCase().includes(query)
    );
  });

  const resetForm = () => {
    setFormName('');
    setFormSets('3');
    setFormReps('10');
    setFormRestTime('1 min 30');
    setFormVideoUrl('');
    setFormNotes('');
    setFormMuscleGroup('');
  };

  const openAddModal = () => {
    resetForm();
    setEditingExercise(null);
    setShowAddModal(true);
  };

  const openEditModal = (exercise: ExerciseTemplate) => {
    // Only allow editing custom exercises
    if (!exercise.id.startsWith('custom-')) {
      toast.error('Les exercices par défaut ne peuvent pas être modifiés');
      return;
    }
    setFormName(exercise.name);
    setFormSets(String(exercise.defaultSets));
    setFormReps(String(exercise.defaultReps));
    setFormRestTime(exercise.defaultRestTime || '1 min 30');
    setFormVideoUrl(exercise.videoUrl || '');
    setFormNotes(exercise.notes || '');
    setFormMuscleGroup(exercise.muscleGroup || '');
    setEditingExercise(exercise);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Le nom est requis');
      return;
    }

    const exerciseData: ExerciseTemplate = {
      id: editingExercise?.id || `custom-${Date.now()}`,
      name: formName.trim(),
      defaultSets: formSets,
      defaultReps: formReps,
      defaultRestTime: formRestTime || undefined,
      videoUrl: formVideoUrl || undefined,
      notes: formNotes || undefined,
      muscleGroup: formMuscleGroup || undefined,
    };

    if (editingExercise) {
      updateCustomExercise(editingExercise.id, exerciseData);
      toast.success('Exercice modifié');
    } else {
      addCustomExercise(exerciseData);
      toast.success('Exercice ajouté');
    }

    setShowAddModal(false);
    resetForm();
    setEditingExercise(null);
  };

  const handleDelete = (exercise: ExerciseTemplate) => {
    if (!exercise.id.startsWith('custom-')) {
      toast.error('Les exercices par défaut ne peuvent pas être supprimés');
      return;
    }
    deleteCustomExercise(exercise.id);
    toast.success('Exercice supprimé');
  };

  const isCustomExercise = (id: string) => id.startsWith('custom-');

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-xl text-foreground">
            Bibliothèque d'exercices
          </h1>
          <p className="text-sm text-muted-foreground">
            {allExercises.length} exercices ({customExercises.length} perso)
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center button-glow"
        >
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un exercice..."
          className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Exercise List */}
      <div className="space-y-3 pb-24">
        {filteredExercises.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun exercice trouvé
          </div>
        ) : (
          filteredExercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className={cn(
                "bg-card rounded-lg p-4 gradient-border",
                isCustomExercise(exercise.id) && "border-primary/30"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground truncate">
                      {exercise.name}
                    </h3>
                    {exercise.videoUrl && (
                      <Video className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                    {isCustomExercise(exercise.id) && (
                      <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                        Perso
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {exercise.defaultSets} × {exercise.defaultReps}
                    {exercise.muscleGroup && (
                      <span className="ml-2 text-xs">• {exercise.muscleGroup}</span>
                    )}
                  </p>
                  {exercise.notes && (
                    <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">
                      {exercise.notes}
                    </p>
                  )}
                </div>
                {isCustomExercise(exercise.id) && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(exercise)}
                      className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(exercise)}
                      className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-foreground">
                  {editingExercise ? 'Modifier l\'exercice' : 'Nouvel exercice'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                    setEditingExercise(null);
                  }}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Nom de l'exercice *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Développé couché"
                    className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* Sets & Reps */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Séries
                    </label>
                    <input
                      type="text"
                      value={formSets}
                      onChange={(e) => setFormSets(e.target.value)}
                      placeholder="3"
                      className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Reps
                    </label>
                    <input
                      type="text"
                      value={formReps}
                      onChange={(e) => setFormReps(e.target.value)}
                      placeholder="10, 8-12, 5 min..."
                      className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Rest Time */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Temps de repos
                  </label>
                  <input
                    type="text"
                    value={formRestTime}
                    onChange={(e) => setFormRestTime(e.target.value)}
                    placeholder="1 min 30, 2 min..."
                    className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Muscle Group */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Groupe musculaire
                  </label>
                  <input
                    type="text"
                    value={formMuscleGroup}
                    onChange={(e) => setFormMuscleGroup(e.target.value)}
                    placeholder="Poitrine, Dos, Épaules..."
                    className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Lien vidéo (YouTube)
                  </label>
                  <input
                    type="url"
                    value={formVideoUrl}
                    onChange={(e) => setFormVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Notes / Instructions
                  </label>
                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Conseils d'exécution..."
                    rows={3}
                    className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-lg flex items-center justify-center gap-2 button-glow hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  <Save className="w-5 h-5" />
                  {editingExercise ? 'Enregistrer' : 'Ajouter'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
