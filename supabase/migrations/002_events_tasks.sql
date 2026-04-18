-- Events table
create table events (
  id uuid default gen_random_uuid() primary key,
  application_id uuid references applications(id) on delete set null,
  company_id uuid references companies(id) on delete set null,
  event_type text not null,
  title text not null,
  event_date timestamptz not null,
  duration_min int,
  location text,
  status text default '待处理',
  notes text,
  created_at timestamptz default now(),
  user_id text not null
);

-- Tasks table
create table tasks (
  id uuid default gen_random_uuid() primary key,
  application_id uuid references applications(id) on delete set null,
  company_id uuid references companies(id) on delete set null,
  title text not null,
  description text,
  due_date date,
  priority text default 'medium',
  status text default 'todo',
  source text default 'manual',
  created_at timestamptz default now(),
  user_id text not null
);

-- Indexes
create index idx_events_user on events(user_id);
create index idx_events_date on events(event_date);
create index idx_tasks_user on tasks(user_id);
create index idx_tasks_status on tasks(status);

-- RLS
alter table events enable row level security;
alter table tasks enable row level security;

create policy "Allow all" on events for all using (true) with check (true);
create policy "Allow all" on tasks for all using (true) with check (true);
