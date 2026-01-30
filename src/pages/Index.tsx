import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Zap,
  TrendingUp,
  Calendar,
  Flame,
  Trophy,
  Plus,
  Dumbbell,
  MoreVertical,
  Copy,
  Trash2,
  Edit3
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useWorkoutStore } from '@/hooks/useWorkoutStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const {
    sessions,
    userStats,
    settings,
    getWeeklyStats,
    getAvailableSessions,
    isSessionCompletedToday,
    duplicateSession,
    deleteSession
  } = useWorkoutStore();

  const weeklyStats = getWeeklyStats();
  const availableSessions = getAvailableSessions();

  // Debug: log session count on every render
  console.log('Index render - sessions count:', sessions.length, 'available:', availableSessions.length);

  // Menu contextuel
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDuplicate = (sessionId: string, sessionName: string) => {
    duplicateSession(sessionId);
    setOpenMenuId(null);
    toast.success(`"${sessionName}" dupliquée`);
  };

  const handleDelete = (sessionId: string, sessionName: string) => {
    if (confirm(`Supprimer "${sessionName}" ?`)) {
      deleteSession(sessionId);
      setOpenMenuId(null);
      toast.success('Séance supprimée');
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-muted-foreground text-sm">
          {format(new Date(), "EEEE d MMMM", { locale: fr })}
        </p>
        <h1 className="font-display font-bold text-3xl text-foreground mt-1">
          Salut <span className="text-primary text-glow">{settings.userName}</span> !
        </h1>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3 mb-8"
      >
        <div className="bg-card rounded-lg p-4 gradient-border">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Calendar className="w-4 h-4" />
            <span>Cette semaine</span>
          </div>
          <p className="font-display font-bold text-2xl text-foreground">{weeklyStats.workoutsThisWeek}</p>
          <p className="text-xs text-muted-foreground">séances</p>
        </div>
        <div className="bg-card rounded-lg p-4 gradient-border">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Streak</span>
          </div>
          <p className="font-display font-bold text-2xl text-foreground">{userStats.currentStreak}</p>
          <p className="text-xs text-muted-foreground">jours</p>
        </div>
        <div className="bg-card rounded-lg p-4 gradient-border">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>Total</span>
          </div>
          <p className="font-display font-bold text-2xl text-foreground">{userStats.totalWorkouts}</p>
          <p className="text-xs text-muted-foreground">séances</p>
        </div>
        <div className="bg-card rounded-lg p-4 gradient-border">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>Volume total</span>
          </div>
          <p className="font-display font-bold text-2xl text-foreground">
            {userStats.totalVolume > 1000
              ? `${(userStats.totalVolume / 1000).toFixed(1)}t`
              : `${userStats.totalVolume}kg`
            }
          </p>
          <p className="text-xs text-muted-foreground">soulevé</p>
        </div>
      </motion.div>

      {/* Sessions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg text-foreground">
            Mes séances
          </h2>
          <button
            onClick={() => navigate('/session/new')}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-card rounded-xl p-8 text-center gradient-border">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">
              Aucune séance créée
            </p>
            <button
              onClick={() => navigate('/session/new')}
              className="bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg button-glow"
            >
              Créer ma première séance
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Afficher TOUTES les séances */}
            {sessions.map((session, index) => {
              const completedToday = isSessionCompletedToday(session.id);
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * Math.min(index, 5) }}
                  className={`bg-card rounded-xl p-4 gradient-border transition-all cursor-pointer group ${
                    completedToday ? 'opacity-60' : 'hover:border-primary/40'
                  }`}
                  onClick={() => navigate(`/workout/${session.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-display font-semibold truncate transition-colors ${
                          completedToday ? 'text-muted-foreground' : 'text-foreground group-hover:text-primary'
                        }`}>
                          {session.name}
                        </h3>
                        {completedToday && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Fait
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {session.exercises.length} exercices
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Menu contextuel */}
                      <div className="relative" ref={openMenuId === session.id ? menuRef : null}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === session.id ? null : session.id);
                          }}
                          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-muted-foreground" />
                        </button>

                        <AnimatePresence>
                          {openMenuId === session.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 top-12 w-44 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/session/edit/${session.id}`);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                                Modifier
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDuplicate(session.id, session.name);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
                              >
                                <Copy className="w-4 h-4" />
                                Dupliquer
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(session.id, session.name);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Supprimer
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform ${
                        completedToday
                          ? 'bg-green-500/20'
                          : 'bg-primary button-glow group-hover:scale-110'
                      }`}>
                        {completedToday ? (
                          <Zap className="w-5 h-5 text-green-400" />
                        ) : (
                          <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Quick Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-auto"
      >
        <button
          onClick={() => navigate('/session/new')}
          className="w-full bg-secondary text-foreground font-semibold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Créer une nouvelle séance
        </button>
      </motion.div>
    </PageContainer>
  );
};

export default Index;
