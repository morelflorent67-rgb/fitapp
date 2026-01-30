import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trash2,
  Download,
  Upload,
  User,
  Moon,
  Sun,
  Monitor,
  Database,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { PageContainer } from '@/components/layout/PageContainer';
import { useWorkoutStore } from '@/hooks/useWorkoutStore';
import { exerciseLibrary } from '@/data/exerciseLibrary';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { sessions, history, settings, updateSettings, clearHistory, exportData, importData, customExercises } = useWorkoutStore();
  const { theme, setTheme } = useTheme();
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [userName, setUserName] = useState(settings.userName);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClearHistory = () => {
    clearHistory();
    setShowConfirm(false);
    toast.success('Historique effacé');
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `irontrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Données exportées');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const success = importData(data);
        if (success) {
          toast.success('Données importées avec succès');
        } else {
          toast.error('Erreur lors de l\'import');
        }
      } catch (error) {
        toast.error('Fichier invalide');
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveName = () => {
    if (userName.trim()) {
      updateSettings({ userName: userName.trim() });
      toast.success('Nom mis à jour');
    }
    setEditingName(false);
  };

  const totalExercisesInSessions = sessions.reduce((sum, s) => sum + s.exercises.length, 0);

  return (
    <PageContainer title="Réglages" subtitle="Paramètres de l'application">
      <div className="space-y-4">
        {/* User Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg p-5 gradient-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-foreground">Profil</h3>
              <p className="text-sm text-muted-foreground">Ton nom d'utilisateur</p>
            </div>
          </div>

          {editingName ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="flex-1 bg-secondary border-0 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              />
              <button
                onClick={handleSaveName}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
              >
                OK
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="w-full bg-secondary rounded-lg px-4 py-3 text-left text-foreground hover:bg-muted transition-colors"
            >
              {settings.userName}
            </button>
          )}
        </motion.div>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-lg p-5 gradient-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : theme === 'light' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Monitor className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Thème</h3>
              <p className="text-sm text-muted-foreground">Apparence de l'app</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'light', icon: Sun, label: 'Clair' },
              { value: 'dark', icon: Moon, label: 'Sombre' },
              { value: 'system', icon: Monitor, label: 'Auto' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg transition-colors",
                  theme === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-muted'
                )}
              >
                <option.icon className="w-5 h-5" />
                <span className="text-xs">{option.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Data Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg p-5 gradient-border"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Données</h3>
              <p className="text-sm text-muted-foreground">Aperçu de tes données</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-secondary rounded-lg p-3 text-center">
              <p className="font-display font-bold text-xl text-foreground">{sessions.length}</p>
              <p className="text-xs text-muted-foreground">Séances</p>
            </div>
            <div className="bg-secondary rounded-lg p-3 text-center">
              <p className="font-display font-bold text-xl text-foreground">{exerciseLibrary.length + customExercises.length}</p>
              <p className="text-xs text-muted-foreground">Bibliothèque</p>
            </div>
            <div className="bg-secondary rounded-lg p-3 text-center">
              <p className="font-display font-bold text-xl text-foreground">{history.length}</p>
              <p className="text-xs text-muted-foreground">Entrainements</p>
            </div>
          </div>
        </motion.div>

        {/* Exercise Library */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          onClick={() => navigate('/library')}
          className="w-full bg-card rounded-lg p-5 gradient-border flex items-center gap-4 text-left hover:border-primary/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-foreground">Bibliothèque d'exercices</h3>
            <p className="text-sm text-muted-foreground">{exerciseLibrary.length + customExercises.length} exercices disponibles</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </motion.button>

        {/* Export Data */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={handleExport}
          className="w-full bg-card rounded-lg p-5 gradient-border flex items-center gap-4 text-left hover:border-primary/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <Download className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">Exporter les données</h3>
            <p className="text-sm text-muted-foreground">Télécharger une sauvegarde JSON</p>
          </div>
        </motion.button>

        {/* Import Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-card rounded-lg p-5 gradient-border flex items-center gap-4 text-left hover:border-primary/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Upload className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Importer des données</h3>
              <p className="text-sm text-muted-foreground">Restaurer depuis un fichier JSON</p>
            </div>
          </button>
        </motion.div>

        {/* Clear History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full bg-card rounded-lg p-5 gradient-border flex items-center gap-4 text-left hover:border-destructive/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">Effacer l'historique</h3>
                <p className="text-sm text-muted-foreground">Supprimer toutes les séances passées</p>
              </div>
            </button>
          ) : (
            <div className="bg-destructive/10 rounded-lg p-5 border border-destructive/20">
              <p className="text-foreground font-medium mb-4">
                Êtes-vous sûr ? Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleClearHistory}
                  className="flex-1 bg-destructive text-destructive-foreground font-semibold py-3 rounded-lg"
                >
                  Confirmer
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 bg-secondary text-foreground font-semibold py-3 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Version */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center pt-8 pb-24"
        >
          <p className="text-muted-foreground text-sm">
            IronTrack v2.0.0
          </p>
          <p className="text-muted-foreground/60 text-xs mt-1">
            Conçu pour la performance
          </p>
        </motion.div>
      </div>
    </PageContainer>
  );
}
