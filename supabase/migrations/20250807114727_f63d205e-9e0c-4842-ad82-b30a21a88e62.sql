-- Create invites table
CREATE TABLE public.invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  invited_by UUID REFERENCES auth.users(id)
);

-- Create submissions table  
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT DEFAULT 'draft',
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add trigger for updated_at on submissions
CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on invites table
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Create policy for clients to see their own invite
CREATE POLICY "Client can see own invite"
  ON public.invites FOR SELECT
  USING (email = auth.email());

-- Enable RLS on submissions table  
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for clients to own their submissions
CREATE POLICY "Client owns his submission"
  ON public.submissions FOR ALL
  USING (user_id = auth.uid());