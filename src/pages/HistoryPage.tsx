import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/PageContainer';
import { HistoryCard } from '@/components/workout/HistoryCard';
import { useWorkoutStore } from '@/hooks/useWorkoutStore';
import { Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const { history } = useWorkoutStore();
  const navigate = useNavigate();

  return (
    <PageContainer title="Historique" subtitle="Tes séances passées">
      {history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center mb-4">
            <Dumbbell className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-center mb-4">
            Aucune séance enregistrée.<br />
            Commence ta première séance !
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg button-glow"
          >
            Voir les séances
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4 pb-24">
          {history.map((entry, index) => (
            <HistoryCard key={entry.id} entry={entry} index={index} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
