-- Step 1: Add the new client_id column to the reports table
ALTER TABLE reports
ADD COLUMN client_id UUID;

-- Step 2: Add the foreign key constraint
-- This assumes the 'clients' table already exists.
-- The ON DELETE SET NULL means if a client is deleted, the report's client_id will be set to NULL.
-- You could also use ON DELETE CASCADE if you want to delete all reports of a deleted client.
ALTER TABLE reports
ADD CONSTRAINT fk_client
FOREIGN KEY (client_id)
REFERENCES clients(id)
ON DELETE SET NULL;

-- Step 3: (Optional but recommended) Create an index on the new foreign key column for performance
CREATE INDEX idx_reports_client_id ON reports(client_id);

-- Step 4: Drop the old, text-based 'client' column
ALTER TABLE reports
DROP COLUMN client;
