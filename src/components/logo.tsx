import { ShieldCheck } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 text-xl font-bold text-primary">
      <ShieldCheck className="h-7 w-7" />
      <span className="text-foreground">NeoAsegura</span>
    </div>
  );
}
