"use client"
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { TaskList } from './TaskList';
import { ProjectList } from './ProjectList';
import { CategoryList } from './CategoryList';
import { LayoutGrid, FolderKanban, Tags } from 'lucide-react';

interface StatsCardProps {
  readonly title: string;
  readonly value: number;
  readonly Icon: React.ElementType;
}

function StatsCard({ title, value, Icon }: StatsCardProps) {
  return (
    <Card>
      <div className="p-6 flex items-center space-x-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </Card>
  );
}

export function Dashboard() {
  const {
    stats,
    isLoading,
    error,
    fetchDashboardData
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Card className="p-4 bg-destructive/10">
        <p className="text-destructive">Error: {error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Tasks"
          value={stats.tasksCount}
          Icon={LayoutGrid}
        />
        <StatsCard
          title="Active Projects"
          value={stats.projectsCount}
          Icon={FolderKanban}
        />
        <StatsCard
          title="Categories"
          value={stats.categoriesCount}
          Icon={Tags}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
            <TaskList />
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
            <ProjectList />
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <CategoryList />
          </div>
        </Card>
      </div>
    </div>
  );
}