export type ExerciseCategory = 'warmup' | 'main' | 'superset' | 'finisher';

// Exercice dans une séance (template)
export interface Exercise {
  id: string;
  name: string;
  sets: number | string;        // "4" ou 4
  reps: number | string;        // "8-10", "5 min", "40 sec", 12
  restTime?: string;            // "1 min 30", "2 min", "45 s"
  videoUrl?: string;
  category?: ExerciseCategory;
  notes?: string;               // Instructions/conseils
  targetWeight?: number;        // Poids cible pour cet exercice
}

// Séance (template)
export interface Session {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt?: string;
  updatedAt?: string;
}

// Log d'un exercice pendant une séance
export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: number | string;
  reps: number | string;
  restTime?: string;
  weight: number;
  completed: boolean;
  videoUrl?: string;
  category?: ExerciseCategory;
  notes?: string;
  targetWeight?: number;        // Poids cible défini lors de la création
}

// Entrée d'historique (séance complétée)
export interface WorkoutEntry {
  id: string;
  sessionId: string;
  sessionName: string;
  date: string;
  duration?: number;            // Durée en secondes
  exercises: ExerciseLog[];
  completed: boolean;
}

// Record personnel pour un exercice
export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  date: string;
  reps: number | string;
}

// Statistiques utilisateur
export interface UserStats {
  totalWorkouts: number;
  totalVolume: number;          // kg total soulevé
  currentStreak: number;        // jours consécutifs
  longestStreak: number;
  lastWorkoutDate?: string;
}

// État global de l'application
export interface AppState {
  sessions: Session[];          // Liste des séances (pas de program)
  history: WorkoutEntry[];
  personalRecords: PersonalRecord[];
  userStats: UserStats;
  settings: AppSettings;
  customExercises: ExerciseTemplate[];  // Exercices ajoutés par l'utilisateur
}

// Paramètres de l'application
export interface AppSettings {
  userName: string;
  defaultRestTime: number;      // en secondes
  theme: 'dark' | 'light' | 'system';
}

// Pour la bibliothèque d'exercices importés
export interface ExerciseTemplate {
  id: string;
  name: string;
  defaultSets: number | string;
  defaultReps: number | string;
  defaultRestTime?: string;
  videoUrl?: string;
  notes?: string;
  muscleGroup?: string;         // Pour filtrage futur
}
