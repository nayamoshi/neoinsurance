import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ActiveCoverages } from '@/components/dashboard/active-coverages';

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Coverage History</h1>
        <p className="text-muted-foreground">
          A complete log of all your past and active policies.
        </p>
      </div>

      <ActiveCoverages />
    </div>
  );
}
