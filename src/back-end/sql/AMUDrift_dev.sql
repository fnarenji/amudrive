-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           PostgreSQL 9.3.5, compiled by Visual C++ build 1600, 64-bit
-- Serveur OS:                   
-- HeidiSQL Version:             9.1.0.4875
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Export de la structure de table public. campus
CREATE TABLE IF NOT EXISTS "campus" (
	"idcampus" INTEGER NOT NULL DEFAULT nextval('campus_idcampus_seq'::regclass) COMMENT '',
	"address" CHARACTER VARYING(512) NOT NULL DEFAULT NULL COMMENT '',
	"name" CHARACTER VARYING(45) NOT NULL DEFAULT NULL COMMENT '',
	"long" REAL NOT NULL DEFAULT NULL COMMENT '',
	"lat" REAL NOT NULL DEFAULT NULL COMMENT '',
	PRIMARY KEY ("idcampus"),
	UNIQUE KEY ("name")
);

-- Export de données de la table public.campus: 0 rows
DELETE FROM "campus";
/*!40000 ALTER TABLE "campus" DISABLE KEYS */;
INSERT INTO "campus" ("idcampus", "address", "name", "long", "lat") VALUES
	(1, '413 avenue Gaston Berger, 13625 Aix-en-Provence', 'IUT Aix-en-Provence', 43.5143, 5.45148),
	(2, '3 avenue Robert Schuman, 13100 Aix-en-Provence', 'Fac de droit d\'Aix-en-provence', 43.5191, 5.44768),
	(3, 'Médiathèque d\'Arles, 13200 Arles', 'Fac de droit d\'Arles', 43.676, 4.6255);
/*!40000 ALTER TABLE "campus" ENABLE KEYS */;


-- Export de la structure de table public. carpooling
CREATE TABLE IF NOT EXISTS "carpooling" (
	"idcarpooling" INTEGER NOT NULL DEFAULT nextval('carpooling_idcarpooling_seq'::regclass) COMMENT '',
	"address" CHARACTER VARYING(512) NOT NULL DEFAULT NULL COMMENT '',
	"long" REAL NOT NULL DEFAULT NULL COMMENT '',
	"lat" REAL NOT NULL DEFAULT NULL COMMENT '',
	"idcampus" INTEGER NOT NULL DEFAULT nextval('carpooling_idcampus_seq'::regclass) COMMENT '',
	"idclient" INTEGER NOT NULL DEFAULT NULL COMMENT '',
	"idvehicle" INTEGER NOT NULL DEFAULT NULL COMMENT '',
	"campustoaddress" BOOLEAN NOT NULL DEFAULT NULL COMMENT '',
	"room" INTEGER NOT NULL DEFAULT NULL COMMENT '',
	"luggage" INTEGER NOT NULL DEFAULT NULL COMMENT '',
	"talks" BOOLEAN NOT NULL DEFAULT false COMMENT '',
	"radio" BOOLEAN NOT NULL DEFAULT false COMMENT '',
	"meettime" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NULL COMMENT '',
	"price" NUMERIC(5,2) NOT NULL DEFAULT NULL COMMENT '',
	PRIMARY KEY ("idcarpooling")
);

-- Export de données de la table public.carpooling: 3 rows
DELETE FROM "carpooling";
/*!40000 ALTER TABLE "carpooling" DISABLE KEYS */;
INSERT INTO "carpooling" ("idcarpooling", "address", "long", "lat", "idcampus", "idclient", "idvehicle", "campustoaddress", "room", "luggage", "talks", "radio", "meettime", "price") VALUES
	(2, 'Rue Sainte-Famille, Marseille', 5.39394, 43.2784, 1, 2, 1, 'false', 4, 0, 'true', 'true', '2014-12-31 08:00:00', 0.00),
	(3, 'Rue Roger Renzo, Marseille', 5.39413, 43.2779, 1, 2, 1, 'false', 4, 0, 'false', 'true', '2014-12-31 08:00:00', 0.00),
	(1, 'Rue Borde, Marseille', 5.39174, 43.2791, 1, 2, 1, 'false', 3, 0, 'true', 'false', '2014-12-20 08:00:00', 0.00);
/*!40000 ALTER TABLE "carpooling" ENABLE KEYS */;


-- Export de la structure de table public. carpoolingjoin
CREATE TABLE IF NOT EXISTS "carpoolingjoin" (
	"idcarpooling" INTEGER NOT NULL DEFAULT NULL COMMENT '',
	"idclient" INTEGER NOT NULL DEFAULT NULL COMMENT '',
	"accept" BOOLEAN NOT NULL DEFAULT NULL COMMENT '',
	PRIMARY KEY ("idcarpooling","idclient")
);

-- Export de données de la table public.carpoolingjoin: 0 rows
DELETE FROM "carpoolingjoin";
/*!40000 ALTER TABLE "carpoolingjoin" DISABLE KEYS */;
INSERT INTO "carpoolingjoin" ("idcarpooling", "idclient", "accept") VALUES
	(1, 3, 'true');
/*!40000 ALTER TABLE "carpoolingjoin" ENABLE KEYS */;


-- Export de la structure de table public. client
CREATE TABLE IF NOT EXISTS "client" (
	"idclient" INTEGER NOT NULL DEFAULT nextval('client_idclient_seq'::regclass) COMMENT '',
	"username" CHARACTER VARYING(30) NOT NULL DEFAULT NULL COMMENT '',
	"firstname" CHARACTER VARYING(30) NOT NULL DEFAULT NULL COMMENT '',
	"lastname" CHARACTER VARYING(50) NOT NULL DEFAULT NULL COMMENT '',
	"address" CHARACTER VARYING(512) NOT NULL DEFAULT NULL COMMENT '',
	"long" REAL NOT NULL DEFAULT NULL COMMENT '',
	"lat" REAL NOT NULL DEFAULT NULL COMMENT '',
	"mail" CHARACTER VARYING(127) NOT NULL DEFAULT NULL COMMENT '',
	"password" CHARACTER VARYING(129) NOT NULL DEFAULT NULL COMMENT '',
	"registrationtime" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now() COMMENT '',
	"messagingparameters" INTEGER NOT NULL DEFAULT NULL COMMENT '',
	"centersofinterest" CHARACTER VARYING(45) NOT NULL DEFAULT NULL COMMENT '',
	"phonenumber" CHARACTER VARYING(20) NOT NULL DEFAULT NULL COMMENT '',
	"mailnotifications" BOOLEAN NOT NULL DEFAULT NULL COMMENT '',
	"phonenotifications" BOOLEAN NOT NULL DEFAULT NULL COMMENT '',
	"newsletter" BOOLEAN NOT NULL DEFAULT NULL COMMENT '',
	"favoritecampus" INTEGER NULL DEFAULT NULL COMMENT '',
	PRIMARY KEY ("idclient"),
	UNIQUE KEY ("mail")
);

-- Export de données de la table public.client: 0 rows
DELETE FROM "client";
/*!40000 ALTER TABLE "client" DISABLE KEYS */;
INSERT INTO "client" ("idclient", "username", "firstname", "lastname", "address", "long", "lat", "mail", "password", "registrationtime", "messagingparameters", "centersofinterest", "phonenumber", "mailnotifications", "phonenotifications", "newsletter", "favoritecampus") VALUES
	(1, 'aze', 'mdr', 'ptdr', 'swag', 43.2853, 5.38422, 'lel@oklm.kom', 'a48c25f7ec82996486b5a8387cc4e147c628c1f48ae8c868561474fbc5eaf4bec44af63f002681aa8dd32f0dfde1bac24b44d7d6014b73fd26025d94e8f58d3b', '2014-12-26 00:16:45.395', 2, 'lesgroessesqueues', '1337133749', 'true', 'true', 'true', 1),
	(2, 'swag', 'hipster', 'wallah', 'oklm', 43.2452, 5.34423, 'trkl@bonbukkake.jap', '1e31d1b64272d08cfa09d838305d9926a0720bf1abe498ed5b9a06df6ffd00304929c212edd3d60e7295965ccbced6120c2a113f0c199840930f47f62aa33a1f', '2014-12-26 00:16:45.395', 2, 'goutugoutu', '1337133749', 'true', 'true', 'true', 2),
	(3, 'Thomas', 'Thomas', 'Munoz', '154 La Jonquière, Fos-sur-Mer, France', 43.4417, 4.94431, 'thomas.munoz.1@etu.univ-amu.fr', '0e2d148eff53f3b82ee3aa6f62c9ef8e3ceeddff865a733c294db55023b121e81f5ffdde83dc07e274c7389d1e1e430c20d582889a6399c32811fff47f260be6', '2014-12-26 00:33:46.111', 1, 'Informatique', '0698369472', 'false', 'false', 'false', 1);
/*!40000 ALTER TABLE "client" ENABLE KEYS */;


-- Export de la structure de table public. clientmailvalidation
CREATE TABLE IF NOT EXISTS "clientmailvalidation" (
	"idclient" INTEGER NOT NULL DEFAULT NULL COMMENT '',
	"validationkey" CHARACTER VARYING(127) NOT NULL DEFAULT NULL COMMENT '',
	PRIMARY KEY ("idclient")
);

-- Export de données de la table public.clientmailvalidation: 0 rows
DELETE FROM "clientmailvalidation";
/*!40000 ALTER TABLE "clientmailvalidation" DISABLE KEYS */;
/*!40000 ALTER TABLE "clientmailvalidation" ENABLE KEYS */;


-- Export de la structure de table public. comment
CREATE TABLE IF NOT EXISTS "comment" (
	"idclient" INTEGER NOT NULL DEFAULT NULL COMMENT '',
	"idcarpooling" INTEGER NOT NULL DEFAULT NULL COMMENT '',
	"idmessage" INTEGER NOT NULL DEFAULT nextval('comment_idmessage_seq'::regclass) COMMENT '',
	"comment" CHARACTER VARYING(1024) NOT NULL DEFAULT NULL COMMENT '',
	"poolingmark" INTEGER NOT NULL DEFAULT NULL COMMENT '',
	"drivermark" INTEGER NOT NULL DEFAULT NULL COMMENT '',
	PRIMARY KEY ("idclient","idcarpooling","idmessage")
);

-- Export de données de la table public.comment: 0 rows
DELETE FROM "comment";
/*!40000 ALTER TABLE "comment" DISABLE KEYS */;
INSERT INTO "comment" ("idclient", "idcarpooling", "idmessage", "comment", "poolingmark", "drivermark") VALUES
	(3, 1, 5, 'Bon co-voiturage, la personne qui m\'a conduit à l\'IUT était très sympathique, j\'ai même eu droit à un petit supplément. \n\nQUAND TU VEUX', 10, 10);
/*!40000 ALTER TABLE "comment" ENABLE KEYS */;


-- Export de la structure de table public. vehicle
CREATE TABLE IF NOT EXISTS "vehicle" (
	"idvehicle" INTEGER NOT NULL DEFAULT nextval('vehicle_idvehicle_seq'::regclass) COMMENT '',
	"idclient" INTEGER NOT NULL DEFAULT NULL COMMENT '',
	"name" CHARACTER VARYING(60) NOT NULL DEFAULT NULL COMMENT '',
	"bv" BV NOT NULL DEFAULT 'M'::bv COMMENT '',
	"animals" BOOLEAN NOT NULL DEFAULT false COMMENT '',
	"smoking" BOOLEAN NOT NULL DEFAULT false COMMENT '',
	"eat" BOOLEAN NOT NULL DEFAULT false COMMENT '',
	PRIMARY KEY ("idvehicle","idclient")
);

-- Export de données de la table public.vehicle: 1 rows
DELETE FROM "vehicle";
/*!40000 ALTER TABLE "vehicle" DISABLE KEYS */;
INSERT INTO "vehicle" ("idvehicle", "idclient", "name", "bv", "animals", "smoking", "eat") VALUES
	(1, 2, 'RENAULT CLIO V12 TWIN TURBO OKLM', 'M', 'false', 'false', 'false');
/*!40000 ALTER TABLE "vehicle" ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
