import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export function ReputationSummary() {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle>Reputation Summary</CardTitle>
        <CardDescription>Your current trust level on the platform.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
            <div className="text-5xl font-bold text-primary">87<span className="text-2xl text-muted-foreground">/100</span></div>
            <div className="mt-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-900 dark:text-green-200">
              Trusted user
            </div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
        Reputation increases with successful coverages and fair interactions.
        </p>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/reputation">
            View details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
