-- Schema und Startdaten des Werkstatt-Shops. Läuft beim ersten Start von Postgres.
create table if not exists products (
  id text primary key,
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  stock integer not null check (stock >= 0)
);

create table if not exists orders (
  id uuid primary key,
  customer_id text not null,
  status text not null check (status in ('draft', 'placed', 'paid', 'shipped', 'cancelled')),
  created_at timestamptz not null
);

create table if not exists order_items (
  order_id uuid not null references orders (id),
  product_id text not null references products (id),
  quantity integer not null check (quantity >= 1),
  price_cents integer not null check (price_cents >= 0),
  primary key (order_id, product_id)
);

insert into products (id, name, price_cents, stock) values
  ('p-hammer', 'Schlosserhammer 500 g', 1990, 25),
  ('p-zange', 'Kombizange 180 mm', 1490, 40),
  ('p-bits', 'Bit-Satz 32-teilig', 2490, 15)
on conflict (id) do nothing;
