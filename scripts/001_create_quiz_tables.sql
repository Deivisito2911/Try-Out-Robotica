-- Create students table to store student information
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  grado TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_responses table to store quiz answers and results
CREATE TABLE IF NOT EXISTS public.quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  respuestas JSONB NOT NULL, -- Store all answers as JSON
  calificacion INTEGER NOT NULL,
  total_preguntas INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for both tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for students table (allow all operations for now since this is a quiz app)
CREATE POLICY "Allow all operations on students" ON public.students
  FOR ALL USING (true) WITH CHECK (true);

-- Create policies for quiz_responses table
CREATE POLICY "Allow all operations on quiz_responses" ON public.quiz_responses
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_created_at ON public.students(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_student_id ON public.quiz_responses(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_created_at ON public.quiz_responses(created_at);
