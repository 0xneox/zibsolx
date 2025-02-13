-- Drop existing tables if they exist
drop table if exists profiles;
drop table if exists wallet_connections;

-- Create profiles table
create table profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique,
    email text unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create wallet_connections table
create table wallet_connections (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references profiles(id) on delete cascade,
    wallet_address text not null,
    wallet_type text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, wallet_address)
);

-- Enable RLS
alter table profiles enable row level security;
alter table wallet_connections enable row level security;

-- Create policies
create policy "Users can view own profile"
    on profiles for select
    using ( auth.uid() = id );

create policy "Users can update own profile"
    on profiles for update
    using ( auth.uid() = id );

create policy "Users can view own wallet connections"
    on wallet_connections for select
    using ( auth.uid() = user_id );

create policy "Users can insert own wallet connections"
    on wallet_connections for insert
    with check ( auth.uid() = user_id );

create policy "Users can delete own wallet connections"
    on wallet_connections for delete
    using ( auth.uid() = user_id );
