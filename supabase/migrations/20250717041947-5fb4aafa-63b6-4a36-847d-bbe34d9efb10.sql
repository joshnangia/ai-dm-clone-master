-- Add new columns to conversations table for conversation type and goal
ALTER TABLE public.conversations 
ADD COLUMN conversation_type TEXT,
ADD COLUMN goal TEXT;