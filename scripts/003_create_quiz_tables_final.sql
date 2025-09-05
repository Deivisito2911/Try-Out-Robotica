-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  grado TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_responses table
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  respuestas JSONB NOT NULL,
  calificacion INTEGER NOT NULL,
  total_preguntas INTEGER NOT NULL DEFAULT 10,
  porcentaje DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for public access since this is a quiz without authentication
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses DISABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_student_id ON quiz_responses(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_created_at ON quiz_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_calificacion ON quiz_responses(calificacion DESC);
