"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import ProtectedRoute from "@/components/ProtectedRoute";

interface ProjectStats {
  project_id: number;
  project_name: string;
  pending_tasks: number;
  completed_tasks: number;
  discarded_tasks: number;
}

interface UserTaskStats {
  total: number;
  pending: number;
  completed: number;
  discarded: number;
}

export default function AnalyticsPage() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [stats, setStats] = useState<ProjectStats[]>([]);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/projects`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    }
    if (token) fetchStats();
  }, [token]);

  const [taskStats, setTaskStats] = useState<UserTaskStats | null>(null);

  useEffect(() => {
    async function fetchTaskStats() {
      const res = await fetch("/api/analytics/tasks/assigned", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTaskStats(data);
      }
    }

    if (token) fetchTaskStats();
  }, [token]);

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Projects Analytics</h1>
        <div className="space-y-4">
          {stats.map((s) => (
            <Card key={s.project_id}>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold">{s.project_name}</h2>
                <p>Pendientes: {s.pending_tasks}</p>
                <p>Completadas: {s.completed_tasks}</p>
                <p>Descartadas: {s.discarded_tasks}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <hr className="mt-6"/>
        <h1 className="text-2xl font-bold my-4">Personal Analytics</h1>
        <div className="space-y-4 mt-6">
          {taskStats && (
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold">Mis Tareas</h2>
                <p>Total: {taskStats.total}</p>
                <p>Pendientes: {taskStats.pending}</p>
                <p>Completadas: {taskStats.completed}</p>
                <p>Descartadas: {taskStats.discarded}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
