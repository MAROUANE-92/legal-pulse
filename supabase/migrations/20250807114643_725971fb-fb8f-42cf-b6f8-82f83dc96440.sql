-- Enable RLS on invites table
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Create policy for clients to see their own invite
CREATE POLICY "Client can see own invite"
  ON invites FOR SELECT
  USING (email = auth.email());

-- Enable RLS on submissions table  
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for clients to own their submissions
CREATE POLICY "Client owns his submission"
  ON submissions FOR ALL
  USING (user_id = auth.uid());