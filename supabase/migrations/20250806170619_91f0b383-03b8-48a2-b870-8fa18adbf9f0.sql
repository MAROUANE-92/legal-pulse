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

-- Create function to update timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;