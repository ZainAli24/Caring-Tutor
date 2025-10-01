'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw } from 'lucide-react';

const phases = [
  { name: 'Breathe In', duration: 4 },
  { name: 'Hold', duration: 4 },
  { name: 'Breathe Out', duration: 4 },
  { name: 'Hold', duration: 4 },
];

export function BreathingExercise() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setPhaseIndex((prevIndex) => (prevIndex + 1) % phases.length);
    }, phases[phaseIndex].duration * 1000);

    return () => clearInterval(interval);
  }, [phaseIndex, isRunning]);

  const currentPhase = phases[phaseIndex];

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setPhaseIndex(0);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8 rounded-lg bg-muted/50">
      <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
        <motion.div
          className="absolute w-full h-full bg-primary/20 rounded-full"
          animate={{
            scale: phaseIndex === 0 || phaseIndex === 1 ? [1, 1.2, 1] : 1,
            opacity: phaseIndex === 0 || phaseIndex === 1 ? [0.5, 1, 0.5] : 1,
          }}
          transition={{
            duration: currentPhase.duration,
            ease: "easeInOut",
            repeat: isRunning ? Infinity : 0,
          }}
        />
        <div 
          className={cn(
            "relative w-32 h-32 md:w-40 md:h-40 bg-background rounded-full flex items-center justify-center transition-all duration-1000",
            (phaseIndex === 0) && 'scale-110', // Breathe In
            (phaseIndex === 2) && 'scale-90', // Breathe Out
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={phaseIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-xl md:text-2xl font-semibold text-primary">{currentPhase.name}</p>
              <p className="text-sm text-muted-foreground">for {currentPhase.duration} seconds</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {!isRunning ? (
            <Button onClick={handleStart} size="lg">
                <Play className="mr-2 h-5 w-5" /> Start
            </Button>
        ) : (
            <Button onClick={handlePause} size="lg" variant="outline">
                <Pause className="mr-2 h-5 w-5" /> Pause
            </Button>
        )}
        <Button onClick={handleReset} size="lg" variant="ghost">
            <RefreshCw className="mr-2 h-5 w-5" /> Reset
        </Button>
      </div>
    </div>
  );
}
