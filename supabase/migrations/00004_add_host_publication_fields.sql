/*
# Add Host Publication Fields to Results Table

## Changes
- Add `published_by_host` boolean column (default: false)
- Add `published_by_host_at` timestamptz column (nullable)

## Purpose
Implements two-stage publication workflow:
1. Judge publishes results → visible to Host only
2. Host publishes results → visible in Hall of Fame (public)

## Security
- No RLS changes needed (existing policies apply)
- Host can update published_by_host field
*/

-- Add published_by_host column
ALTER TABLE results 
ADD COLUMN IF NOT EXISTS published_by_host boolean DEFAULT false NOT NULL;

-- Add published_by_host_at column
ALTER TABLE results 
ADD COLUMN IF NOT EXISTS published_by_host_at timestamptz;

-- Update existing results to have published_by_host = false
UPDATE results 
SET published_by_host = false 
WHERE published_by_host IS NULL;
