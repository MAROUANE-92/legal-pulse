-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('raw-files', 'raw-files', false);

-- Create RLS policies for raw-files bucket
CREATE POLICY "Users can view their own files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'raw-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'raw-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'raw-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'raw-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create table for tracking file uploads in questionnaire answers
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id TEXT NOT NULL,
  question_slug TEXT NOT NULL,
  value JSONB,
  uploaded_file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(submission_id, question_slug)
);

-- Enable RLS on answers table
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- Create policies for answers table
CREATE POLICY "Users can view their own answers"
ON public.answers
FOR SELECT
USING (true); -- For now, allow all access

CREATE POLICY "Users can insert their own answers"
ON public.answers
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own answers"
ON public.answers
FOR UPDATE
USING (true);

-- Create trigger for updating timestamps
CREATE TRIGGER update_answers_updated_at
BEFORE UPDATE ON public.answers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();