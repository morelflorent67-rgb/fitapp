import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Session,
  WorkoutEntry,
  AppState,
  Exercise,
  ExerciseLog,
  PersonalRecord,
  UserStats,
  AppSettings,
  ExerciseTemplate
} from '@/types/workout';

const STORAGE_KEY = 'irontrack-data';

// Séances par défaut importées du fichier EXERCICES.txt
const defaultSessions: Session[] = [
  {
    id: 'haut-corps-1',
    name: 'Haut du corps 1 (Force & Skills)',
    createdAt: new Date().toISOString(),
    exercises: [
      {
        id: 'elliptique',
        name: 'Elliptique',
        sets: 1,
        reps: '5 min',
        restTime: '1 min',
        category: 'warmup',
        notes: 'Échauffement cardio initial - Résistance 8-12',
        videoUrl: 'https://www.youtube.com/watch?v=bcd86P6P_c8'
      },
      {
        id: 'cercle-lu',
        name: 'Cercle de Lu',
        sets: 1,
        reps: '15',
        restTime: '0',
        category: 'warmup',
        notes: 'Effectuer des cercles ronds jusqu\'à sentir la chauffe - 2.5 kg / main',
        videoUrl: 'https://www.youtube.com/watch?v=bcd86P6P_c8'
      },
      {
        id: 'muscle-up-anneaux',
        name: 'Muscle up aux anneaux (assisté)',
        sets: 4,
        reps: '3',
        restTime: '2 min',
        category: 'main',
        notes: 'Pieds à plat = simple, sur pointe = difficile',
        videoUrl: 'https://www.youtube.com/watch?v=pXiGenBKjWk'
      },
      {
        id: 'dips-anneaux',
        name: 'Dips sur anneaux',
        sets: 4,
        reps: '12',
        restTime: '2 min',
        category: 'main',
        notes: 'Les épaules doivent toucher les anneaux à chaque rep',
        videoUrl: 'https://www.youtube.com/watch?v=Ikeg_v5fvz4'
      },
      {
        id: 'dev-couche-halteres',
        name: 'Développé couché haltères',
        sets: 4,
        reps: '8',
        restTime: '1 min 30',
        category: 'main',
        notes: 'Garder une trajectoire stable',
        videoUrl: 'https://www.youtube.com/watch?v=vj2w851ZpEE'
      },
      {
        id: 'traction-lestee',
        name: 'Traction lestée',
        sets: 3,
        reps: '6',
        restTime: '2 min',
        category: 'main',
        notes: 'Passer le menton au-dessus de la barre',
        videoUrl: 'https://www.youtube.com/watch?v=mr74_9VkeOk'
      },
      {
        id: 'hspu',
        name: 'Handstand Push Ups (HSPU)',
        sets: 3,
        reps: '5',
        restTime: '1 min 30',
        category: 'main',
        notes: 'Garder le corps gainé, ne pas cambrer excessivement',
        videoUrl: 'https://www.youtube.com/watch?v=DBv3BvBS4H8'
      },
      {
        id: 'extension-triceps-poulie',
        name: 'Extension triceps poulie',
        sets: 3,
        reps: '8-10',
        restTime: '1 min',
        category: 'finisher',
        notes: 'Tempo explosif montée, 2s retenue descente',
        videoUrl: 'https://www.youtube.com/watch?v=3Hxs9xZQm7A'
      }
    ]
  },
  {
    id: 'bas-corps',
    name: 'Bas du Corps (Cardio & Mobilité)',
    createdAt: new Date().toISOString(),
    exercises: [
      {
        id: 'tapis-incline',
        name: 'Tapis Roulant (Incliné)',
        sets: 1,
        reps: '5 min',
        restTime: '2 min',
        category: 'warmup',
        notes: 'Marche active inclinée pour préparer les hanches - Pente 15% / 5km/h',
        videoUrl: 'https://www.youtube.com/watch?v=kIvFkHdIpqI'
      },
      {
        id: 'bird-dog',
        name: 'Bird Dog',
        sets: 2,
        reps: '10',
        restTime: '45 s',
        category: 'main',
        notes: 'Focus sur la stabilité du tronc, ne pas pivoter le bassin',
        videoUrl: 'https://www.youtube.com/watch?v=-LRjkbEy-qU'
      },
      {
        id: 'planche-laterale',
        name: 'Planche latérale lestée',
        sets: 3,
        reps: '40 sec',
        restTime: '30 s',
        category: 'finisher',
        notes: 'Poids posé sur la hanche supérieure',
        videoUrl: 'https://www.youtube.com/watch?v=YrcNsxTwLBA'
      }
    ]
  },
  {
    id: 'haut-corps-3',
    name: 'Haut du corps 3 (Postural)',
    createdAt: new Date().toISOString(),
    exercises: [
      {
        id: 'traction-scapulaire',
        name: 'Traction scapulaire',
        sets: 2,
        reps: '10',
        restTime: '45 s',
        category: 'warmup',
        notes: 'Bras tendus, mouvement initié uniquement par les omoplates',
        videoUrl: 'https://www.youtube.com/watch?v=-ZIpSoTRsuE'
      },
      {
        id: 'traction-australienne',
        name: 'Traction australienne',
        sets: 2,
        reps: '12',
        restTime: '1 min',
        category: 'main',
        notes: 'Poitrine vers les anneaux, corps droit',
        videoUrl: 'https://www.youtube.com/watch?v=dnpDUwqMX04'
      }
    ]
  }
];

// Records personnels initiaux basés sur le fichier
const defaultPersonalRecords: PersonalRecord[] = [
  { exerciseId: 'dev-couche-halteres', exerciseName: 'Développé couché haltères', weight: 32, date: new Date().toISOString(), reps: '8' },
  { exerciseId: 'traction-lestee', exerciseName: 'Traction lestée', weight: 20, date: new Date().toISOString(), reps: '6' },
  { exerciseId: 'extension-triceps-poulie', exerciseName: 'Extension triceps poulie', weight: 15, date: new Date().toISOString(), reps: '8-10' },
  { exerciseId: 'planche-laterale', exerciseName: 'Planche latérale lestée', weight: 10, date: new Date().toISOString(), reps: '40 sec' },
];

const defaultSettings: AppSettings = {
  userName: 'Florent',
  defaultRestTime: 90,
  theme: 'dark'
};

const defaultUserStats: UserStats = {
  totalWorkouts: 0,
  totalVolume: 0,
  currentStreak: 0,
  longestStreak: 0
};

const getDefaultState = (): AppState => ({
  sessions: defaultSessions,
  history: [],
  personalRecords: defaultPersonalRecords,
  userStats: defaultUserStats,
  settings: defaultSettings,
  customExercises: []
});

const loadState = (): AppState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    console.log('loadState - localStorage has data:', !!saved);

    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('loadState - parsed sessions count:', parsed.sessions?.length);

      // Migration: si ancien format avec "program", convertir
      if (parsed.program && !parsed.sessions) {
        console.log('loadState - migrating from old format');
        return {
          sessions: parsed.program.sessions || defaultSessions,
          history: parsed.history || [],
          personalRecords: parsed.personalRecords || defaultPersonalRecords,
          userStats: parsed.userStats || defaultUserStats,
          settings: parsed.settings || defaultSettings,
          customExercises: []
        };
      }

      // Fusionner avec les valeurs par défaut pour les nouveaux champs
      const state = {
        sessions: parsed.sessions || defaultSessions,
        history: parsed.history || [],
        personalRecords: parsed.personalRecords || defaultPersonalRecords,
        userStats: parsed.userStats || defaultUserStats,
        settings: parsed.settings || defaultSettings,
        customExercises: parsed.customExercises || []
      };
      console.log('loadState - returning state with sessions:', state.sessions.length);
      return state;
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  console.log('loadState - returning default state');
  return getDefaultState();
};

const saveState = (state: AppState): boolean => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);

    // Vérifier que la sauvegarde a bien fonctionné
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== serialized) {
      console.error('State verification failed: data mismatch');
      return false;
    }

    // Dispatch custom event pour synchroniser les autres instances du hook
    window.dispatchEvent(new CustomEvent('irontrack-state-change', {
      detail: state
    }));

    console.log('State saved successfully, sessions count:', state.sessions.length);
    return true;
  } catch (e) {
    console.error('Failed to save state:', e);
    return false;
  }
};

// Calculer le streak
const calculateStreak = (history: WorkoutEntry[]): { current: number; longest: number; lastDate?: string } => {
  if (history.length === 0) return { current: 0, longest: 0 };

  const sortedHistory = [...history]
    .filter(e => e.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedHistory.length === 0) return { current: 0, longest: 0 };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastWorkout = new Date(sortedHistory[0].date);
  lastWorkout.setHours(0, 0, 0, 0);

  // Vérifier si le dernier entraînement était aujourd'hui ou hier
  const diffDays = Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    // Streak cassé
    return { current: 0, longest: 0, lastDate: sortedHistory[0].date };
  }

  // Compter les jours consécutifs
  let currentStreak = 1;
  let longestStreak = 1;
  let tempStreak = 1;

  const workoutDates = new Set(sortedHistory.map(e => {
    const d = new Date(e.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }));

  const datesArray = Array.from(workoutDates).sort((a, b) => b - a);

  for (let i = 1; i < datesArray.length; i++) {
    const diff = (datesArray[i - 1] - datesArray[i]) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      tempStreak++;
      if (i === 1 || (datesArray[0] === today.getTime() || datesArray[0] === today.getTime() - 86400000)) {
        currentStreak = tempStreak;
      }
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    current: currentStreak,
    longest: longestStreak,
    lastDate: sortedHistory[0].date
  };
};

// Calculer le volume total
const calculateTotalVolume = (history: WorkoutEntry[]): number => {
  return history
    .filter(e => e.completed)
    .reduce((total, entry) => {
      return total + entry.exercises.reduce((sum, ex) => {
        const sets = typeof ex.sets === 'number' ? ex.sets : parseInt(ex.sets) || 0;
        const reps = typeof ex.reps === 'number' ? ex.reps : parseInt(ex.reps) || 0;
        return sum + (ex.weight * sets * reps);
      }, 0);
    }, 0);
};

export function useWorkoutStore() {
  const [state, setState] = useState<AppState>(() => loadState());
  const isInitialMount = useRef(true);

  // Force refresh from localStorage on mount (pour éviter les états périmés après navigation)
  useEffect(() => {
    // Toujours recharger l'état frais depuis localStorage au montage
    const freshState = loadState();
    setState(freshState);

    // Marquer que le montage initial est terminé après un court délai
    const timer = setTimeout(() => {
      isInitialMount.current = false;
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Écouter les changements de state pour synchroniser entre composants
  useEffect(() => {
    const handleStateChange = (e: CustomEvent<AppState>) => {
      setState(e.detail);
    };

    window.addEventListener('irontrack-state-change', handleStateChange as EventListener);
    return () => window.removeEventListener('irontrack-state-change', handleStateChange as EventListener);
  }, []);

  // Ne pas sauvegarder automatiquement - on sauvegarde explicitement dans chaque action
  // Cela évite les conflits lors du rechargement initial

  // Récupérer une séance par ID
  const getSession = useCallback((sessionId: string): Session | null => {
    return state.sessions.find(s => s.id === sessionId) || null;
  }, [state.sessions]);

  // Récupérer le dernier poids utilisé pour un exercice (par nom car les IDs changent)
  const getLastWeightForExercise = useCallback((exerciseName: string): number | null => {
    const sortedHistory = [...state.history]
      .filter(entry => entry.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    for (const entry of sortedHistory) {
      const exerciseLog = entry.exercises.find(e =>
        e.exerciseName.toLowerCase() === exerciseName.toLowerCase()
      );
      if (exerciseLog && exerciseLog.weight > 0) {
        return exerciseLog.weight;
      }
    }
    return null;
  }, [state.history]);

  // Récupérer le record personnel pour un exercice (par nom car les IDs changent)
  const getPersonalRecord = useCallback((exerciseName: string): PersonalRecord | null => {
    return state.personalRecords.find(pr =>
      pr.exerciseName.toLowerCase() === exerciseName.toLowerCase()
    ) || null;
  }, [state.personalRecords]);

  // Vérifier si un poids bat le record
  const checkAndUpdateRecord = useCallback((exerciseId: string, exerciseName: string, weight: number, reps: number | string): boolean => {
    const currentRecord = state.personalRecords.find(pr => pr.exerciseId === exerciseId);

    if (!currentRecord || weight > currentRecord.weight) {
      setState(prev => {
        const newRecords = prev.personalRecords.filter(pr => pr.exerciseId !== exerciseId);
        newRecords.push({
          exerciseId,
          exerciseName,
          weight,
          reps,
          date: new Date().toISOString()
        });
        return { ...prev, personalRecords: newRecords };
      });
      return true; // Nouveau record !
    }
    return false;
  }, [state.personalRecords]);

  // Démarrer une séance
  const startWorkout = useCallback((sessionId: string): WorkoutEntry => {
    const session = getSession(sessionId);
    if (!session) throw new Error('Session not found');

    const newEntry: WorkoutEntry = {
      id: Date.now().toString(),
      sessionId: session.id,
      sessionName: session.name,
      date: new Date().toISOString(),
      exercises: session.exercises.map(ex => ({
        exerciseId: ex.id,
        exerciseName: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        restTime: ex.restTime,
        weight: 0,
        completed: false,
        videoUrl: ex.videoUrl,
        category: ex.category,
        notes: ex.notes,
        targetWeight: ex.targetWeight
      })),
      completed: false
    };

    return newEntry;
  }, [getSession]);

  // Terminer une séance
  const completeWorkout = useCallback((entry: WorkoutEntry) => {
    const completedEntry = { ...entry, completed: true };

    // Vérifier les records pour chaque exercice
    const newRecords: string[] = [];
    entry.exercises.forEach(ex => {
      if (ex.weight > 0 && ex.completed) {
        const isNewRecord = checkAndUpdateRecord(ex.exerciseId, ex.exerciseName, ex.weight, ex.reps);
        if (isNewRecord) {
          newRecords.push(ex.exerciseName);
        }
      }
    });

    setState(prev => {
      const newHistory = [completedEntry, ...prev.history];
      const streak = calculateStreak(newHistory);
      const totalVolume = calculateTotalVolume(newHistory);

      const newState = {
        ...prev,
        history: newHistory,
        userStats: {
          totalWorkouts: newHistory.filter(e => e.completed).length,
          totalVolume,
          currentStreak: streak.current,
          longestStreak: Math.max(prev.userStats.longestStreak, streak.longest),
          lastWorkoutDate: streak.lastDate
        }
      };
      saveState(newState);
      return newState;
    });

    return newRecords; // Retourner les exercices où un record a été battu
  }, [checkAndUpdateRecord]);

  // CRUD Séances
  const addSession = useCallback((session: Session) => {
    console.log('addSession called with:', session.name, 'id:', session.id);
    setState(prev => {
      console.log('addSession - prev sessions count:', prev.sessions.length);
      const newSession = { ...session, createdAt: new Date().toISOString() };
      const newState = {
        ...prev,
        sessions: [...prev.sessions, newSession]
      };
      console.log('addSession - new sessions count:', newState.sessions.length);
      // Sauvegarder immédiatement pour éviter les problèmes de navigation
      const saveSuccess = saveState(newState);
      console.log('addSession - save success:', saveSuccess);
      return newState;
    });
  }, []);

  const updateSession = useCallback((sessionId: string, updates: Partial<Session>) => {
    console.log('updateSession called for:', sessionId, 'updates:', updates.name);
    setState(prev => {
      const sessionExists = prev.sessions.some(s => s.id === sessionId);
      console.log('updateSession - session exists:', sessionExists, 'sessions count:', prev.sessions.length);
      const newState = {
        ...prev,
        sessions: prev.sessions.map(s =>
          s.id === sessionId
            ? { ...s, ...updates, updatedAt: new Date().toISOString() }
            : s
        )
      };
      const saveSuccess = saveState(newState);
      console.log('updateSession - save success:', saveSuccess);
      return newState;
    });
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setState(prev => {
      const newState = {
        ...prev,
        sessions: prev.sessions.filter(s => s.id !== sessionId)
      };
      saveState(newState);
      return newState;
    });
  }, []);

  const duplicateSession = useCallback((sessionId: string) => {
    const session = state.sessions.find(s => s.id === sessionId);
    if (!session) return;

    const newSession: Session = {
      ...session,
      id: Date.now().toString(),
      name: `${session.name} (copie)`,
      createdAt: new Date().toISOString(),
      exercises: session.exercises.map(ex => ({ ...ex, id: `${ex.id}-${Date.now()}` }))
    };

    setState(prev => {
      const newState = {
        ...prev,
        sessions: [...prev.sessions, newSession]
      };
      saveState(newState);
      return newState;
    });
  }, [state.sessions]);

  // CRUD Exercices dans une séance
  const addExerciseToSession = useCallback((sessionId: string, exercise: Exercise) => {
    setState(prev => ({
      ...prev,
      sessions: prev.sessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            exercises: [...session.exercises, exercise],
            updatedAt: new Date().toISOString()
          };
        }
        return session;
      })
    }));
  }, []);

  const updateExerciseInSession = useCallback((sessionId: string, exerciseId: string, updates: Partial<Exercise>) => {
    setState(prev => ({
      ...prev,
      sessions: prev.sessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            exercises: session.exercises.map(ex =>
              ex.id === exerciseId ? { ...ex, ...updates } : ex
            ),
            updatedAt: new Date().toISOString()
          };
        }
        return session;
      })
    }));
  }, []);

  const removeExerciseFromSession = useCallback((sessionId: string, exerciseId: string) => {
    setState(prev => ({
      ...prev,
      sessions: prev.sessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            exercises: session.exercises.filter(ex => ex.id !== exerciseId),
            updatedAt: new Date().toISOString()
          };
        }
        return session;
      })
    }));
  }, []);

  const reorderExercisesInSession = useCallback((sessionId: string, exercises: Exercise[]) => {
    setState(prev => ({
      ...prev,
      sessions: prev.sessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            exercises,
            updatedAt: new Date().toISOString()
          };
        }
        return session;
      })
    }));
  }, []);

  // Paramètres
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setState(prev => {
      const newState = {
        ...prev,
        settings: { ...prev.settings, ...updates }
      };
      saveState(newState);
      return newState;
    });
  }, []);

  // Historique
  const clearHistory = useCallback(() => {
    setState(prev => {
      const newState = {
        ...prev,
        history: [],
        userStats: { ...defaultUserStats }
      };
      saveState(newState);
      console.log('clearHistory - history cleared and saved');
      return newState;
    });
  }, []);

  const deleteHistoryEntry = useCallback((entryId: string) => {
    setState(prev => {
      const newHistory = prev.history.filter(e => e.id !== entryId);
      const streak = calculateStreak(newHistory);
      const totalVolume = calculateTotalVolume(newHistory);

      const newState = {
        ...prev,
        history: newHistory,
        userStats: {
          totalWorkouts: newHistory.filter(e => e.completed).length,
          totalVolume,
          currentStreak: streak.current,
          longestStreak: streak.longest,
          lastWorkoutDate: streak.lastDate
        }
      };
      saveState(newState);
      return newState;
    });
  }, []);

  // Export/Import
  const exportData = useCallback(() => {
    return {
      ...state,
      exportedAt: new Date().toISOString(),
      version: '2.0.0'
    };
  }, [state]);

  const importData = useCallback((data: any) => {
    try {
      // Valider les données importées
      if (!data.sessions || !Array.isArray(data.sessions)) {
        throw new Error('Invalid data format');
      }

      setState({
        sessions: data.sessions || defaultSessions,
        history: data.history || [],
        personalRecords: data.personalRecords || [],
        userStats: data.userStats || defaultUserStats,
        settings: data.settings || defaultSettings
      });
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }, []);

  // Statistiques pour un exercice spécifique (pour les graphiques)
  const getExerciseHistory = useCallback((exerciseId: string) => {
    return state.history
      .filter(entry => entry.completed)
      .map(entry => {
        const exercise = entry.exercises.find(e => e.exerciseId === exerciseId);
        if (exercise && exercise.weight > 0) {
          return {
            date: entry.date,
            weight: exercise.weight,
            reps: exercise.reps,
            sets: exercise.sets
          };
        }
        return null;
      })
      .filter(Boolean)
      .reverse(); // Du plus ancien au plus récent
  }, [state.history]);

  // Statistiques de la semaine
  const getWeeklyStats = useCallback(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weekWorkouts = state.history.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= oneWeekAgo && entry.completed;
    });

    return {
      workoutsThisWeek: weekWorkouts.length,
      volumeThisWeek: calculateTotalVolume(weekWorkouts)
    };
  }, [state.history]);

  // Vérifier si une séance a été faite aujourd'hui
  const isSessionCompletedToday = useCallback((sessionId: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return state.history.some(entry => {
      if (entry.sessionId !== sessionId || !entry.completed) return false;
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
  }, [state.history]);

  // Récupérer les séances non faites aujourd'hui
  const getAvailableSessions = useCallback(() => {
    return state.sessions.filter(session => !isSessionCompletedToday(session.id));
  }, [state.sessions, isSessionCompletedToday]);

  // Récupérer les séances faites aujourd'hui
  const getCompletedTodaySessions = useCallback(() => {
    return state.sessions.filter(session => isSessionCompletedToday(session.id));
  }, [state.sessions, isSessionCompletedToday]);

  // CRUD Exercices personnalisés
  const addCustomExercise = useCallback((exercise: ExerciseTemplate) => {
    setState(prev => {
      const newState = {
        ...prev,
        customExercises: [...prev.customExercises, { ...exercise, id: `custom-${Date.now()}` }]
      };
      saveState(newState);
      return newState;
    });
  }, []);

  const updateCustomExercise = useCallback((exerciseId: string, updates: Partial<ExerciseTemplate>) => {
    setState(prev => {
      const newState = {
        ...prev,
        customExercises: prev.customExercises.map(ex =>
          ex.id === exerciseId ? { ...ex, ...updates } : ex
        )
      };
      saveState(newState);
      return newState;
    });
  }, []);

  const deleteCustomExercise = useCallback((exerciseId: string) => {
    setState(prev => {
      const newState = {
        ...prev,
        customExercises: prev.customExercises.filter(ex => ex.id !== exerciseId)
      };
      saveState(newState);
      return newState;
    });
  }, []);

  return {
    // State
    sessions: state.sessions,
    history: state.history,
    personalRecords: state.personalRecords,
    userStats: state.userStats,
    settings: state.settings,
    customExercises: state.customExercises,

    // Session getters
    getSession,
    getLastWeightForExercise,
    getPersonalRecord,
    getExerciseHistory,
    getWeeklyStats,
    isSessionCompletedToday,
    getAvailableSessions,
    getCompletedTodaySessions,

    // Workout actions
    startWorkout,
    completeWorkout,
    checkAndUpdateRecord,

    // Session CRUD
    addSession,
    updateSession,
    deleteSession,
    duplicateSession,

    // Exercise CRUD
    addExerciseToSession,
    updateExerciseInSession,
    removeExerciseFromSession,
    reorderExercisesInSession,

    // Settings
    updateSettings,

    // History
    clearHistory,
    deleteHistoryEntry,

    // Import/Export
    exportData,
    importData,

    // Custom Exercises
    addCustomExercise,
    updateCustomExercise,
    deleteCustomExercise
  };
}
