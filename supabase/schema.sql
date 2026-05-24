-- EquiManager · Complete Supabase Schema
-- Run this in your Supabase SQL Editor

-- ─── Extensions ───────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ─── ENUMS ────────────────────────────────────────────────────────
create type horse_sex       as enum ('stallion','mare','gelding');
create type horse_status    as enum ('active','retired','sold','deceased');
create type shoe_type       as enum ('shod','unshod','orthopedic','barefoot_trim');
create type contract_type   as enum ('fulltime','parttime','freelance','internship','weekend');
create type groom_status    as enum ('active','leave','inactive');
create type med_status      as enum ('active','completed','cancelled');
create type med_category    as enum ('gastro','nsaid','antibiotic','supplement','other');
create type task_priority   as enum ('low','medium','high','urgent');
create type task_status     as enum ('pending','inprogress','done','skipped');
create type shift_type      as enum ('morning','afternoon','full','variable');
create type transaction_type as enum ('income','expense');
create type vacc_status     as enum ('ok','soon','urgent','overdue');
create type user_role       as enum ('owner','manager','vet','groom','readonly');

-- ─── STABLES (multi-tenant) ───────────────────────────────────────
create table stables (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  address     text,
  city        text,
  country     text default 'BE',
  phone       text,
  email       text,
  logo_url    text,           -- Cloudinary URL
  locale      text default 'nl',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─── PROFILES (extends auth.users) ───────────────────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  stable_id   uuid references stables(id) on delete cascade,
  full_name   text,
  avatar_url  text,           -- Cloudinary URL
  role        user_role default 'groom',
  locale      text default 'nl',
  phone       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─── HORSES ───────────────────────────────────────────────────────
create table horses (
  id              uuid primary key default uuid_generate_v4(),
  stable_id       uuid not null references stables(id) on delete cascade,
  name            text not null,
  breed           text,
  sex             horse_sex,
  date_of_birth   date,
  color           text,
  markings        text,
  chip_number     text unique,
  passport_number text,
  weight_kg       numeric(6,1),
  height_cm       numeric(5,1),
  box_number      text,
  discipline      text,
  status          horse_status default 'active',
  owner_name      text,
  purchase_date   date,
  purchase_price  numeric(10,2),
  insurance_number text,
  notes           text,
  photo_url       text,       -- Cloudinary URL
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table horse_photos (
  id          uuid primary key default uuid_generate_v4(),
  horse_id    uuid not null references horses(id) on delete cascade,
  url         text not null,  -- Cloudinary URL
  public_id   text,           -- Cloudinary public_id
  caption     text,
  taken_at    date,
  created_at  timestamptz default now()
);

-- ─── GROOMS ───────────────────────────────────────────────────────
create table grooms (
  id              uuid primary key default uuid_generate_v4(),
  stable_id       uuid not null references stables(id) on delete cascade,
  profile_id      uuid references profiles(id) on delete set null,
  first_name      text not null,
  last_name       text not null,
  email           text,
  phone           text,
  date_of_birth   date,
  emergency_contact text,
  role            text default 'Groom',
  contract        contract_type default 'fulltime',
  status          groom_status default 'active',
  start_date      date,
  end_date        date,
  hours_per_week  numeric(4,1),
  hourly_rate     numeric(6,2),
  certification   text,
  specializations text[],
  working_days    text[],     -- ['mon','tue','wed','thu','fri']
  shift           shift_type default 'full',
  notes           text,
  avatar_url      text,       -- Cloudinary URL
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table groom_horse_assignments (
  id          uuid primary key default uuid_generate_v4(),
  groom_id    uuid not null references grooms(id) on delete cascade,
  horse_id    uuid not null references horses(id) on delete cascade,
  assigned_at timestamptz default now(),
  unique(groom_id, horse_id)
);

-- ─── HOOF CARE ────────────────────────────────────────────────────
create table hoof_treatments (
  id              uuid primary key default uuid_generate_v4(),
  horse_id        uuid not null references horses(id) on delete cascade,
  stable_id       uuid not null references stables(id) on delete cascade,
  farrier_name    text,
  treatment_date  date not null,
  next_due_date   date,
  shoe_type       shoe_type default 'shod',
  condition_score smallint check (condition_score between 1 and 5),
  front_left      text,
  front_right     text,
  rear_left       text,
  rear_right      text,
  notes           text,
  cost            numeric(8,2),
  created_by      uuid references profiles(id),
  created_at      timestamptz default now()
);

-- ─── DEWORMING ────────────────────────────────────────────────────
create table dewormings (
  id              uuid primary key default uuid_generate_v4(),
  horse_id        uuid not null references horses(id) on delete cascade,
  stable_id       uuid not null references stables(id) on delete cascade,
  treatment_date  date not null,
  next_due_date   date,
  product_name    text not null,
  active_ingredient text,
  dose_ml         numeric(6,2),
  fec_result      text,       -- fecal egg count
  fec_date        date,
  batch_number    text,
  cost            numeric(8,2),
  notes           text,
  created_by      uuid references profiles(id),
  created_at      timestamptz default now()
);

-- ─── MEDICATIONS ──────────────────────────────────────────────────
create table medications (
  id              uuid primary key default uuid_generate_v4(),
  horse_id        uuid not null references horses(id) on delete cascade,
  stable_id       uuid not null references stables(id) on delete cascade,
  product_name    text not null,
  active_ingredient text,
  category        med_category default 'other',
  dose            text,
  frequency       text,
  route           text,       -- oral, injection, topical
  reason          text,
  prescribed_by   text,
  start_date      date not null,
  end_date        date,
  status          med_status default 'active',
  withdrawal_days smallint default 0,
  cost_per_unit   numeric(8,2),
  units_total     numeric(8,2),
  notes           text,
  created_by      uuid references profiles(id),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table medication_logs (
  id            uuid primary key default uuid_generate_v4(),
  medication_id uuid not null references medications(id) on delete cascade,
  horse_id      uuid not null references horses(id) on delete cascade,
  given_at      timestamptz not null default now(),
  given_by      uuid references profiles(id),
  dose_given    text,
  notes         text,
  skipped       boolean default false,
  skip_reason   text
);

-- ─── VACCINATIONS ─────────────────────────────────────────────────
create table vaccinations (
  id              uuid primary key default uuid_generate_v4(),
  horse_id        uuid not null references horses(id) on delete cascade,
  stable_id       uuid not null references stables(id) on delete cascade,
  vaccine_type    text not null,
  product_name    text,
  batch_number    text,
  administered_by text,
  vaccination_date date not null,
  next_due_date   date,
  interval_months smallint,
  status          vacc_status default 'ok',
  site            text,       -- neck-left, neck-right
  cost            numeric(8,2),
  notes           text,
  created_by      uuid references profiles(id),
  created_at      timestamptz default now()
);

-- ─── DENTAL ───────────────────────────────────────────────────────
create table dental_checks (
  id              uuid primary key default uuid_generate_v4(),
  horse_id        uuid not null references horses(id) on delete cascade,
  stable_id       uuid not null references stables(id) on delete cascade,
  check_date      date not null,
  next_due_date   date,
  dentist_name    text,
  condition       text,       -- Excellent, Good, Fair, Attention
  findings        text,
  treatment_done  text,
  cost            numeric(8,2),
  notes           text,
  created_by      uuid references profiles(id),
  created_at      timestamptz default now()
);

-- ─── GENERAL HEALTH EVENTS ────────────────────────────────────────
create table health_events (
  id          uuid primary key default uuid_generate_v4(),
  horse_id    uuid not null references horses(id) on delete cascade,
  stable_id   uuid not null references stables(id) on delete cascade,
  event_date  timestamptz not null default now(),
  category    text not null, -- illness, injury, vet_visit, farrier, etc.
  title       text not null,
  description text,
  severity    text,          -- mild, moderate, severe
  resolved    boolean default false,
  resolved_at date,
  vet_name    text,
  cost        numeric(8,2),
  attachments text[],        -- Cloudinary URLs
  created_by  uuid references profiles(id),
  created_at  timestamptz default now()
);

-- ─── TASKS ────────────────────────────────────────────────────────
create table tasks (
  id            uuid primary key default uuid_generate_v4(),
  stable_id     uuid not null references stables(id) on delete cascade,
  horse_id      uuid references horses(id) on delete set null,
  groom_id      uuid references grooms(id) on delete set null,
  title         text not null,
  description   text,
  priority      task_priority default 'medium',
  status        task_status default 'pending',
  due_date      date,
  due_time      time,
  recurring     boolean default false,
  recur_pattern text,        -- daily, weekly, monthly
  completed_at  timestamptz,
  completed_by  uuid references profiles(id),
  created_by    uuid references profiles(id),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─── SCHEDULES / SHIFTS ───────────────────────────────────────────
create table shifts (
  id          uuid primary key default uuid_generate_v4(),
  stable_id   uuid not null references stables(id) on delete cascade,
  groom_id    uuid not null references grooms(id) on delete cascade,
  shift_date  date not null,
  shift_type  shift_type not null,
  start_time  time,
  end_time    time,
  notes       text,
  created_at  timestamptz default now()
);

-- ─── FINANCE ──────────────────────────────────────────────────────
create table financial_categories (
  id          uuid primary key default uuid_generate_v4(),
  stable_id   uuid not null references stables(id) on delete cascade,
  name        text not null,
  type        transaction_type not null,
  color       text default '#888780',
  icon        text,
  created_at  timestamptz default now()
);

create table financial_transactions (
  id              uuid primary key default uuid_generate_v4(),
  stable_id       uuid not null references stables(id) on delete cascade,
  horse_id        uuid references horses(id) on delete set null,
  groom_id        uuid references grooms(id) on delete set null,
  category_id     uuid references financial_categories(id) on delete set null,
  type            transaction_type not null,
  amount          numeric(10,2) not null,
  description     text not null,
  transaction_date date not null default current_date,
  invoice_number  text,
  receipt_url     text,       -- Cloudinary URL
  notes           text,
  created_by      uuid references profiles(id),
  created_at      timestamptz default now()
);

-- ─── DOCUMENTS ────────────────────────────────────────────────────
create table documents (
  id          uuid primary key default uuid_generate_v4(),
  stable_id   uuid not null references stables(id) on delete cascade,
  horse_id    uuid references horses(id) on delete cascade,
  groom_id    uuid references grooms(id) on delete cascade,
  title       text not null,
  category    text,           -- passport, insurance, contract, vet_report
  url         text not null,  -- Cloudinary URL
  public_id   text,
  file_type   text,
  file_size   integer,
  expires_at  date,
  created_by  uuid references profiles(id),
  created_at  timestamptz default now()
);

-- ─── INDEXES ──────────────────────────────────────────────────────
create index on horses(stable_id);
create index on horses(status);
create index on grooms(stable_id);
create index on hoof_treatments(horse_id);
create index on hoof_treatments(next_due_date);
create index on dewormings(horse_id);
create index on dewormings(next_due_date);
create index on medications(horse_id);
create index on medications(status);
create index on vaccinations(horse_id);
create index on vaccinations(next_due_date);
create index on tasks(stable_id, due_date);
create index on tasks(groom_id, status);
create index on financial_transactions(stable_id, transaction_date);
create index on shifts(stable_id, shift_date);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────
alter table stables                  enable row level security;
alter table profiles                 enable row level security;
alter table horses                   enable row level security;
alter table horse_photos             enable row level security;
alter table grooms                   enable row level security;
alter table groom_horse_assignments  enable row level security;
alter table hoof_treatments          enable row level security;
alter table dewormings               enable row level security;
alter table medications              enable row level security;
alter table medication_logs          enable row level security;
alter table vaccinations             enable row level security;
alter table dental_checks            enable row level security;
alter table health_events            enable row level security;
alter table tasks                    enable row level security;
alter table shifts                   enable row level security;
alter table financial_categories     enable row level security;
alter table financial_transactions   enable row level security;
alter table documents                enable row level security;

-- Helper: get stable_id from JWT
create or replace function get_my_stable_id()
returns uuid language sql stable as $$
  select stable_id from profiles where id = auth.uid()
$$;

-- Policies: users can only access their own stable
create policy "stable_access" on horses
  using (stable_id = get_my_stable_id());
create policy "stable_access" on grooms
  using (stable_id = get_my_stable_id());
create policy "stable_access" on hoof_treatments
  using (stable_id = get_my_stable_id());
create policy "stable_access" on dewormings
  using (stable_id = get_my_stable_id());
create policy "stable_access" on medications
  using (stable_id = get_my_stable_id());
create policy "stable_access" on vaccinations
  using (stable_id = get_my_stable_id());
create policy "stable_access" on dental_checks
  using (stable_id = get_my_stable_id());
create policy "stable_access" on health_events
  using (stable_id = get_my_stable_id());
create policy "stable_access" on tasks
  using (stable_id = get_my_stable_id());
create policy "stable_access" on shifts
  using (stable_id = get_my_stable_id());
create policy "stable_access" on financial_transactions
  using (stable_id = get_my_stable_id());
create policy "stable_access" on documents
  using (stable_id = get_my_stable_id());
create policy "own_profile" on profiles
  using (id = auth.uid());

-- ─── TRIGGERS: updated_at ─────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger set_updated_at before update on horses
  for each row execute function update_updated_at();
create trigger set_updated_at before update on grooms
  for each row execute function update_updated_at();
create trigger set_updated_at before update on medications
  for each row execute function update_updated_at();
create trigger set_updated_at before update on tasks
  for each row execute function update_updated_at();
create trigger set_updated_at before update on profiles
  for each row execute function update_updated_at();

-- ─── SEED: default financial categories ───────────────────────────
-- (Run after creating your first stable record)
-- insert into financial_categories (stable_id, name, type, color) values
--   ('<your-stable-id>', 'Stallage',   'income',  '#185FA5'),
--   ('<your-stable-id>', 'Training',   'income',  '#0F6E56'),
--   ('<your-stable-id>', 'Prizes',     'income',  '#534AB7'),
--   ('<your-stable-id>', 'Breeding',   'income',  '#BA7517'),
--   ('<your-stable-id>', 'Feed & Hay', 'expense', '#185FA5'),
--   ('<your-stable-id>', 'Vet',        'expense', '#0F6E56'),
--   ('<your-stable-id>', 'Farrier',    'expense', '#BA7517'),
--   ('<your-stable-id>', 'Staff',      'expense', '#534AB7'),
--   ('<your-stable-id>', 'Other',      'expense', '#888780');
