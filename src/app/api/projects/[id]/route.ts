// src/app/api/projects/[id]/route.ts

import { NextResponse, NextRequest } from "next/server";
import { getProjectById } from "@/modules/projects/services/project.service";
import { authMiddleware } from "@/middleware/auth.middleware";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authMiddleware(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  const project_id = Number(id);

  const result = await getProjectById(project_id);

  return NextResponse.json(result);
}
