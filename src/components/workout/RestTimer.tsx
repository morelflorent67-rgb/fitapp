import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X } from 'lucide-react';

interface RestTimerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSeconds?: number;
}

export function RestTimer({ isOpen, onClose, defaultSeconds = 90 }: RestTimerProps) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [initialSeconds, setInitialSeconds] = useState(defaultSeconds);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    // Create audio element for notification
    audioRef.current = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU' +
      'tvT19' + 'A'.repeat(100));
  }, []);

  // Wake Lock API - empêche l'écran de se mettre en veille pendant le timer
  useEffect(() => {
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && isOpen) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.log('Wake Lock non disponible:', err);
        }
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
        } catch (err) {
          console.log('Erreur release Wake Lock:', err);
        }
      }
    };

    if (isOpen) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      releaseWakeLock();
    };
  }, [isOpen]);

  // Reset timer when defaultSeconds changes (when opening with new duration)
  useEffect(() => {
    if (isOpen) {
      setInitialSeconds(defaultSeconds);
      setSeconds(defaultSeconds);
      setIsRunning(false);
    }
  }, [defaultSeconds, isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Vibrate if available
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const toggleTimer = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  const adjustTime = useCallback((amount: number) => {
    const newTime = Math.max(0, Math.min(300, initialSeconds + amount));
    setInitialSeconds(newTime);
    setSeconds(newTime);
    setIsRunning(false);
  }, [initialSeconds]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const progress = initialSeconds > 0 ? (seconds / initialSeconds) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm bg-card rounded-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button - repositionné à l'intérieur de la card avec plus de marge */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-6 h-6 text-muted-foreground" />
            </button>

            <h2 className="font-display font-bold text-2xl text-center text-foreground mb-6 mt-2">
              Temps de repos
            </h2>

            {/* Timer Circle */}
            <div className="relative w-56 h-56 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="112"
                  cy="112"
                  r="104"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-secondary"
                />
                <motion.circle
                  cx="112"
                  cy="112"
                  r="104"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className="text-primary"
                  strokeDasharray={653.45}
                  strokeDashoffset={653.45 * (1 - progress / 100)}
                  transition={{ duration: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-display font-bold text-5xl ${seconds === 0 ? 'text-primary animate-pulse' : 'text-foreground'}`}>
                  {formatTime(seconds)}
                </span>
                {seconds === 0 && (
                  <span className="text-primary text-sm mt-2">C'est parti !</span>
                )}
              </div>
            </div>

            {/* Time adjustment */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => adjustTime(-15)}
                className="px-4 py-2 bg-secondary rounded-lg text-muted-foreground font-medium hover:bg-muted transition-colors"
              >
                -15s
              </button>
              <span className="text-muted-foreground text-sm min-w-[60px] text-center">
                {formatTime(initialSeconds)}
              </span>
              <button
                onClick={() => adjustTime(15)}
                className="px-4 py-2 bg-secondary rounded-lg text-muted-foreground font-medium hover:bg-muted transition-colors"
              >
                +15s
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={resetTimer}
                className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
              >
                <RotateCcw className="w-6 h-6 text-muted-foreground" />
              </button>
              <button
                onClick={toggleTimer}
                className="w-20 h-20 rounded-full bg-primary flex items-center justify-center button-glow"
              >
                {isRunning ? (
                  <Pause className="w-8 h-8 text-primary-foreground" />
                ) : (
                  <Play className="w-8 h-8 text-primary-foreground ml-1" />
                )}
              </button>
              <button
                onClick={onClose}
                className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
