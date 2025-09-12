// src/app/api/tasks/route.ts
import { NextResponse, NextRequest } from "next/server";
import { authMiddleware } from "@/middleware/auth.middleware";
import {
  getTasksByProject,
  getProjectByTaskId,
  createTask,
  updateTask,
  updateTaskStatus,
} from "@/modules/tasks/services/task.service";
import { getUserProjects } from "@/modules/projects/services/project.service";

export async function GET(request: NextRequest) {
  try {
    const auth = authMiddleware(request);
    if (auth instanceof NextResponse) return auth;

    const user_id = Number(request.headers.get("x-user-id"));
    const { searchParams } = new URL(request.url);
    const project_id = Number(searchParams.get("project_id"));

    if (!project_id) {
      return NextResponse.json(
        { error: "Missing project_id" },
        { status: 400 }
      );
    }

    const userProjects = await getUserProjects(user_id);
    if (!userProjects.find((p) => p.id === project_id)) {
      return NextResponse.json(
        { error: "Access denied to project" },
        { status: 403 }
      );
    }

    const tasks = await getTasksByProject(Number(project_id));
    return NextResponse.json(tasks);
  } catch (err: any) {
    console.error("Error GET /api/tasks:", err);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authMiddleware(request);
    if (auth instanceof NextResponse) return auth;

    const user_id = Number(request.headers.get("x-user-id"));

    const body = await request.json();
    const { project_id, title, priority, assigned_to } = body;

    if (!project_id || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userProjects = await getUserProjects(user_id);
    if (!userProjects.find((p) => p.id === Number(project_id))) {
      return NextResponse.json(
        { error: "Access denied to project" },
        { status: 403 }
      );
    }

    const task = await createTask(
      Number(project_id),
      title,
      Number(priority || 0),
      assigned_to ? Number(assigned_to) : null
    );
    return NextResponse.json(task, { status: 201 });
  } catch (err: any) {
    console.error("Error POST /api/tasks:", err);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = authMiddleware(request);
    if (auth instanceof NextResponse) return auth;

    const user_id = Number(request.headers.get("x-user-id"));

    const body = await request.json();
    const { task_id, status, fields } = body;

    if (!task_id) {
      return NextResponse.json({ error: "Missing task_id" }, { status: 400 });
    }

    // Obtener project_id de la tarea
    const project_id = await getProjectByTaskId(Number(task_id));
    if (!project_id) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    // Validar que el usuario pertenece al proyecto
    const userProjects = await getUserProjects(user_id);
    if (!userProjects.find((p) => p.id === Number(project_id))) {
      return NextResponse.json(
        { error: "Access denied to task" },
        { status: 403 }
      );
    }

    let updatedTask = null;

    if (status) {
      updatedTask = await updateTaskStatus(Number(task_id), status);
    } else if (fields) {
      updatedTask = await updateTask(Number(task_id), fields);
    } else {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    return NextResponse.json(updatedTask);
  } catch (err: any) {
    console.error("Error PATCH /api/tasks:", err);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
