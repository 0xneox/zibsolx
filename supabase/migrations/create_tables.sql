-- Create users table extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade,
  username text unique,
  email text unique,
  wallet_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Create RLS policies
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create wallet_connections table
create table public.wallet_connections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  wallet_address text not null,
  wallet_type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies for wallet_connections
alter table public.wallet_connections enable row level security;

create policy "Users can view their own wallet connections."
  on wallet_connections for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own wallet connections."
  on wallet_connections for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own wallet connections."
  on wallet_connections for update
  using ( auth.uid() = user_id );
