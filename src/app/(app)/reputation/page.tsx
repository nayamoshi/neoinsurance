import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReputationBreakdown } from '@/components/reputation/reputation-breakdown';
import { ReputationChart } from '@/components/reputation/reputation-chart';
import { Download, RefreshCw, History } from 'lucide-react';

export default function ReputationPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Reputation</h1>
          <p className="text-muted-foreground">
            An overview of your trust score and activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Update Reputation
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report (JSON)
          </Button>
           <Button variant="outline" asChild>
            <Link href="/history">
              <History className="mr-2 h-4 w-4" />
              View History
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Overall Score</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-7xl font-bold text-primary">87<span className="text-3xl text-muted-foreground">/100</span></div>
            <div className="mt-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-900 dark:text-green-200">
              Trusted
            </div>
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <ReputationChart />
        </div>
      </div>

      <ReputationBreakdown />
    </div>
  );
}
