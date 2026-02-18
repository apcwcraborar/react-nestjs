# Personal Profile + Guestbook (React + NestJS + Supabase)

## Project Structure

- `backend`: NestJS API with guestbook CRUD
- `frontend`: React app with profile + guestbook UI

## 1) Create Supabase table

Run this SQL in your Supabase SQL editor:

```sql
create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  created_at timestamptz not null default now()
);
```

## 2) Configure backend env

In `backend`, copy `.env.example` to `.env` and set values:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- optional `PORT` and `FRONTEND_URL`

## 3) Configure frontend env

In `frontend`, copy `.env.example` to `.env` and set:

- `VITE_API_URL` (default `http://localhost:3000`)

## 4) Run backend

```bash
cd myprofile/backend
npm run start:dev
```

## 5) Run frontend

```bash
cd myprofile/frontend
npm run dev
```

## API Endpoints

- `GET /guestbook`
- `POST /guestbook`
- `PUT /guestbook/:id`
- `DELETE /guestbook/:id`

POST/PUT body shape:

```json
{
  "name": "Jane",
  "message": "Hello!"
}
```
