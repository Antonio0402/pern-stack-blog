CREATE DATABASE blog;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;

CREATE TABLE public.user_profiles (
  user_id uuid PRIMARY KEY DEFAULT public.uuid_generate_v4() NOT NULL,
  username TEXT UNIQUE NOT NULL
  CONSTRAINT proper_username CHECK (username ~* '^[a-zA-Z0-9_]+$')
  CONSTRAINT username_length CHECK (char_length(username) > 3 AND char_length(username) < 15),
  user_email VARCHAR(255),
  hashed_password VARCHAR(255) NOT NULL,
  pic TEXT
);

ALTER TABLE public.user_profiles ADD COLUMN refresh_token TEXT


CREATE TABLE public.session(
  sid VARCHAR NOT NULL COLLATE "default",
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE public.session ADD CONSTRAINT session_pkey PRIMARY KEY(sid) NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX IDX_session_expires ON public.session(expire);

TRUNCATE TABLE public.user_profiles RESTART IDENTITY CASCADE;