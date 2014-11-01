
CREATE TABLE client (
  idclient SERIAL,
  userName VARCHAR(30) NOT NULL,
  firstName VARCHAR(30) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  address VARCHAR(512) NOT NULL,
  mail VARCHAR(127) NOT NULL CONSTRAINT mail_UNIQUE UNIQUE,
  password VARCHAR(64) NOT NULL,
  registrationTime TIMESTAMP NOT NULL DEFAULT now(),
  paramMessagerie INT NOT NULL,
  centresInt VARCHAR(45) NOT NULL,
  numTel VARCHAR(20) NOT NULL,
  notifM BOOLEAN NOT NULL,
  notifT BOOLEAN NOT NULL,
  newsletter BOOLEAN NOT NULL,
  PRIMARY KEY (idclient));

CREATE TABLE campus (
  idcampus SERIAL,
  address VARCHAR(512) NOT NULL,
  nom VARCHAR(45) NOT NULL,
  PRIMARY KEY (idcampus));

CREATE TABLE carPooling (
  idCarPooling SERIAL,
  address VARCHAR(512) NOT NULL,
  idcampus SERIAL,
  idclient INT  NOT NULL,
  campusToAddress BOOLEAN NOT NULL,
  placeDispo INT NOT NULL,
  laggage INT NOT NULL,
  dateEtHeure timestamp  NOT NULL,
  price numeric(5,2) NOT NULL,
  PRIMARY KEY (idCarPooling),
  CONSTRAINT fk_campus
    FOREIGN KEY (idcampus)
    REFERENCES campus (idcampus)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_client
    FOREIGN KEY (idclient)
    REFERENCES client (idclient)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE joins (
  idCarPooling SERIAL ,
  idclient INT NOT NULL,
  accept BOOLEAN NOT NULL,
  PRIMARY KEY (idCarPooling, idclient),
  CONSTRAINT fk_carPoolnig
    FOREIGN KEY (idCarPooling)
    REFERENCES carPooling (idCarPooling)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_client
    FOREIGN KEY (idclient)
    REFERENCES client (idclient)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE comment (
  idclient INT NOT NULL,
  idCarPooling INT NOT NULL,
  comment VARCHAR(1024) NULL,
  NoteT INT NOT NULL,
  NoteC INT NULL,
  PRIMARY KEY (idclient, idCarPooling),
  CONSTRAINT fk_joins
    FOREIGN KEY (idclient , idCarPooling)
    REFERENCES joins (idCarPooling, idclient)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TYPE BV AS ENUM ('M', 'A');

CREATE TABLE vehicle (
  idvehicle SERIAL,
  idclient INT  NOT NULL,
  name VARCHAR(60) NOT NULL,
  bv BV NOT NULL DEFAULT 'M',
  animals BOOLEAN NOT NULL,
  smoking BOOLEAN NOT NULL,
  vehiclecol VARCHAR(45) NULL,
  manger BOOLEAN NOT NULL,
  PRIMARY KEY (idvehicle, idclient),
  CONSTRAINT fk_client
    FOREIGN KEY (idclient)
    REFERENCES client (idclient)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


CREATE INDEX fk_client_idx ON joins(idclient ASC);

CREATE INDEX fk_carpooling_idx ON joins(idCarPooling ASC);

CREATE INDEX fk_campus_idx ON carPooling(idcampus ASC);

CREATE INDEX fk_client_carPooling_idx ON carPooling(idclient ASC);

CREATE INDEX fk_client_vehicule_idx ON vehicle(idclient ASC);