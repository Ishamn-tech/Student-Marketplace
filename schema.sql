-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  phone text not null unique,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Allow public read access to profiles" 
  on public.profiles for select 
  using (true);

create policy "Allow users to insert their own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

create policy "Allow users to update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);


-- 2. PRODUCTS TABLE
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  price numeric not null default 0,
  category text not null,
  image text not null,
  images text[] default '{}'::text[] not null,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  seller_name text not null,
  available integer not null default 1,
  sold integer not null default 0,
  type text not null check (type in ('sell', 'rent')),
  rent_duration integer,
  rent_price numeric,
  late_fee_per_day numeric,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Products
alter table public.products enable row level security;

-- Products Policies
create policy "Allow public read access to products" 
  on public.products for select 
  using (true);

create policy "Allow authenticated users to insert products" 
  on public.products for insert 
  with check (auth.role() = 'authenticated');

create policy "Allow sellers to update their own products" 
  on public.products for update 
  using (auth.uid() = seller_id);

create policy "Allow sellers to delete their own products" 
  on public.products for delete 
  using (auth.uid() = seller_id);


-- 3. REVIEWS TABLE
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  user_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Reviews
alter table public.reviews enable row level security;

-- Reviews Policies
create policy "Allow public read access to reviews" 
  on public.reviews for select 
  using (true);

create policy "Allow authenticated users to insert reviews" 
  on public.reviews for insert 
  with check (auth.role() = 'authenticated');

create policy "Allow users to delete/update their own reviews" 
  on public.reviews for all 
  using (auth.uid() = user_id);


-- 4. ORDERS TABLE (Transactions)
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  total numeric not null,
  payment_method text not null,
  status text not null default 'completed',
  delivery_date text,
  delivery_time text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Orders
alter table public.orders enable row level security;

-- Orders Policies
create policy "Allow users to view their own orders" 
  on public.orders for select 
  using (auth.uid() = user_id);

create policy "Allow authenticated users to create orders" 
  on public.orders for insert 
  with check (auth.role() = 'authenticated');


-- 5. ORDER ITEMS TABLE
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer not null,
  price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Order Items
alter table public.order_items enable row level security;

-- Order Items Policies
create policy "Allow users to view their own order items" 
  on public.order_items for select 
  using (
    exists (
      select 1 from public.orders o 
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

create policy "Allow authenticated users to insert order items" 
  on public.order_items for insert 
  with check (auth.role() = 'authenticated');


-- 6. RENTALS TABLE
create table public.rentals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  rented_date timestamp with time zone default timezone('utc'::text, now()) not null,
  return_date timestamp with time zone not null,
  actual_return_date timestamp with time zone,
  late_fee numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Rentals
alter table public.rentals enable row level security;

-- Rentals Policies
create policy "Allow users to view their own rentals" 
  on public.rentals for select 
  using (auth.uid() = user_id);

create policy "Allow authenticated users to insert rentals" 
  on public.rentals for insert 
  with check (auth.role() = 'authenticated');


-- 7. TRIGGER: AUTO-CREATE PROFILE ON SIGNUP
-- Extracts metadata passed from signup options (name, phone)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, phone, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 8. SEED DATA FOR MOCK USERS & PRODUCTS
-- We create dummy auth profiles for the mock sellers (with unique UUIDs)
insert into public.profiles (id, email, phone, name) values
  ('11111111-1111-1111-1111-111111111111', 'priya.sharma@newhorizonindia.edu', '9876543210', 'Priya Sharma'),
  ('22222222-2222-2222-2222-222222222222', 'ankit.verma@newhorizonindia.edu', '9876543211', 'Ankit Verma'),
  ('33333333-3333-3333-3333-333333333333', 'sneha.patel@newhorizonindia.edu', '9876543212', 'Sneha Patel'),
  ('44444444-4444-4444-4444-444444444444', 'arjun.mehta@newhorizonindia.edu', '9876543213', 'Arjun Mehta'),
  ('55555555-5555-5555-5555-555555555555', 'kavya.iyer@newhorizonindia.edu', '9876543214', 'Kavya Iyer')
on conflict (id) do nothing;

-- Insert Mock Products
insert into public.products (id, name, description, price, category, image, images, seller_id, seller_name, available, sold, type, rent_duration, rent_price, late_fee_per_day) values
  -- Sell items
  ('a1111111-1111-1111-1111-111111111111', 'Modern Art Poster - Abstract Design', 'Beautiful abstract art poster perfect for dorm room decoration', 150, 'poster', 'https://images.unsplash.com/photo-1613759007428-9d918fe2d36f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwb3N0ZXIlMjBkZXNpZ258ZW58MXx8fHwxNzcyMTY4MjM1fDA&ixlib=rb-4.1.0&q=80&w=1080', '{ "https://images.unsplash.com/photo-1613759007428-9d918fe2d36f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwb3N0ZXIlMjBkZXNpZ258ZW58MXx8fHwxNzcyMTY4MjM1fDA&ixlib=rb-4.1.0&q=80&w=1080" }', '11111111-1111-1111-1111-111111111111', 'Priya Sharma', 5, 12, 'sell', null, null, null),
  ('a2222222-2222-2222-2222-222222222222', 'Geometric Wallpaper Design', 'Premium quality geometric pattern wallpaper for room makeover', 300, 'wallpaper', 'https://images.unsplash.com/photo-1675783385707-365fe9c76dde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YWxscGFwZXIlMjBwYXR0ZXJuJTIwZGVzaWdufGVufDF8fHx8MTc3MjE2ODIzNXww&ixlib=rb-4.1.0&q=80&w=1080', '{ "https://images.unsplash.com/photo-1675783385707-365fe9c76dde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YWxscGFwZXIlMjBwYXR0ZXJuJTIwZGVzaWdufGVufDF8fHx8MTc3MjE2ODIzNXww&ixlib=rb-4.1.0&q=80&w=1080" }', '22222222-2222-2222-2222-222222222222', 'Ankit Verma', 8, 5, 'sell', null, null, null),
  ('a3333333-3333-3333-3333-333333333333', 'Hand-drawn Portrait Sketch', 'Custom portrait sketch, great for gifts', 500, 'sketch', 'https://images.unsplash.com/photo-1720248090619-95d555f01bfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW5jaWwlMjBza2V0Y2glMjBkcmF3aW5nfGVufDF8fHx8MTc3MjE2ODIzNnww&ixlib=rb-4.1.0&q=80&w=1080', '{ "https://images.unsplash.com/photo-1720248090619-95d555f01bfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW5jaWwlMjBza2V0Y2glMjBkcmF3aW5nfGVufDF8fHx8MTc3MjE2ODIzNnww&ixlib=rb-4.1.0&q=80&w=1080" }', '33333333-3333-3333-3333-333333333333', 'Sneha Patel', 3, 15, 'sell', null, null, null),
  ('a4444444-4444-4444-4444-444444444444', 'Professional Lab Coat - Size M', 'High quality white lab coat, perfect condition', 800, 'labcoat', 'https://images.unsplash.com/photo-1581094487815-d1df47182343?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGxhYiUyMGNvYXR8ZW58MXx8fHwxNzcyMTY4MjM2fDA&ixlib=rb-4.1.0&q=80&w=1080', '{ "https://images.unsplash.com/photo-1581094487815-d1df47182343?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGxhYiUyMGNvYXR8ZW58MXx8fHwxNzcyMTY4MjM2fDA&ixlib=rb-4.1.0&q=80&w=1080" }', '11111111-1111-1111-1111-111111111111', 'Priya Sharma', 2, 8, 'sell', null, null, null),
  ('a5555555-5555-5555-5555-555555555555', 'Casio Scientific Calculator', 'FX-991ES Plus, barely used, all functions working', 600, 'calculator', 'https://images.unsplash.com/photo-1574607383077-47ddc2dc51c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbnRpZmljJTIwY2FsY3VsYXRvcnxlbnwxfHx8fDE3NzIwODE2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080', '{ "https://images.unsplash.com/photo-1574607383077-47ddc2dc51c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbnRpZmljJTIwY2FsY3VsYXRvcnxlbnwxfHx8fDE3NzIwODE2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080" }', '44444444-4444-4444-4444-444444444444', 'Arjun Mehta', 1, 3, 'sell', null, null, null),
  ('a6666666-6666-6666-6666-666666666666', 'Engineering Textbooks Bundle', 'Set of 5 core engineering textbooks in excellent condition', 2500, 'textbook', 'https://images.unsplash.com/photo-1588912914017-923900a34710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwdGV4dGJvb2tzJTIwc3R1ZHl8ZW58MXx8fHwxNzcyMTY4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080', '{ "https://images.unsplash.com/photo-1588912914017-923900a34710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwdGV4dGJvb2tzJTIwc3R1ZHl8ZW58MXx8fHwxNzcyMTY4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080" }', '55555555-5555-5555-5555-555555555555', 'Kavya Iyer', 1, 2, 'sell', null, null, null),
  ('a7777777-7777-7777-7777-777777777777', 'Hostel Essential Kit', 'Complete hostel essentials: bucket, mug, hangers, toiletries organizer', 400, 'hostel-essential', 'https://images.unsplash.com/photo-1549881567-c622c1080d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3N0ZWwlMjBkb3JtJTIwcm9vbXxlbnwxfHx8fDE3NzIxNjgyMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080', '{ "https://images.unsplash.com/photo-1549881567-c622c1080d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3N0ZWwlMjBkb3JtJTIwcm9vbXxlbnwxfHx8fDE3NzIxNjgyMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080" }', '22222222-2222-2222-2222-222222222222', 'Ankit Verma', 4, 10, 'sell', null, null, null),
  ('a8888888-8888-8888-8888-888888888888', 'Abstract Canvas Painting', 'Original hand-painted abstract art on canvas', 1200, 'painting', 'https://images.unsplash.com/photo-1681235014294-588fea095706?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc3MjEwNjc1NHww&ixlib=rb-4.1.0&q=80&w=1080', '{ "https://images.unsplash.com/photo-1681235014294-588fea095706?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc3MjEwNjc1NHww&ixlib=rb-4.1.0&q=80&w=1080" }', '33333333-3333-3333-3333-333333333333', 'Sneha Patel', 2, 4, 'sell', null, null, null),
  
  -- Rent items
  ('b1111111-1111-1111-1111-111111111111', 'Previous Year Question Papers - CSE', 'Complete set of last 5 years question papers for all subjects', 0, 'textbook', 'https://images.unsplash.com/photo-1588912914017-923900a34710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwdGV4dGJvb2tzJTIwc3R1ZHl8ZW58MXx8fHwxNzcyMTY4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080', '{ "https://images.unsplash.com/photo-1588912914017-923900a34710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwdGV4dGJvb2tzJTIwc3R1ZHl8ZW58MXx8fHwxNzcyMTY4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080" }', '44444444-4444-4444-4444-444444444444', 'Arjun Mehta', 3, 0, 'rent', 7, 50, 10),
  ('b2222222-2222-2222-2222-222222222222', 'Module Prints - Semester 5', 'All module prints for 5th semester, spiral bound', 0, 'textbook', 'https://images.unsplash.com/photo-1588912914017-923900a34710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwdGV4dGJvb2tzJTIwc3R1ZHl8ZW58MXx8fHwxNzcyMTY4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080', '{ "https://images.unsplash.com/photo-1588912914017-923900a34710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwdGV4dGJvb2tzJTIwc3R1ZHl8ZW58MXx8fHwxNzcyMTY4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080" }', '55555555-5555-5555-5555-555555555555', 'Kavya Iyer', 5, 0, 'rent', 14, 30, 5)
on conflict (id) do nothing;

-- Insert Mock Reviews
insert into public.reviews (id, product_id, user_id, user_name, rating, comment, created_at) values
  ('c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Arjun Mehta', 5, 'Excellent quality! Looks great in my room.', timezone('utc'::text, '2026-02-20'::timestamp)),
  ('c2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'Kavya Iyer', 4, 'Beautiful work! Very detailed.', timezone('utc'::text, '2026-02-15'::timestamp)),
  ('c3333333-3333-3333-3333-333333333333', 'a5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Priya Sharma', 5, 'Works perfectly! Great deal.', timezone('utc'::text, '2026-02-18'::timestamp))
on conflict (id) do nothing;
