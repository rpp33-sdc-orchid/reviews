CREATE DATABASE sdc_reviews;

\c sdc_reviews;

CREATE TABLE review (
  id serial primary key,
  product_id integer,
  rating smallint,
  date bigint,
  summary varchar,
  body varchar,
  recommend boolean,
  reported boolean,
  reviewer_name varchar,
  reviewer_email varchar,
  response varchar,
  helpfulness smallint
);

CREATE TABLE photo (
  id serial primary key,
  review_id serial,
  url varchar,
  foreign key (review_id) references review (id)
);

CREATE TABLE characteristic (
  id serial primary key,
  product_id integer,
  name varchar
);

CREATE TABLE review_characteristic (
  id serial primary key,
  characteristic_id serial,
  review_id serial,
  value smallint,
  foreign key (review_id) references review (id),
  foreign key (characteristic_id) references characteristic (id)
);

SELECT setval(pg_get_serial_sequence('review', 'id'), coalesce(max(id), 0)+1 , false) FROM review;
SELECT setval(pg_get_serial_sequence('photo', 'id'), coalesce(max(id), 0)+1 , false) FROM photo;
SELECT setval(pg_get_serial_sequence('characteristic', 'id'), coalesce(max(id), 0)+1 , false) FROM characteristic;
SELECT setval(pg_get_serial_sequence('review_characteristic', 'id'), coalesce(max(id), 0)+1 , false) FROM review_characteristic;