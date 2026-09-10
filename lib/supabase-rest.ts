const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function supabaseRest<T>(path: string, init: RequestInit = {}) {
  if (!supabaseUrl || !supabaseKey) throw new Error("Supabase no está configurado")
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, "Content-Type": "application/json", Prefer: "return=representation", ...init.headers },
    cache: "no-store",
  })
  if (!response.ok) throw new Error(await response.text())
  return response.status === 204 ? null : response.json() as Promise<T>
}

export const quizQuestions = [0, 1, 2, 3, 4, 5]
export const correctAnswers = [0, 1, 2, 0, 1, 0]
