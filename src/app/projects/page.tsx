"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Project {
  id: number;
  name: string;
  description: string;
  owner_id: number;
  created_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function fetchProjects() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    setProjects(data);
  }

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });
    if (res.ok) {
      setName("");
      setDescription("");
      fetchProjects();
    }
  }

  useEffect(() => {
    if (token) fetchProjects();
  }, [token]);

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Mis Proyectos</h1>

        <form onSubmit={createProject} className="space-y-2 mb-8">
          <Input
            placeholder="Nombre del proyecto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Button type="submit">Crear proyecto</Button>
        </form>

        <div className="grid gap-4">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`}>
              <Card key={p.id}>
                <CardContent className="p-4">
                  <h2 className="font-semibold">{p.name}</h2>
                  <p className="text-sm text-gray-600">{p.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
