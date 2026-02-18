-- This SQL script creates the todos table in your PostgreSQL database
-- Run this manually if you can't use the automated migration tools

CREATE TABLE IF NOT EXISTS "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Optional: Create some sample data
INSERT INTO "todos" ("title", "description", "completed") VALUES
  ('Sample Todo 1', 'This is a sample todo item', false),
  ('Sample Todo 2', 'Another sample item', true),
  ('Sample Todo 3', 'Yet another example', false);
