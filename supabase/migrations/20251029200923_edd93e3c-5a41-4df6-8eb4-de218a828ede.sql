-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback (public submissions)
CREATE POLICY "Anyone can submit feedback"
ON public.feedback
FOR INSERT
TO public
WITH CHECK (true);

-- Create index for faster queries by date
CREATE INDEX idx_feedback_created_at ON public.feedback(created_at DESC);