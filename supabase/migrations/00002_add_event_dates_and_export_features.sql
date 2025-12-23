/*
# Add Event Date and Year Management

## Changes:
1. Add event_year and event_date to settings table
2. Add date field to competitions table for specific competition dates

## Purpose:
- Allow admin to manage competition dates year over year
- Support reusing the system annually
- Track specific dates for each competition

## Fields Added:
- settings.event_year (integer): The year of the event (e.g., 2025)
- settings.event_date (date): The main event date
- competitions.date (date): Specific date for each competition (optional)
*/

-- Add event year and date to settings
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS event_year integer DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
ADD COLUMN IF NOT EXISTS event_date date DEFAULT CURRENT_DATE;

-- Add date field to competitions
ALTER TABLE competitions 
ADD COLUMN IF NOT EXISTS date date;

-- Update existing settings row with current year and date
UPDATE settings 
SET event_year = EXTRACT(YEAR FROM CURRENT_DATE)::integer,
    event_date = CURRENT_DATE
WHERE id = 1;