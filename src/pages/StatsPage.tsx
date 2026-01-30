import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Trophy,
  Flame,
  Calendar,
  Dumbbell,
  ChevronDown
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { PageContainer } from '@/components/layout/PageContainer';
import { useWorkoutStore } from '@/hooks/useWorkoutStore';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function StatsPage() {
  const {
    history,
    personalRecords,
    userStats,
    sessions,
    getExerciseHistory,
    getWeeklyStats
  } = useWorkoutStore();

  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false);

  const weeklyStats = getWeeklyStats();

  // Get all unique exercises from history
  const allExercises = useMemo(() => {
    const exerciseMap = new Map<string, string>();
    history.forEach(entry => {
      entry.exercises.forEach(ex => {
        if (ex.weight > 0) {
          exerciseMap.set(ex.exerciseId, ex.exerciseName);
        }
      });
    });
    return Array.from(exerciseMap.entries()).map(([id, name]) => ({ id, name }));
  }, [history]);

  // Get progression data for selected exercise
  const exerciseProgressionData = useMemo(() => {
    if (!selectedExercise) return [];
    const data = getExerciseHistory(selectedExercise);
    return data.map((entry: any) => ({
      date: format(new Date(entry.date), 'dd/MM', { locale: fr }),
      weight: entry.weight,
      fullDate: format(new Date(entry.date), 'd MMMM yyyy', { locale: fr })
    }));
  }, [selectedExercise, getExerciseHistory]);

  // Weekly workout frequency
  const weeklyFrequencyData = useMemo(() => {
    const last4Weeks = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(new Date(), i * 7), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(subDays(new Date(), i * 7), { weekStartsOn: 1 });

      const count = history.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= weekStart && entryDate <= weekEnd && entry.completed;
      }).length;

      last4Weeks.push({
        week: format(weekStart, 'dd/MM', { locale: fr }),
        workouts: count
      });
    }
    return last4Weeks;
  }, [history]);

  // Daily activity for current week
  const dailyActivityData = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return days.map(day => {
      const hasWorkout = history.some(entry => {
        const entryDate = new Date(entry.date);
        return (
          entryDate.toDateString() === day.toDateString() &&
          entry.completed
        );
      });

      return {
        day: format(day, 'EEE', { locale: fr }),
        active: hasWorkout ? 1 : 0,
        date: day
      };
    });
  }, [history]);

  const selectedExerciseName = allExercises.find(e => e.id === selectedExercise)?.name;

  return (
    <PageContainer title="Statistiques" subtitle="Ta progression">
      {/* Quick Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <div className="bg-card rounded-lg p-4 gradient-border">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>Total séances</span>
          </div>
          <p className="font-display font-bold text-3xl text-foreground">
            {userStats.totalWorkouts}
          </p>
        </div>

        <div className="bg-card rounded-lg p-4 gradient-border">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Streak actuel</span>
          </div>
          <p className="font-display font-bold text-3xl text-foreground">
            {userStats.currentStreak}
            <span className="text-lg text-muted-foreground ml-1">j</span>
          </p>
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
        </div>

        <div className="bg-card rounded-lg p-4 gradient-border">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Calendar className="w-4 h-4" />
            <span>Cette semaine</span>
          </div>
          <p className="font-display font-bold text-3xl text-foreground">
            {weeklyStats.workoutsThisWeek}
            <span className="text-lg text-muted-foreground ml-1">séances</span>
          </p>
        </div>
      </motion.div>

      {/* Weekly Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-lg p-4 gradient-border mb-6"
      >
        <h3 className="font-display font-semibold text-foreground mb-4">
          Activité de la semaine
        </h3>
        <div className="flex justify-between">
          {dailyActivityData.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  day.active
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {day.active ? <Dumbbell className="w-5 h-5" /> : null}
              </div>
              <span className="text-xs text-muted-foreground capitalize">
                {day.day}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Frequency Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-lg p-4 gradient-border mb-6"
      >
        <h3 className="font-display font-semibold text-foreground mb-4">
          Fréquence par semaine
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyFrequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="week"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar
                dataKey="workouts"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Exercise Progression */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-lg p-4 gradient-border mb-6"
      >
        <h3 className="font-display font-semibold text-foreground mb-4">
          Progression par exercice
        </h3>

        {/* Exercise Selector */}
        <div className="relative mb-4">
          <button
            onClick={() => setShowExerciseDropdown(!showExerciseDropdown)}
            className="w-full bg-secondary rounded-lg px-4 py-3 flex items-center justify-between text-left"
          >
            <span className={selectedExercise ? 'text-foreground' : 'text-muted-foreground'}>
              {selectedExerciseName || 'Sélectionner un exercice'}
            </span>
            <ChevronDown className={cn(
              "w-5 h-5 text-muted-foreground transition-transform",
              showExerciseDropdown && "rotate-180"
            )} />
          </button>

          {showExerciseDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10 max-h-60 overflow-auto"
            >
              {allExercises.length === 0 ? (
                <div className="px-4 py-3 text-muted-foreground text-sm">
                  Aucun exercice avec poids enregistré
                </div>
              ) : (
                allExercises.map(exercise => (
                  <button
                    key={exercise.id}
                    onClick={() => {
                      setSelectedExercise(exercise.id);
                      setShowExerciseDropdown(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left hover:bg-muted transition-colors",
                      selectedExercise === exercise.id && "bg-primary/10 text-primary"
                    )}
                  >
                    {exercise.name}
                  </button>
                ))
              )}
            </motion.div>
          )}
        </div>

        {/* Progression Chart */}
        {selectedExercise && exerciseProgressionData.length > 0 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={exerciseProgressionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  unit=" kg"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(value, payload) => {
                    if (payload && payload[0]) {
                      return payload[0].payload.fullDate;
                    }
                    return value;
                  }}
                  formatter={(value: number) => [`${value} kg`, 'Poids']}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : selectedExercise ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            Pas encore de données pour cet exercice
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            Sélectionne un exercice pour voir ta progression
          </div>
        )}
      </motion.div>

      {/* Personal Records */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-lg p-4 gradient-border mb-24"
      >
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Records personnels
        </h3>

        {personalRecords.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Aucun record enregistré
          </p>
        ) : (
          <div className="space-y-3">
            {personalRecords.map(record => (
              <div
                key={record.exerciseId}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium text-foreground">{record.exerciseName}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(record.date), 'd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-xl text-yellow-500">
                    {record.weight} kg
                  </p>
                  <p className="text-xs text-muted-foreground">{record.reps} reps</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </PageContainer>
  );
}
