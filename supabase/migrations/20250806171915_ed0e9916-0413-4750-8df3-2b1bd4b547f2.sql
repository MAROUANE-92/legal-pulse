-- Create timeline_events table
CREATE TABLE public.timeline_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    submission_id UUID NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('fact', 'upload', 'procedure', 'reminder')),
    title TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

-- Create policies for client access
CREATE POLICY "Clients can view their timeline events" 
ON public.timeline_events 
FOR SELECT 
USING (
    submission_id IN (
        SELECT id FROM public.Soumissions_formulaires_form_clients 
        WHERE form_id = auth.uid()
    )
);

CREATE POLICY "Clients can create their timeline events" 
ON public.timeline_events 
FOR INSERT 
WITH CHECK (
    submission_id IN (
        SELECT id FROM public.Soumissions_formulaires_form_clients 
        WHERE form_id = auth.uid()
    )
    AND event_type IN ('fact', 'upload')
);

CREATE POLICY "Clients can update their timeline events" 
ON public.timeline_events 
FOR UPDATE 
USING (
    submission_id IN (
        SELECT id FROM public.Soumissions_formulaires_form_clients 
        WHERE form_id = auth.uid()
    )
    AND event_type IN ('fact', 'upload')
);

CREATE POLICY "Clients can delete their timeline events" 
ON public.timeline_events 
FOR DELETE 
USING (
    submission_id IN (
        SELECT id FROM public.Soumissions_formulaires_form_clients 
        WHERE form_id = auth.uid()
    )
    AND event_type IN ('fact', 'upload')
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_timeline_events_updated_at
BEFORE UPDATE ON public.timeline_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_timeline_events_submission_id ON public.timeline_events(submission_id);
CREATE INDEX idx_timeline_events_date ON public.timeline_events(event_date);

-- Create export function
CREATE OR REPLACE FUNCTION public.export_timeline_csv(p_submission_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    csv_content TEXT;
BEGIN
    -- Check if user has access to this submission
    IF NOT EXISTS (
        SELECT 1 FROM public.Soumissions_formulaires_form_clients 
        WHERE id = p_submission_id AND form_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    -- Build CSV content
    SELECT string_agg(
        concat(
            '"', to_char(event_date, 'DD/MM/YYYY HH24:MI'), '",',
            '"', event_type, '",',
            '"', replace(title, '"', '""'), '"'
        ), 
        E'\n'
    ) INTO csv_content
    FROM public.timeline_events
    WHERE submission_id = p_submission_id
    ORDER BY event_date;

    -- Add header
    csv_content := 'Date,Type,Titre' || E'\n' || COALESCE(csv_content, '');

    RETURN csv_content;
END;
$$;