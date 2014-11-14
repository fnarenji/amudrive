CREATE TABLE client (
  idClient SERIAL PRIMARY KEY,
  userName VARCHAR(30) NOT NULL,
  firstName VARCHAR(30) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  address VARCHAR(512) NOT NULL,
  mail VARCHAR(127) NOT NULL CONSTRAINT mail_UNIQUE UNIQUE,
  password VARCHAR(129) NOT NULL CHECK (LENGTH(password) = 128),
  registrationTime TIMESTAMP NOT NULL DEFAULT now(),
  messagingParameters INT NOT NULL,
  centersOfInterest VARCHAR(45) NOT NULL,
  phoneNumber VARCHAR(20) NOT NULL,
  mailNotifications BOOLEAN NOT NULL,
  phoneNotifications BOOLEAN NOT NULL,
  newsletter BOOLEAN NOT NULL);

INSERT INTO client VALUES (DEFAULT, 'aze', 'mdr', 'ptdr', 'swag', 'lel@oklm.kom', 'a48c25f7ec82996486b5a8387cc4e147c628c1f48ae8c868561474fbc5eaf4bec44af63f002681aa8dd32f0dfde1bac24b44d7d6014b73fd26025d94e8f58d3b', DEFAULT, 2, 'lesgroessesqueues', '1337133749', TRUE, TRUE, TRUE);
INSERT INTO client VALUES (DEFAULT, 'swag', 'hipster', 'wallah', 'oklm', 'trkl@bonbukkake.jap', '1e31d1b64272d08cfa09d838305d9926a0720bf1abe498ed5b9a06df6ffd00304929c212edd3d60e7295965ccbced6120c2a113f0c199840930f47f62aa33a1f', DEFAULT, 2, 'goutugoutu', '1337133749', TRUE, TRUE, TRUE);

 
CREATE TABLE campus (
  idCampus SERIAL PRIMARY KEY,
  address VARCHAR(512) NOT NULL,
  name VARCHAR(45) NOT NULL UNIQUE);

INSERT INTO campus VALUES (DEFAULT, '413 avenue Gaston Berger, 13625 Aix-en-Provence', 'IUT Aix-en-Provence');
INSERT INTO campus VALUES (DEFAULT, '3 avenue Robert Schuman, 13100 Aix-en-Provence', 'Fac de droit d''Aix-en-provence');
INSERT INTO campus VALUES (DEFAULT, 'Médiathèque d''Arles, 13200 Arles', 'Fac de droit d''Arles');

CREATE TYPE BV AS ENUM ('M', 'A');

CREATE TABLE vehicle (
  idVehicle SERIAL,
  idClient INT NOT NULL REFERENCES client ON DELETE RESTRICT,
  name VARCHAR(60) NOT NULL,
  bv BV NOT NULL DEFAULT 'M',
  animals BOOLEAN NOT NULL,
  smoking BOOLEAN NOT NULL,
  eat BOOLEAN NOT NULL,
  PRIMARY KEY(idVehicle, idClient));
  
INSERT INTO vehicle VALUES (DEFAULT, 2, 'RENAULT CLIO V12 TWIN TURBO OKLM', 'M', false, false, false);
  
CREATE TABLE carPooling (
  idCarPooling SERIAL PRIMARY KEY,
  address VARCHAR(512) NOT NULL,
  long REAL NOT NULL,
  lat REAL NOT NULL,
  idCampus SERIAL REFERENCES campus ON DELETE RESTRICT,
  idClient INT NOT NULL REFERENCES client ON DELETE RESTRICT,
  idVehicle INT NOT NULL,
  campusToAddress BOOLEAN NOT NULL,
  room INT NOT NULL,
  luggage INT NOT NULL,
  meetTime timestamp  NOT NULL,
  price numeric(5,2) NOT NULL,
  CONSTRAINT fk_vehicle
    FOREIGN KEY (idVehicle, idClient)
    REFERENCES vehicle (idVehicle, idClient)
    ON DELETE RESTRICT);
  
INSERT INTO carPooling VALUES (DEFAULT, 'Gare Saint Charles, Marseille', 40.0, 40.0, 1, 2, 1, true, 4, 0, to_timestamp('2014-12-12 07:58:00', 'YYYY-MM-DD HH24:MI:SS'), 0);

CREATE TABLE joins (
  idCarPooling SERIAL,
  idClient INT NOT NULL REFERENCES client ON DELETE RESTRICT,
  accept BOOLEAN NOT NULL,
  PRIMARY KEY (idCarPooling, idClient));

CREATE TABLE comment (
  idClient INT NOT NULL REFERENCES client ON DELETE RESTRICT,
  idCarPooling INT NOT NULL REFERENCES carPooling ON DELETE RESTRICT,
  idMessage SERIAL NOT NULL,
  comment VARCHAR(1024) NOT NULL,
  poolingMark INT NOT NULL,
  driverMark INT NOT NULL,
  PRIMARY KEY (idClient, idCarPooling, idMessage),
  CONSTRAINT fk_joins
    FOREIGN KEY (idClient , idCarPooling)
    REFERENCES joins (idCarPooling, idClient)
    ON DELETE RESTRICT);

CREATE INDEX fk_client_idx ON joins(idClient ASC);

CREATE INDEX fk_carpooling_idx ON joins(idCarPooling ASC);

CREATE INDEX fk_campus_idx ON carPooling(idcampus ASC);

CREATE INDEX fk_client_carPooling_idx ON carPooling(idClient ASC);

CREATE INDEX fk_client_vehicule_idx ON vehicle(idClient ASC);