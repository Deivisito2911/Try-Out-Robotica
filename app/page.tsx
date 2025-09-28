"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface StudentInfo {
  nombre: string
  apellido: string
  grado: string
}

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

const questions: Question[] = [
  {
    id: 1,
    question:
      "¿Qué Alejandro mrc bloque de evento debes usar para que un personaje comience a moverse cuando el usuario presiona la tecla de espacio en el teclado?",
    options: [
      "Al hacer clic en este objeto",
      "Al presionar la tecla espacio",
      "Al recibir [mensaje1]",
      "Al comenzar como clon",
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "¿Qué es un Sprite en programación visual como Scratch?",
    options: ["Es un bloque que nos permite hacer animaciones", "Es el personaje al cual le damos la programación que ejecutara", "Un personaje que solamente podemos pintar", "Todas las anteriores"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "¿Qué bloque de control usarías para que tu personaje repita una secuencia de movimientos 5 veces?",
    options: ["por siempre", "repetir 5", "si...entonces", "esperar 5 veces"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "¿Cuál de los siguientes bloques se usa para que un personaje diga algo en la pantalla?",
    options: [
      "tocar sonido",
      "pensar... por 2 segundos",
      "decir ¡Hola! por 2 segundos",
      "cambiar disfraz a [disfraz1]",
    ],
    correctAnswer: 2,
  },
  {
    id: 5,
    question:
      "Quieres que un personaje se esconda cuando lo tocas. ¿Qué tipo de bloque usarías para detectar el toque?",
    options: ["si...entonces", "esperar hasta que...", "tocando puntero del ratón?", "por siempre"],
    correctAnswer: 2,
  },
  {
    id: 6,
    question:
      "Nos permite detectar objetos en nuestro entorno y reaccionar a ellos",
    options: [
      "Sensor de color",
      "Sensor ultrasónico",
      "Sensor pulsador",
      "Todas las anteriores",
    ],
    correctAnswer: 3,
  },
  {
    id: 7,
    question:
      "Si quieres que un robot o un personaje se detenga por un momento antes de seguir moviéndose, ¿qué bloque es el más adecuado?",
    options: ["esperar hasta que...", "esperar 1 segundos", "detener todos", "ir a x: 0 y: 0"],
    correctAnswer: 1,
  },
  {
    id: 8,
    question:
      "Son necesarios para que un robot pueda funcionar correctamente y responder a su entorno",
    options: [
      "Tarjeta programable, baterias, motores",
      "Programación, sensores, actuadores",
      "Ruedas, estructura, cables",
      "Todas las anteriores",
    ],
    correctAnswer: 3,
  },
  {
    id: 9,
    question:
      "¿Cuál es el bloque de control que se usa para ejecutar un código solo si se cumple una condición específica?",
    options: ["por siempre", "repetir [10]", "si...entonces", "detener este script"],
    correctAnswer: 2,
  },
  {
    id: 10,
    question:
      "¿Qué es la robótica?",
    options: [
      "La rama de la ciencia que solo se encarga de la programación de computadoras.",
      "La integración de varias ramas de la ingeniería para crear máquinas que realizan tareas de forma automática.",
      "El campo que solo estudia el uso de herramientas y máquinas para realizar tareas sencillas.",
      "El estudio de cómo construir robots que se ven y actúan como humanos.",
    ],
    correctAnswer: 1,
  },
]

export default function RoboticsQuiz() {
  const [step, setStep] = useState<"info" | "quiz" | "results">("info")
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    nombre: "",
    apellido: "",
    grado: "",
  })
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")

  useEffect(() => {
    if (step === "results") {
      const timer = setTimeout(() => {
        generatePDF()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [step])

  const handleStudentInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (studentInfo.nombre && studentInfo.apellido && studentInfo.grado) {
      setStep("quiz")
    }
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer !== "") {
      const newAnswers = [...answers, Number.parseInt(selectedAnswer)]
      setAnswers(newAnswers)

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer("")
      } else {
        // Show confirmation dialog before finishing
        const confirmed = window.confirm(
          "¿Seguro que deseas enviar el formulario con estas respuestas?\n\nUna vez enviado no podrás modificar tus respuestas.",
        )
        if (confirmed) {
          setStep("results")
        } else {
          // If not confirmed, don't add the answer and stay on current question
          setAnswers(answers)
        }
      }
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      // Restore the previous answer
      setSelectedAnswer(answers[currentQuestion - 1]?.toString() || "")
      // Remove the last answer from the array
      setAnswers(answers.slice(0, -1))
    }
  }

  const restartQuiz = () => {
    setStep("info")
    setStudentInfo({ nombre: "", apellido: "", grado: "" })
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer("")
  }

  const calculateScore = () => {
    let correct = 0
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++
      }
    })
    return correct
  }

  const generatePDF = () => {
    const score = calculateScore()
    const percentage = Math.round((score / questions.length) * 100)

    let report = `UNIDAD EDUCATIVA MARIANO PICON SALAS\n`
    report += `Try Out de Robótica - Resultados\n\n`
    report += `Estudiante: ${studentInfo.nombre} ${studentInfo.apellido}\n`
    report += `Grado: ${studentInfo.grado}\n`
    report += `Fecha: ${new Date().toLocaleDateString("es-ES")}\n\n`
    report += `Calificación: ${score}/${questions.length} (${percentage}%)\n\n`
    report += `RESPUESTAS DETALLADAS:\n\n`

    questions.forEach((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer
      report += `${index + 1}. ${question.question}\n`
      report += `Respuesta: ${question.options[answers[index]]}\n`
      if (isCorrect) {
        report += `✓ Correcta\n\n`
      } else {
        report += `✗ Incorrecta. Respuesta correcta: ${question.options[question.correctAnswer]}\n\n`
      }
    })

    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${studentInfo.nombre}_${studentInfo.apellido}_TryOut_Robotica.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const score = step === "results" ? calculateScore() : 0
  const percentage = step === "results" ? Math.round((score / questions.length) * 100) : 0

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-blue-900 text-white py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
            <img
              src="/logo.png"
              alt="Logo Unidad Educativa Mariano Picon Salas"
              className="w-14 h-14 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = '<div class="text-blue-900 font-bold text-xl">UEMPS</div>'
                }
              }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Unidad Educativa Mariano Picon Salas</h1>
            <p className="text-blue-100">Try Out de Robótica Periodo 2025-2026</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 py-8">
        {step === "info" && (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-blue-900 font-bold text-xl">INFO</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Información del Estudiante</h2>
              <p className="text-gray-600">Por favor, completa tus datos antes de comenzar el cuestionario</p>
            </div>
            <form onSubmit={handleStudentInfoSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={studentInfo.nombre}
                  onChange={(e) => setStudentInfo({ ...studentInfo, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  id="apellido"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={studentInfo.apellido}
                  onChange={(e) => setStudentInfo({ ...studentInfo, apellido: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="grado" className="block text-sm font-medium text-gray-700">
                  Grado
                </label>
                <select
                  id="grado"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={studentInfo.grado}
                  onChange={(e) => setStudentInfo({ ...studentInfo, grado: e.target.value })}
                  required
                >
                  <option value="">Selecciona tu grado</option>
                  <option value="1er Grado">1er Grado</option>
                  <option value="2do Grado">2do Grado</option>
                  <option value="3er Grado">3er Grado</option>
                  <option value="4to Grado">4to Grado</option>
                  <option value="5to Grado">5to Grado</option>
                  <option value="6to Grado">6to Grado</option>
                  <option value="1er Año">1er Año</option>
                  <option value="2do Año">2do Año</option>
                  <option value="3er Año">3er Año</option>
                  <option value="4to Año">4to Año</option>
                  <option value="5to Año">5to Año</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors"
              >
                Comenzar Cuestionario
              </button>
            </form>
          </div>
        )}

        {step === "quiz" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                Pregunta {currentQuestion + 1} de {questions.length}
              </span>
              <div className="text-sm text-gray-600">
                {studentInfo.nombre} {studentInfo.apellido}
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-900 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-6 leading-relaxed text-gray-900">
                {questions[currentQuestion].question}
              </h3>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={index.toString()}
                      checked={selectedAnswer === index.toString()}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      className="w-4 h-4 text-blue-900 focus:ring-blue-500"
                    />
                    <span className="flex-1 text-gray-900">
                      {String.fromCharCode(97 + index)}) {option}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                {currentQuestion > 0 && (
                  <button
                    onClick={goToPreviousQuestion}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>←</span>
                    Pregunta Anterior
                  </button>
                )}

                <button
                  onClick={handleAnswerSubmit}
                  disabled={selectedAnswer === ""}
                  className={`${currentQuestion > 0 ? "flex-1" : "w-full"} bg-blue-900 text-white py-3 px-4 rounded-md hover:bg-blue-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors`}
                >
                  {currentQuestion < questions.length - 1 ? "Siguiente Pregunta" : "Finalizar Cuestionario"}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "results" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Cuestionario Completado!</h2>
              <p className="text-gray-600 mb-6">
                {studentInfo.nombre} {studentInfo.apellido} - {studentInfo.grado}
              </p>

              <div className="text-center mb-6">
                <div className="text-lg text-blue-900 font-semibold mb-4">
                  Has completado exitosamente el Try Out de Robótica
                </div>
                <div className="text-gray-600 bg-blue-50 p-4 rounded-lg">
                  <p className="font-medium">Espera los resultados</p>
                  <p className="text-sm mt-2">
                    Los resultados serán evaluados y comunicados posteriormente por el equipo de robótica.
                  </p>
                  <p className="text-sm mt-2 text-green-600 font-medium">
                    El comprobante se descargará automáticamente
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={generatePDF}
                  className="w-full bg-blue-900 text-white py-3 px-4 rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>📄</span>
                  Descargar Comprobante
                </button>

                <button
                  onClick={restartQuiz}
                  className="w-full bg-yellow-500 text-blue-900 py-3 px-4 rounded-md hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <span>🏠</span>
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
