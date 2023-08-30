export type User = {
  user_id: string;
  username: string;
  hashed_password: string;
  user_email?: string;
  pic?: string;
  refresh_token?: string;
}