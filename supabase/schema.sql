-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.memories enable row level security;
alter table public.reactions enable row level security;
alter table public.tributes enable row level security;
alter table public.donations enable row level security;
alter table public.gallery enable row level security;
alter table public.program_schedule enable row level security;
alter table public.biography enable row level security;

-- Create tables
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text,
  name text,
  constraint profiles_email_key unique (email)
);

create table public.memories (
  id uuid default uuid_generate_v4() primary key not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author_id uuid references public.profiles(id) on delete cascade,
  author_name text not null,
  content text not null,
  image_url text
);

create table public.reactions (
  id uuid default uuid_generate_v4() primary key not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  post_id uuid references public.memories(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  unique(post_id, user_id)
);

create table public.tributes (
  id uuid default uuid_generate_v4() primary key not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author_name text not null,
  content text not null,
  image_url text
);

create table public.donations (
  id uuid default uuid_generate_v4() primary key not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  donor_name text not null,
  email text,
  amount numeric not null,
  payment_method text not null,
  message text,
  status text not null default 'pending'
);

create table public.gallery (
  id uuid default uuid_generate_v4() primary key not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  url text not null,
  caption text,
  type text not null default 'image',
  format text
);

create table public.program_schedule (
  id uuid default uuid_generate_v4() primary key not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  event_date timestamp with time zone not null,
  title text not null,
  description text,
  location text not null,
  location_coords point
);

create table public.biography (
  id uuid default uuid_generate_v4() primary key not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null
);

-- Create indexes
create index memories_author_id_idx on public.memories(author_id);
create index reactions_post_id_idx on public.reactions(post_id);
create index reactions_user_id_idx on public.reactions(user_id);
create index program_schedule_event_date_idx on public.program_schedule(event_date);

-- Row Level Security Policies

-- Profiles: visible to all, editable by owner
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Memories: visible to all, editable by author
create policy "Memories are viewable by everyone"
  on public.memories for select
  using ( true );

create policy "Users can create memories"
  on public.memories for insert
  with check ( true );

create policy "Authors can update own memories"
  on public.memories for update
  using ( auth.uid() = author_id );

-- Reactions: visible to all, one per user per post
create policy "Reactions are viewable by everyone"
  on public.reactions for select
  using ( true );

create policy "Users can create reactions"
  on public.reactions for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own reactions"
  on public.reactions for update
  using ( auth.uid() = user_id );

-- Tributes: visible to all, insertable by anyone
create policy "Tributes are viewable by everyone"
  on public.tributes for select
  using ( true );

create policy "Anyone can create tributes"
  on public.tributes for insert
  with check ( true );

-- Donations: visible to admin only, insertable by anyone
create policy "Donations are private"
  on public.donations for select
  using ( auth.uid() in (
    select id from public.profiles where email = ANY(current_setting('app.admin_emails')::text[])
  ));

create policy "Anyone can create donations"
  on public.donations for insert
  with check ( true );

-- Gallery: visible to all, managed by admin
create policy "Gallery is viewable by everyone"
  on public.gallery for select
  using ( true );

-- Program Schedule: visible to all, managed by admin
create policy "Program schedule is viewable by everyone"
  on public.program_schedule for select
  using ( true );

-- Biography: visible to all, managed by admin
create policy "Biography is viewable by everyone"
  on public.biography for select
  using ( true );

-- Sample Data
insert into public.biography (content) values (
  '<h1>In Loving Memory</h1><p>This is a sample biography text...</p>'
);

insert into public.program_schedule (event_date, title, description, location, location_coords) values
  ('2025-06-21 10:00:00+00', 'Viewing', 'Family and friends gathering', 'Memorial Chapel', point(40.7128, -74.0060)),
  ('2025-06-21 11:00:00+00', 'Service', 'Memorial service', 'Memorial Chapel', point(40.7128, -74.0060)),
  ('2025-06-21 12:30:00+00', 'Reception', 'Celebration of life', 'Community Center', point(40.7130, -74.0065));
