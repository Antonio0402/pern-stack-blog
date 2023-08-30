CREATE TABLE public.blogs (
  blog_id SERIAL PRIMARY KEY NOT NULL,
  user_id uuid REFERENCES public.user_profiles(user_id) NOT NULL,
  title TEXT,
  content TEXT,
  img TEXT,
  cate VARCHAR(255) NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE FUNCTION public.update_current_date()
RETURNS TRIGGER AS 
$update_date$
BEGIN
  NEW.date = NOW();
  RETURN NEW;
END;
$update_date$ LANGUAGE plpgsql;

CREATE TRIGGER update_date
BEFORE UPDATE
ON 
  public.blogs
FOR EACH ROW EXECUTE PROCEDURE public.update_current_date(); 