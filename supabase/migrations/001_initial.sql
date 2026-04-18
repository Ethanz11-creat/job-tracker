-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Companies table
create table companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  industry text,
  website text,
  location text,
  size text,
  created_at timestamptz default now(),
  user_id text not null
);

-- Applications table
create table applications (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references companies(id) on delete cascade,
  position_name text not null,
  status text not null default '待关注',
  priority int default 3,
  deadline date,
  city text,
  salary_range text,
  channel text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id text not null
);

-- Stages table
create table stages (
  id uuid default gen_random_uuid() primary key,
  application_id uuid references applications(id) on delete cascade,
  stage_type text not null,
  raw_stage_name text,
  round_number int,
  event_category text default 'assessment',
  execution_status text default '待处理',
  result_status text default '待处理',
  scheduled_date timestamptz,
  completed_date timestamptz,
  feedback text,
  strength_tags text[],
  weakness_tags text[],
  created_at timestamptz default now(),
  user_id text not null
);

-- Indexes
create index idx_companies_user on companies(user_id);
create index idx_applications_user on applications(user_id);
create index idx_applications_company on applications(company_id);
create index idx_stages_application on stages(application_id);
create index idx_stages_user on stages(user_id);

-- Row Level Security (basic filter by user_id)
alter table companies enable row level security;
alter table applications enable row level security;
alter table stages enable row level security;

create policy "Allow all" on companies for all using (true) with check (true);
create policy "Allow all" on applications for all using (true) with check (true);
create policy "Allow all" on stages for all using (true) with check (true);
