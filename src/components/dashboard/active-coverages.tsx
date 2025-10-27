'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function ActiveCoverages() {
  const { coverages } = useAuth();
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Active Coverages</CardTitle>
          <CardDescription>
            An overview of your current and past policies.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/create-coverage">
            New Coverage
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Coverage</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coverages.length > 0 ? (
              coverages.map((coverage) => (
                <TableRow key={coverage.id}>
                  <TableCell className="font-medium">{coverage.id}</TableCell>
                  <TableCell>{coverage.category}</TableCell>
                  <TableCell>{coverage.value} PYUSD</TableCell>
                  <TableCell>{coverage.fee}%</TableCell>
                  <TableCell>{coverage.duration} days</TableCell>
                  <TableCell>
                    <Badge
                      variant={coverage.status === 'Active' ? 'default' : 'secondary'}
                      className={coverage.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                    >
                      {coverage.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="#">View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  You have no coverages yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
