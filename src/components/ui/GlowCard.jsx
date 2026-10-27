import { GlowingEffect } from './glowing-effect';
import { cn } from '@/lib/utils';

// Panel kartlarının ortak kabuğu: fareyi takip eden parlayan kenarlık + kart yüzeyi.
export default function GlowCard({ as: Tag = 'section', className, children }) {
  return (
    <Tag className="relative rounded-2xl">
      <GlowingEffect
        spread={40}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
        glow
        disabled={false}
      />
      <div
        className={cn(
          'relative h-full rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900',
          className
        )}
      >
        {children}
      </div>
    </Tag>
  );
}
