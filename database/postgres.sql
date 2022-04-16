-- initialize database and table(s)
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

-- \copy csv files from filepath for ETL process
\COPY review FROM '/Users/mac/HRRPP33/sdc-csv-files/reviews.csv' DELIMITER ',' CSV HEADER;
\COPY photo FROM '/Users/mac/HRRPP33/sdc-csv-files/reviews_photos.csv' DELIMITER ',' CSV HEADER;
\COPY characteristic FROM '/Users/mac/HRRPP33/sdc-csv-files/characteristics.csv' DELIMITER ',' CSV HEADER;
\COPY review_characteristic FROM '/Users/mac/HRRPP33/sdc-csv-files/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

-- manually synchronize any out-of-synch serial primary key id
SELECT setval(pg_get_serial_sequence('review', 'id'), coalesce(max(id), 0)+1 , false) FROM review;
SELECT setval(pg_get_serial_sequence('photo', 'id'), coalesce(max(id), 0)+1 , false) FROM photo;
SELECT setval(pg_get_serial_sequence('characteristic', 'id'), coalesce(max(id), 0)+1 , false) FROM characteristic;
SELECT setval(pg_get_serial_sequence('review_characteristic', 'id'), coalesce(max(id), 0)+1 , false) FROM review_characteristic;

-- indexing ids for query optimization
CREATE INDEX ON review(product_id);
CREATE INDEX ON photo(review_id);
CREATE INDEX ON characteristic(product_id);
CREATE INDEX ON review_characteristic(characteristic_id);
CREATE INDEX ON review_characteristic(review_id);
