import { cn } from '@/lib/utils';
import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 text-xl font-bold font-headline text-foreground',
        className
      )}
    >
      <div className="bg-primary/20 text-primary p-2 rounded-lg">
        <BrainCircuit className="h-5 w-5" />
      </div>
      <span>Caring Tutor</span>
    </Link>
  );
}
