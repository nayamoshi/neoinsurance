import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { ActiveCoverages } from '@/components/dashboard/active-coverages';
import { ReputationSummary } from '@/components/dashboard/reputation-summary';
import { FileText, Plus, Shield, Wallet, Award } from 'lucide-react';

export default function DashboardPage() {
  const kpis = [
    {
      title: 'Total Collateral Locked',
      value: '3,200 PYUSD',
      icon: Wallet,
      description: 'Total value from all active coverages',
    },
    {
      title: 'Active Coverages',
      value: '3',
      icon: Shield,
      description: 'Number of currently active policies',
    },
    {
      title: 'Reputation Score',
      value: '87/100',
      icon: Award,
      description: '+4 points in the last 30 days',
    },
    {
      title: 'Claims Filed',
      value: '1',
      icon: FileText,
      description: 'Total claims submitted',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back 👋</h1>
          <p className="text-muted-foreground">
            Here’s your insurance activity overview.
          </p>
        </div>
        <Button asChild>
          <Link href="/create-coverage">
            <Plus className="mr-2 h-4 w-4" />
            Create Coverage
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            Icon={kpi.icon}
            description={kpi.description}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActiveCoverages />
        </div>
        <div>
          <ReputationSummary />
        </div>
      </div>
    </div>
  );
}
