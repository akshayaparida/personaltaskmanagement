'use client';

import { useEffect, useState } from 'react';
import StatsCard from '@/components/dashboard/StatsCard';
import { TaskList } from '@/components/dashboard/TaskList';
import { ProjectList } from '@/components/dashboard/ProjectList';
import { CategoryList } from '@/components/dashboard/CategoryList';
import { ListTodo, Clock, CheckSquare, Briefcase } from 'lucide-react';

interface DashboardStats {
    totalTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    totalProjects: number;
    tasksTrend: string;
    progressTrend: string;
    completedTrend: string;
    projectsTrend: string;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/dashboard/stats');
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard 
                    title="Total Tasks" 
                    value={stats?.totalTasks ?? 0} 
                    trend={stats?.tasksTrend ?? '0%'} 
                    icon={ListTodo}
                />
                <StatsCard 
                    title="In Progress" 
                    value={stats?.inProgressTasks ?? 0} 
                    trend={stats?.progressTrend ?? '0%'} 
                    icon={Clock}
                />
                <StatsCard 
                    title="Completed" 
                    value={stats?.completedTasks ?? 0} 
                    trend={stats?.completedTrend ?? '0%'} 
                    icon={CheckSquare}
                />
                <StatsCard 
                    title="Projects" 
                    value={stats?.totalProjects ?? 0} 
                    trend={stats?.projectsTrend ?? '0%'} 
                    icon={Briefcase}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <TaskList />
                <ProjectList />
            </div>

            <CategoryList />
        </div>
    );
}