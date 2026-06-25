-- Run this in your Supabase SQL Editor
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS whatsapp_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS images_received BOOLEAN DEFAULT FALSE;
