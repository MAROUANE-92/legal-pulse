-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('raw-files', 'raw-files', false);

-- Create RLS policies for raw-files bucket  
CREATE POLICY "Users can view their own files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'raw-files');

CREATE POLICY "Users can upload their own files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'raw-files');

CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'raw-files');

CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'raw-files');

-- Add missing columns to answers table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'answers' AND column_name = 'id') THEN
        ALTER TABLE public.answers ADD COLUMN id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'answers' AND column_name = 'updated_at') THEN
        ALTER TABLE public.answers ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
    END IF;
END $$;

-- Create trigger for updating timestamps
DROP TRIGGER IF EXISTS update_answers_updated_at ON public.answers;
CREATE TRIGGER update_answers_updated_at
BEFORE UPDATE ON public.answers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();