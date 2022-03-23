CREATE DATABASE sdc_reviews;

\c sdc_reviews;

CREATE TABLE review (
  id serial not null,
  primary key (id),
  product_id integer,
  rating smallint,
  summary varchar(60),
  recommend boolean,
  response varchar,
  body varchar(1000),
  creation_date date,
  reviewer_name varchar,
  helpfulness smallint,
  email varchar,
  reported boolean
);

CREATE TABLE photo (
  id serial not null,
  primary key (id),
  photo_url varchar,
  review_id serial,
  foreign key (review_id) references review (id)
);

CREATE TABLE characteristic (
  id serial not null,
  primary key (id),
  product_id integer,
  category varchar
);

CREATE TABLE review_characteristic (
  id serial not null,
  primary key (id),
  review_id serial,
  characteristic_id serial,
  foreign key (review_id) references review (id),
  foreign key (characteristic_id) references characteristic (id)
);