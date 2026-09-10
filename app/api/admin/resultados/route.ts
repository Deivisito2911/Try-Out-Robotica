import { NextRequest, NextResponse } from "next/server"
import { supabaseRest } from "@/lib/supabase-rest"

export async function GET(request: NextRequest) {
  if (request.cookies.get("robotics_admin")?.value !== "authenticated") return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  try { const data = await supabaseRest("resultados_tryout?select=id,nombre,apellido,grado,respuestas,puntaje_total,created_at&order=created_at.desc"); return NextResponse.json({ data }) } catch { return NextResponse.json({ error: "No se pudieron cargar los resultados" }, { status: 500 }) }
}
