create extension if not exists "uuid-ossp";

create table users (
    id uuid not null default uuid_generate_v4() primary key,
    name text not null,
    email text,
    password text
);

create type cart_status as enum ('OPEN', 'ORDERED');

create table carts (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid not null references users(id),
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp,
    status cart_status default 'OPEN'
);

create table cart_items (
    id uuid not null default uuid_generate_v4() primary key,
    cart_id uuid not null references carts(id),
    product_id uuid not null,
    count integer not null
);

create type order_status as enum ('OPEN', 'APPROVED', 'CONFIRMED', 'SENT', 'COMPLETED', 'CANCELLED');

create table orders (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid not null references users(id),
    cart_id uuid not null references carts(id),
    payment json, 
    delivery json, 
    status order_status default 'OPEN',
    total float not null
);
