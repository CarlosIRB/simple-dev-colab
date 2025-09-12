"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

function parseJwt(token: string | null) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getUserIdFromToken(token: string | null): number | null {
  const payload = parseJwt(token);
  if (!payload) return null;
  return (payload.id ?? payload.userId)
    ? Number(payload.id ?? payload.userId)
    : null;
}

type Task = {
  id: number;
  project_id: number;
  title: string;
  priority: number;
  assigned_to: number | null;
  assigned_user_name: string | null;
  status: "pending" | "completed" | "discarded";
  editing?: boolean;
};

type Project = {
  id: number;
  name: string;
  description: string;
  created_by: number;
};

type UserSuggestion = {
  id: number;
  name: string;
  email: string;
};

type Member = { id: number; name: string; email: string };

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";

  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<number>(0);
  const [memberEmail, setMemberEmail] = useState("");
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [members, setMembers] = useState<{ id: number; name: string; email: string }[]>([]);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    setUserId(getUserIdFromToken(t));
  }, []);

  useEffect(() => {
    if (!token || userId === null) return;

    async function fetchProject() {
      const res = await fetch(`${apiBase}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      } else if (res.status === 401) {
        router.push("/login");
      }
    }

    async function fetchTasks() {
      const res = await fetch(`${apiBase}/api/tasks?project_id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.map((t: Task) => ({ ...t, editing: false })));
      }
    }

    async function fetchMembers() {
      const res = await fetch(`${apiBase}/api/projects/${id}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMembers(data); 

      }
    }

    fetchMembers();
    fetchProject();
    fetchTasks();
  }, [token, userId, id, apiBase, router]);

  if (!token || userId === null) {
    return <p>Cargando...</p>;
  }

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle) return;
    await fetch(`${apiBase}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newTitle,
        project_id: id,
        priority: newPriority,
      }),
    });
    setNewTitle("");
    setNewPriority(0);
    refreshTasks();
  }

  async function refreshTasks() {
    const res = await fetch(`${apiBase}/api/tasks?project_id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setTasks(data.map((t: Task) => ({ ...t, editing: false })));
    }
  }

  async function handleSaveTitle(task: Task) {
    await fetch(`${apiBase}/api/tasks`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ task_id: task.id, fields: { title: task.title } }),
    });
    refreshTasks();
  }

  async function handleChangeStatus(task: Task, status: Task["status"]) {
    await fetch(`${apiBase}/api/tasks`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ task_id: task.id, status }),
    });
    refreshTasks();
  }

  async function handleChangePriority(task: Task, priority: number) {
    await fetch(`${apiBase}/api/tasks`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ task_id: task.id, fields: { priority } }),
    });
    refreshTasks();
  }

  async function handleClaim(task: Task) {
    await fetch(`${apiBase}/api/tasks`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        task_id: task.id,
        fields: { assigned_to: userId },
      }),
    });
    refreshTasks();
  }

  async function handleDelete(taskId: number) {
    if (!confirm("¿Eliminar esta tarea?")) return;
    await fetch(`${apiBase}/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    refreshTasks();
  }

  async function fetchSuggestions(query: string) {
    if (!query) return setSuggestions([]);
    const res = await fetch(
      `${apiBase}/api/users/search?email=${encodeURIComponent(query)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) {
      const data = await res.json();
      const list = data.results as UserSuggestion[];
      setSuggestions(list);
    }
  }

  async function addMember(email: string) {
    const res = await fetch(`${apiBase}/api/projects/${id}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      alert("El correo no existe o no se pudo agregar");
    }
    setMemberEmail("");
    setSuggestions([]);
  }

  function getStatusClasses(status: Task["status"]) {
    if (status === "completed") return "border-green-300 bg-green-50";
    if (status === "pending") return "border-yellow-300 bg-yellow-50";
    return "border-red-300 bg-red-50"; // discarded
  }

 
  return (
    <ProtectedRoute>
      <div className="p-6 max-w-3xl mx-auto">
      {/* Header proyecto */}
      <div className="flex items-center justify-between mb-4">
        <div>
          {project && (
            <>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <p className="text-sm text-gray-600">{project.description}</p>
            </>
          )}
        </div>
        <div>
          <Link
            href="/projects"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Volver a proyectos
          </Link>
        </div>
      </div>

      {/* Crear tarea */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Crear tarea</h2>
        <form onSubmit={createTask} className="flex gap-2 items-center">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Título de la tarea"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(Number(e.target.value))}
            className="border rounded px-2 py-2"
          >
            <option value={0}>P0</option>
            <option value={1}>P1</option>
            <option value={2}>P2</option>
            <option value={3}>P3</option>
            <option value={4}>P4</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Crear
          </button>
        </form>
      </section>

      {/* Lista de tareas */}
      <section className="mb-8 space-y-3">
        <h2 className="text-lg font-semibold">Tareas</h2>
        {tasks.length === 0 && (
          <p className="text-sm text-gray-500">No hay tareas</p>
        )}
        {tasks.map((t) => (
          <div
            key={t.id}
            className={`border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between ${getStatusClasses(t.status)}`}
          >
            <div className="flex-1">
              {t.editing ? (
                <input
                  className="w-full border rounded px-2 py-1 mb-1"
                  value={t.title}
                  onChange={(e) =>
                    setTasks((prev) =>
                      prev.map((x) =>
                        x.id === t.id ? { ...x, title: e.target.value } : x
                      )
                    )
                  }
                />
              ) : (
                <h3 className="font-semibold">{t.title}</h3>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Asignado: {t.assigned_user_name ?? "Sin asignar"} · Prioridad: P
                {t.priority} · Estado: {t.status}
              </div>
            </div>

            <div className="mt-3 md:mt-0 flex items-center gap-2">
              {t.editing ? (
                <>
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    onClick={async () => {
                      await handleSaveTitle(t);
                      setTasks((prev) =>
                        prev.map((x) =>
                          x.id === t.id ? { ...x, editing: false } : x
                        )
                      );
                    }}
                  >
                    Guardar
                  </button>
                  <button
                    className="border px-3 py-1 rounded"
                    onClick={() =>
                      setTasks((prev) =>
                        prev.map((x) =>
                          x.id === t.id ? { ...x, editing: false } : x
                        )
                      )
                    }
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  className="border px-3 py-1 rounded"
                  onClick={() =>
                    setTasks((prev) =>
                      prev.map((x) =>
                        x.id === t.id ? { ...x, editing: true } : x
                      )
                    )
                  }
                >
                  Editar
                </button>
              )}

              <select
                value={t.status}
                onChange={async (e) =>
                  handleChangeStatus(t, e.target.value as Task["status"])
                }
                className="border rounded px-2 py-1"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="discarded">Discarded</option>
              </select>

              <select
                value={t.priority}
                onChange={async (e) =>
                  handleChangePriority(t, Number(e.target.value))
                }
                className="border rounded px-2 py-1"
              >
                <option value={0}>P0</option>
                <option value={1}>P1</option>
                <option value={2}>P2</option>
                <option value={3}>P3</option>
                <option value={4}>P4</option>
              </select>

              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => handleClaim(t)}
              >
                Reclamar
              </button>

              {project?.created_by === userId && (
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(t.id)}
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      {members?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Miembros del proyecto</h2>
          <ul className="border rounded p-2 space-y-1 bg-white">
            {members.map((m) => (
              <li key={m.id} className="flex justify-between text-sm">
                <span>{m.name}</span>
                <span className="text-gray-500">{m.email}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {project?.created_by === userId && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Agregar miembros</h2>
          <div className="mb-2">
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Correo electrónico"
              value={memberEmail}
              onChange={(e) => {
                setMemberEmail(e.target.value);
                fetchSuggestions(e.target.value);
              }}
            />
          </div>

          {suggestions.length > 0 && (
            <div className="bg-white border rounded p-2 space-y-1">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-1"
                >
                  <div className="text-sm">{s.email}</div>
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                    onClick={() => addMember(s.email)}
                  >
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
      </div>
    </ProtectedRoute>
  );
}
