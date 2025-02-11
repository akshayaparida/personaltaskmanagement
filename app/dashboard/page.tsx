// app/dashboard/page.tsx
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Task Management',
  description: 'View and manage your tasks, projects and categories',
};

export default function DashboardPage() {
  return <Dashboard />;
}