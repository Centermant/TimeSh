-- Adminer 5.4.1 PostgreSQL 16.11 dump

CREATE DATABASE "timesheetdb";
\connect "timesheetdb";

DROP FUNCTION IF EXISTS "armor";;
CREATE FUNCTION "armor" (IN "1" bytea) RETURNS text LANGUAGE c AS 'pg_armor';

DROP FUNCTION IF EXISTS "armor";;
CREATE FUNCTION "armor" (IN "1" bytea, IN "2" ARRAY, IN "3" ARRAY) RETURNS text LANGUAGE c AS 'pg_armor';

DROP FUNCTION IF EXISTS "crypt";;
CREATE FUNCTION "crypt" (IN "1" text, IN "2" text) RETURNS text LANGUAGE c AS 'pg_crypt';

DROP FUNCTION IF EXISTS "dearmor";;
CREATE FUNCTION "dearmor" (IN "1" text) RETURNS bytea LANGUAGE c AS 'pg_dearmor';

DROP FUNCTION IF EXISTS "decrypt";;
CREATE FUNCTION "decrypt" (IN "1" bytea, IN "2" bytea, IN "3" text) RETURNS bytea LANGUAGE c AS 'pg_decrypt';

DROP FUNCTION IF EXISTS "decrypt_iv";;
CREATE FUNCTION "decrypt_iv" (IN "1" bytea, IN "2" bytea, IN "3" bytea, IN "4" text) RETURNS bytea LANGUAGE c AS 'pg_decrypt_iv';

DROP FUNCTION IF EXISTS "digest";;
CREATE FUNCTION "digest" (IN "1" text, IN "2" text) RETURNS bytea LANGUAGE c AS 'pg_digest';

DROP FUNCTION IF EXISTS "digest";;
CREATE FUNCTION "digest" (IN "1" bytea, IN "2" text) RETURNS bytea LANGUAGE c AS 'pg_digest';

DROP FUNCTION IF EXISTS "encrypt";;
CREATE FUNCTION "encrypt" (IN "1" bytea, IN "2" bytea, IN "3" text) RETURNS bytea LANGUAGE c AS 'pg_encrypt';

DROP FUNCTION IF EXISTS "encrypt_iv";;
CREATE FUNCTION "encrypt_iv" (IN "1" bytea, IN "2" bytea, IN "3" bytea, IN "4" text) RETURNS bytea LANGUAGE c AS 'pg_encrypt_iv';

DROP FUNCTION IF EXISTS "gen_random_bytes";;
CREATE FUNCTION "gen_random_bytes" (IN "1" integer) RETURNS bytea LANGUAGE c AS 'pg_random_bytes';

DROP FUNCTION IF EXISTS "gen_random_uuid";;
CREATE FUNCTION "gen_random_uuid" () RETURNS uuid LANGUAGE c AS 'pg_random_uuid';

DROP FUNCTION IF EXISTS "gen_salt";;
CREATE FUNCTION "gen_salt" (IN "1" text) RETURNS text LANGUAGE c AS 'pg_gen_salt';

DROP FUNCTION IF EXISTS "gen_salt";;
CREATE FUNCTION "gen_salt" (IN "1" text, IN "2" integer) RETURNS text LANGUAGE c AS 'pg_gen_salt_rounds';

DROP FUNCTION IF EXISTS "hmac";;
CREATE FUNCTION "hmac" (IN "1" text, IN "2" text, IN "3" text) RETURNS bytea LANGUAGE c AS 'pg_hmac';

DROP FUNCTION IF EXISTS "hmac";;
CREATE FUNCTION "hmac" (IN "1" bytea, IN "2" bytea, IN "3" text) RETURNS bytea LANGUAGE c AS 'pg_hmac';

DROP FUNCTION IF EXISTS "pgp_armor_headers";;
CREATE FUNCTION "pgp_armor_headers" (IN "1" text, OUT "key" text, OUT "value" text) RETURNS record LANGUAGE c AS 'pgp_armor_headers';

DROP FUNCTION IF EXISTS "pgp_key_id";;
CREATE FUNCTION "pgp_key_id" (IN "1" bytea) RETURNS text LANGUAGE c AS 'pgp_key_id_w';

DROP FUNCTION IF EXISTS "pgp_pub_decrypt";;
CREATE FUNCTION "pgp_pub_decrypt" (IN "1" bytea, IN "2" bytea) RETURNS text LANGUAGE c AS 'pgp_pub_decrypt_text';

DROP FUNCTION IF EXISTS "pgp_pub_decrypt";;
CREATE FUNCTION "pgp_pub_decrypt" (IN "1" bytea, IN "2" bytea, IN "3" text) RETURNS text LANGUAGE c AS 'pgp_pub_decrypt_text';

DROP FUNCTION IF EXISTS "pgp_pub_decrypt";;
CREATE FUNCTION "pgp_pub_decrypt" (IN "1" bytea, IN "2" bytea, IN "3" text, IN "4" text) RETURNS text LANGUAGE c AS 'pgp_pub_decrypt_text';

DROP FUNCTION IF EXISTS "pgp_pub_decrypt_bytea";;
CREATE FUNCTION "pgp_pub_decrypt_bytea" (IN "1" bytea, IN "2" bytea) RETURNS bytea LANGUAGE c AS 'pgp_pub_decrypt_bytea';

DROP FUNCTION IF EXISTS "pgp_pub_decrypt_bytea";;
CREATE FUNCTION "pgp_pub_decrypt_bytea" (IN "1" bytea, IN "2" bytea, IN "3" text) RETURNS bytea LANGUAGE c AS 'pgp_pub_decrypt_bytea';

DROP FUNCTION IF EXISTS "pgp_pub_decrypt_bytea";;
CREATE FUNCTION "pgp_pub_decrypt_bytea" (IN "1" bytea, IN "2" bytea, IN "3" text, IN "4" text) RETURNS bytea LANGUAGE c AS 'pgp_pub_decrypt_bytea';

DROP FUNCTION IF EXISTS "pgp_pub_encrypt";;
CREATE FUNCTION "pgp_pub_encrypt" (IN "1" text, IN "2" bytea) RETURNS bytea LANGUAGE c AS 'pgp_pub_encrypt_text';

DROP FUNCTION IF EXISTS "pgp_pub_encrypt";;
CREATE FUNCTION "pgp_pub_encrypt" (IN "1" text, IN "2" bytea, IN "3" text) RETURNS bytea LANGUAGE c AS 'pgp_pub_encrypt_text';

DROP FUNCTION IF EXISTS "pgp_pub_encrypt_bytea";;
CREATE FUNCTION "pgp_pub_encrypt_bytea" (IN "1" bytea, IN "2" bytea) RETURNS bytea LANGUAGE c AS 'pgp_pub_encrypt_bytea';

DROP FUNCTION IF EXISTS "pgp_pub_encrypt_bytea";;
CREATE FUNCTION "pgp_pub_encrypt_bytea" (IN "1" bytea, IN "2" bytea, IN "3" text) RETURNS bytea LANGUAGE c AS 'pgp_pub_encrypt_bytea';

DROP FUNCTION IF EXISTS "pgp_sym_decrypt";;
CREATE FUNCTION "pgp_sym_decrypt" (IN "1" bytea, IN "2" text) RETURNS text LANGUAGE c AS 'pgp_sym_decrypt_text';

DROP FUNCTION IF EXISTS "pgp_sym_decrypt";;
CREATE FUNCTION "pgp_sym_decrypt" (IN "1" bytea, IN "2" text, IN "3" text) RETURNS text LANGUAGE c AS 'pgp_sym_decrypt_text';

DROP FUNCTION IF EXISTS "pgp_sym_decrypt_bytea";;
CREATE FUNCTION "pgp_sym_decrypt_bytea" (IN "1" bytea, IN "2" text) RETURNS bytea LANGUAGE c AS 'pgp_sym_decrypt_bytea';

DROP FUNCTION IF EXISTS "pgp_sym_decrypt_bytea";;
CREATE FUNCTION "pgp_sym_decrypt_bytea" (IN "1" bytea, IN "2" text, IN "3" text) RETURNS bytea LANGUAGE c AS 'pgp_sym_decrypt_bytea';

DROP FUNCTION IF EXISTS "pgp_sym_encrypt";;
CREATE FUNCTION "pgp_sym_encrypt" (IN "1" text, IN "2" text) RETURNS bytea LANGUAGE c AS 'pgp_sym_encrypt_text';

DROP FUNCTION IF EXISTS "pgp_sym_encrypt";;
CREATE FUNCTION "pgp_sym_encrypt" (IN "1" text, IN "2" text, IN "3" text) RETURNS bytea LANGUAGE c AS 'pgp_sym_encrypt_text';

DROP FUNCTION IF EXISTS "pgp_sym_encrypt_bytea";;
CREATE FUNCTION "pgp_sym_encrypt_bytea" (IN "1" bytea, IN "2" text) RETURNS bytea LANGUAGE c AS 'pgp_sym_encrypt_bytea';

DROP FUNCTION IF EXISTS "pgp_sym_encrypt_bytea";;
CREATE FUNCTION "pgp_sym_encrypt_bytea" (IN "1" bytea, IN "2" text, IN "3" text) RETURNS bytea LANGUAGE c AS 'pgp_sym_encrypt_bytea';

DROP FUNCTION IF EXISTS "update_updated_at_column";;
CREATE FUNCTION "update_updated_at_column" () RETURNS trigger LANGUAGE plpgsql AS '
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
';

DROP TABLE IF EXISTS "departments";
DROP SEQUENCE IF EXISTS departments_id_seq;
CREATE SEQUENCE departments_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 5 CACHE 1;

CREATE TABLE "public"."departments" (
    "id" integer DEFAULT nextval('departments_id_seq') NOT NULL,
    "guid" character varying(255) NOT NULL,
    "name" text NOT NULL,
    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX departments_guid_key ON public.departments USING btree (guid);

INSERT INTO "departments" ("id", "guid", "name") VALUES
(1,	'a01',	'Отдел кадров'),
(2,	'b02',	'IT-отдел'),
(3,	'c03',	'Бухгалтерия'),
(4,	'test1',	'тестовое подразделение');

DROP TABLE IF EXISTS "employee_positions";
DROP SEQUENCE IF EXISTS employee_positions_id_seq;
CREATE SEQUENCE employee_positions_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 12 CACHE 1;

CREATE TABLE "public"."employee_positions" (
    "id" integer DEFAULT nextval('employee_positions_id_seq') NOT NULL,
    "emp_id" character varying(255),
    "pos_id" character varying(255),
    "assigned_rate" numeric(3,2) DEFAULT '1.00' NOT NULL,
    CONSTRAINT "employee_positions_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX employee_positions_emp_id_pos_id_key ON public.employee_positions USING btree (emp_id, pos_id);

CREATE INDEX idx_employee_positions_emp ON public.employee_positions USING btree (emp_id);

INSERT INTO "employee_positions" ("id", "emp_id", "pos_id", "assigned_rate") VALUES
(1,	'T-001',	'612',	1.00),
(5,	'T-001',	'620',	0.50),
(8,	'Тан',	'620',	1.00),
(9,	'Тан',	'615',	0.25),
(10,	'Т-абу',	'620',	0.50),
(11,	'Т-абу',	'612',	0.50);

DROP TABLE IF EXISTS "employees";
DROP SEQUENCE IF EXISTS employees_id_seq;
CREATE SEQUENCE employees_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 17 CACHE 1;

CREATE TABLE "public"."employees" (
    "id" integer DEFAULT nextval('employees_id_seq') NOT NULL,
    "emp_id" character varying(255) NOT NULL,
    "full_name" text NOT NULL,
    "date_of_birth" date NOT NULL,
    "username" character varying(255) NOT NULL,
    "password_hash" text NOT NULL,
    "role" character varying(50) DEFAULT 'employee' NOT NULL,
    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX employees_emp_id_key ON public.employees USING btree (emp_id);

CREATE UNIQUE INDEX employees_username_key ON public.employees USING btree (username);

INSERT INTO "employees" ("id", "emp_id", "full_name", "date_of_birth", "username", "password_hash", "role") VALUES
(1,	'T-001',	'Лещенко Андрей Николаевич',	'1990-05-15',	'a.lechenko',	'$2a$10$b.D98VcLuwr.jXqNgV2YguRbrpiqXhLQpSv7heOOEJ1Bo0hnSkib2',	'admin'),
(14,	'Тест-выгрузки',	'Тестович',	'2025-11-29',	'login',	'$2b$10$4Vo2yQtYR5/aM6X.nybHr.nidkQ7DPWdeKRiBszC.gg9rUFcLM7NO',	'admin'),
(15,	'Тан',	'Тананин Иван Михайлович',	'2004-09-07',	'tan',	'$2b$10$a6zC/PpIR2E/8HMcU7e8UeLaXPwMLLueIr0Knr09fxVubWymI55De',	'employee'),
(16,	'Т-абу',	'Абушкевич Юрий Сергеевич',	'2004-04-17',	'abushkevich',	'$2b$10$ToD.d7jTMrY6TH60af3Rte3PFhLS5VNqucWJkHQ4HPs.G4N3yqyLC',	'admin');

DROP TABLE IF EXISTS "positions";
DROP SEQUENCE IF EXISTS positions_id_seq;
CREATE SEQUENCE positions_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 6 CACHE 1;

CREATE TABLE "public"."positions" (
    "id" integer DEFAULT nextval('positions_id_seq') NOT NULL,
    "pos_id" character varying(255) NOT NULL,
    "title" text NOT NULL,
    "total_rate" numeric(3,2) DEFAULT '1.00' NOT NULL,
    "department_guid" character varying(255),
    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX positions_pos_id_key ON public.positions USING btree (pos_id);

INSERT INTO "positions" ("id", "pos_id", "title", "total_rate", "department_guid") VALUES
(1,	'612',	'Специалист отдела кадров',	2.00,	'a01'),
(2,	'615',	'Системный администратор',	1.00,	'a01'),
(4,	'620',	'Программист',	3.00,	'a01');

DROP TABLE IF EXISTS "timesheets";
DROP SEQUENCE IF EXISTS timesheets_id_seq;
CREATE SEQUENCE timesheets_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 17 CACHE 1;

CREATE TABLE "public"."timesheets" (
    "id" integer DEFAULT nextval('timesheets_id_seq') NOT NULL,
    "emp_id" character varying(255),
    "pos_id" character varying(255),
    "date_work" date NOT NULL,
    "check_in" time without time zone,
    "check_out" time without time zone,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "timesheets_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE INDEX idx_timesheets_emp_date ON public.timesheets USING btree (emp_id, date_work);

CREATE INDEX idx_timesheets_pos ON public.timesheets USING btree (pos_id);

INSERT INTO "timesheets" ("id", "emp_id", "pos_id", "date_work", "check_in", "check_out", "created_at", "updated_at") VALUES
(10,	'T-001',	'620',	'2025-11-27',	'08:00:00',	'20:00:00',	'2025-11-27 21:41:11.497661',	'2025-11-28 21:51:22.048322'),
(11,	'T-001',	'620',	'2025-11-28',	'08:00:00',	'16:00:00',	'2025-11-28 21:52:27.522803',	'2025-11-29 12:19:52.786922'),
(12,	'T-001',	'612',	'2025-11-28',	'16:10:00',	'18:10:00',	'2025-11-28 21:53:06.649882',	'2025-11-29 12:20:18.062119'),
(13,	'Тан',	'620',	'2025-11-29',	'07:00:00',	'15:00:00',	'2025-11-29 12:12:07.447555',	'2025-11-29 12:21:02.524396'),
(14,	'Тан',	'615',	'2025-11-29',	'15:10:00',	'18:10:00',	'2025-11-29 12:13:15.405947',	'2025-11-29 12:21:15.781944'),
(15,	'Т-абу',	'620',	'2025-11-29',	'15:41:00',	NULL,	'2025-11-29 12:41:32.853444',	'2025-11-29 12:41:39.736733'),
(16,	'Т-абу',	'612',	'2025-11-29',	'15:41:00',	NULL,	'2025-11-29 12:41:48.998163',	'2025-11-29 12:41:53.077023');

DELIMITER ;;

CREATE TRIGGER "update_timesheets_updated_at" BEFORE UPDATE ON "public"."timesheets" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();;

DELIMITER ;

ALTER TABLE ONLY "public"."employee_positions" ADD CONSTRAINT "employee_positions_emp_id_fkey" FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."employee_positions" ADD CONSTRAINT "employee_positions_pos_id_fkey" FOREIGN KEY (pos_id) REFERENCES positions(pos_id) ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."timesheets" ADD CONSTRAINT "timesheets_emp_id_fkey" FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."timesheets" ADD CONSTRAINT "timesheets_pos_id_fkey" FOREIGN KEY (pos_id) REFERENCES positions(pos_id) ON DELETE CASCADE NOT DEFERRABLE;

-- 2025-11-29 19:23:29 UTC
