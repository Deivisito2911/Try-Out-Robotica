import { NextResponse } from "next/server"
import { correctAnswers, supabaseRest } from "@/lib/supabase-rest"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const respuestas = Array.isArray(body.respuestas) ? body.respuestas.map(Number) : []
    if (!body.nombre || !body.apellido || !body.grado || respuestas.length !== correctAnswers.length || respuestas.some((answer) => !Number.isInteger(answer) || answer < 0 || answer > 3)) return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    const puntaje_total = respuestas.reduce((total, answer, index) => total + (answer === correctAnswers[index] ? 1 : 0), 0)
    const result = await supabaseRest("resultados_tryout", { method: "POST", body: JSON.stringify({ nombre: String(body.nombre).trim(), apellido: String(body.apellido).trim(), grado: String(body.grado).trim(), respuestas, puntaje_total }) })
    return NextResponse.json({ result })
  } catch { return NextResponse.json({ error: "No se pudo guardar el resultado" }, { status: 500 }) }
}
