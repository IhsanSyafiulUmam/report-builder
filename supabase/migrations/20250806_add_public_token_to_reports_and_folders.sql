-- 20250806_add_public_token_to_reports_and_folders.sql
-- Add public_token to reports and folders for sharing functionality

alter table reports add column public_token text unique;

create table if not exists folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  user_id uuid references auth.users(id) on delete cascade,
  parent_id uuid references folders(id) on delete cascade,
  public_token text unique,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- If folders table already exists, just add the public_token column
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'folders') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'folders' AND column_name = 'public_token') THEN
      ALTER TABLE folders ADD COLUMN public_token text unique;
    END IF;
  END IF;
END $$;