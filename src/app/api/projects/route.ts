// src/app/api/projects/route.ts
import { NextResponse, NextRequest } from "next/server";
import {
  getAllProjects,
  createProject,
  getUserProjects,
  addUserToProject,
} from "@/modules/projects/services/project.service";
import { authMiddleware } from "@/middleware/auth.middleware";

export async function GET(request: NextRequest) {
  try {
    const auth = authMiddleware(request);
    if (auth instanceof NextResponse) return auth;

    const user_id = Number(request.headers.get("x-user-id"));

    const projects = await getUserProjects(user_id);
    return NextResponse.json(projects);
  } catch (err: any) {
    console.error("Error GET /api/projects:", err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authMiddleware(request);
    if (auth instanceof NextResponse) return auth;

    const user_id = Number(request.headers.get('x-user-id'))
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Missing project name" }, { status: 400 });
    }

    const project = await createProject(name, description || null, user_id);

    await addUserToProject(project.id, user_id)
    
    return NextResponse.json(project, { status: 201 });
  } catch (err: any) {
    console.error("Error POST /api/projects:", err);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
