DROP DATABASE IF EXISTS prodDB;

CREATE DATABASE prodDB;

USE prodDB;

DROP TABLE IF EXISTS employees CASCADE;

DROP TABLE IF EXISTS locations CASCADE;

DROP TABLE IF EXISTS authorized_users CASCADE;

DROP TABLE IF EXISTS consults CASCADE;

DROP TABLE IF EXISTS consult_types CASCADE;

DROP TABLE IF EXISTS holiday_preferences CASCADE;

DROP TABLE IF EXISTS exception_log CASCADE;

DROP TABLE IF EXISTS shifts CASCADE;

DROP TABLE IF EXISTS shift_swap_request CASCADE;

DROP TABLE IF EXISTS service_statistics CASCADE;

DROP TABLE IF EXISTS employee_statistics CASCADE;

CREATE TABLE
    employees (
        id INTEGER PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        is_med_history_technician BOOLEAN DEFAULT FALSE,
        is_med_history_intern BOOLEAN DEFAULT FALSE,
        is_pharmacist BOOLEAN DEFAULT FALSE,
        shift_schedule INTEGER DEFAULT NULL
    );

TRUNCATE TABLE employees;

CREATE TABLE
    locations (
        id INTEGER PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        is_intensive BOOLEAN DEFAULT FALSE NOT NULL
    );

TRUNCATE TABLE locations;

CREATE TABLE
    consults (
        id INTEGER,
        employee_id INTEGER NOT NULL,
        asst_employee_id INTEGER NOT NULL,
        reported_to_id INTEGER NOT NULL,
        location_id INTEGER NOT NULL,
        consult_type_id INTEGER NOT NULL,
        consult_date TIMESTAMP NOT NULL,
        status ENUM (
            'Not Completed',
            'Abbreviated',
            'In-Progress',
            'Investigating',
            'Completed'
        ) NOT NULL,
        medications TINYINT UNSIGNED,
        interventions TINYINT UNSIGNED,
        duration ENUM (
            '<1 Minute',
            '1-5 Minutes',
            '6-15 Minutes',
            '16-30 Minutes',
            '31-60 Minutes',
            '>1 Hour'
        ) NOT NULL,
        is_admit_orders_placed BOOLEAN,
        is_intervention_missing BOOLEAN DEFAULT FALSE NOT NULL,
        is_intervention_not_taking BOOLEAN DEFAULT FALSE NOT NULL,
        is_intervention_incorrect_medication BOOLEAN DEFAULT FALSE NOT NULL,
        is_intervention_incorrect_dose BOOLEAN DEFAULT FALSE NOT NULL,
        is_intervention_incorrect_frequency BOOLEAN DEFAULT FALSE NOT NULL,
        is_intervention_incorrect_route BOOLEAN DEFAULT FALSE NOT NULL,
        is_intervention_allergies_updated BOOLEAN DEFAULT FALSE NOT NULL,
        is_intervention_vaccination_documented BOOLEAN DEFAULT FALSE NOT NULL,
        is_request BOOLEAN DEFAULT FALSE NOT NULL
    );

TRUNCATE TABLE consults;

CREATE TABLE
    authorized_users (
        id INTEGER PRIMARY KEY,
        username VARCHAR(20) UNIQUE NOT NULL,
        hashed_password BINARY(20),
        is_admin_privileges BOOLEAN DEFAULT FALSE NOT NULL,
        is_supervisor_privileges BOOLEAN DEFAULT FALSE NOT NULL
    );

TRUNCATE TABLE authorized_users;

CREATE TABLE
    consult_types (id INTEGER PRIMARY KEY, name VARCHAR(50) UNIQUE NOT NULL);

TRUNCATE TABLE consult_types;

CREATE TABLE
    holiday_preferences (
        id INTEGER PRIMARY KEY,
        employee_id INTEGER NOT NULL,
        preference_year YEAR NOT NULL,
        season ENUM ('Summer', 'Winter') NOT NULL,
        pref_1 TINYINT UNSIGNED,
        pref_2 TINYINT UNSIGNED,
        pref_3 TINYINT UNSIGNED,
        pref_4 TINYINT UNSIGNED,
        pref_5 TINYINT UNSIGNED,
        pref_6 TINYINT UNSIGNED,
        pref_7 TINYINT UNSIGNED,
        pref_8 TINYINT UNSIGNED,
        pref_9 TINYINT UNSIGNED,
        pref_10 TINYINT UNSIGNED,
        pref_11 TINYINT UNSIGNED,
        pref_12 TINYINT UNSIGNED,
        pref_13 TINYINT UNSIGNED,
        pref_14 TINYINT UNSIGNED,
        pref_15 TINYINT UNSIGNED
    );

TRUNCATE TABLE holiday_preferences;

CREATE TABLE
    exception_log (
        id INTEGER,
        employee_id INTEGER NOT NULL,
        exception_date DATE NOT NULL,
        missed_punch_in BOOLEAN DEFAULT FALSE NOT NULL,
        in_time TIMESTAMP,
        missed_punch_lunch_in BOOLEAN DEFAULT FALSE NOT NULL,
        lunch_in_time TIMESTAMP,
        missed_punch_lunch_out BOOLEAN DEFAULT FALSE NOT NULL,
        lunch_out_time TIMESTAMP,
        missed_punch_out BOOLEAN DEFAULT FALSE NOT NULL,
        out_time TIMESTAMP,
        is_signed_employee BOOLEAN DEFAULT FALSE NOT NULL,
        is_signed_supervisor BOOLEAN DEFAULT FALSE NOT NULL,
        reason VARCHAR(100),
        hours_time_off DECIMAL(4, 2),
        time_off_type ENUM ('PTO', 'Personal', 'Vacation', 'Sick')
    );

TRUNCATE TABLE exception_log;

CREATE TABLE
    shifts (
        id INTEGER,
        employee_id INTEGER NOT NULL,
        shift_start TIMESTAMP NOT NULL,
        shift_end TIMESTAMP NOT NULL
    );

TRUNCATE TABLE shifts;

CREATE TABLE
    shift_swap_request (
        id INTEGER,
        shift_id INTEGER NOT NULL,
        employee_id INTEGER NOT NULL,
        current_employee_id INTEGER NOT NULL,
        swapped_employee_id INTEGER NOT NULL,
        is_current_signed BOOLEAN DEFAULT FALSE NOT NULL,
        is_swap_signed BOOLEAN DEFAULT FALSE NOT NULL,
        is_supervisor_signed BOOLEAN DEFAULT FALSE NOT NULL,
        is_supervisor_approved BOOLEAN DEFAULT FALSE NOT NULL
    );

TRUNCATE TABLE shift_swap_request;

CREATE TABLE
    employee_statistics (
        employee_id INTEGER,
        `day` DATE NOT NULL,
        number_notes TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_consult_notes TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_abbreviated_notes TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_medications SMALLINT UNSIGNED DEFAULT 0 NOT NULL,
        average_medications_per_consult TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_interventions SMALLINT UNSIGNED DEFAULT 0 NOT NULL,
        average_interventions_per_consult TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        average_time_per_consult TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_requests TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_emergency_room TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_intensive_care_unit TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_progressive_care_unit TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_missouri_psychiatric_center TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_other TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_referred_to_pharmacist TINYINT UNSIGNED DEFAULT 0 NOT NULL
    );

TRUNCATE TABLE employee_statistics;

CREATE TABLE
    service_statistics (
        `day` DATE,
        number_notes TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_consult_notes TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_abbreviated_notes TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_medications SMALLINT UNSIGNED DEFAULT 0 NOT NULL,
        average_medications_per_consult TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_interventions SMALLINT UNSIGNED DEFAULT 0 NOT NULL,
        average_interventions_per_consult TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        average_time_per_consult TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_requests TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_emergency_room TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_intensive_care_unit TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_progressive_care_unit TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_missouri_psychiatric_center TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_other TINYINT UNSIGNED DEFAULT 0 NOT NULL,
        number_referred_to_pharmacist TINYINT UNSIGNED DEFAULT 0 NOT NULL
    );

TRUNCATE TABLE service_statistics;

INSERT INTO
    employees
VALUES
    (0, 'dev', 'dev', FALSE, FALSE, FALSE, 0),
    (1, 'Brian Wilson', 'Kernighan CPhT', TRUE, FALSE, FALSE, 1),
    (2, 'Dennis Macalistair', 'Ritchie CPhT', TRUE, FALSE, FALSE, 2),
    (3, 'Kenneth Lane', 'Thompson CPhT', TRUE, FALSE, FALSE, 3),
    (4, 'James Arthur', 'Gosling CPhT', TRUE, FALSE, FALSE, 4),
    (5, 'James', 'Grady', FALSE, TRUE, FALSE, 5),
    (6, 'Nathaniel', 'Rupp', FALSE, TRUE, FALSE, 5),
    (7, 'Grant', 'Clemmons', FALSE, TRUE, FALSE, 5),
    (8, 'Dee', 'Archdekin', FALSE, TRUE, FALSE, 5),
    (9, 'Carter', 'Scranton', FALSE, TRUE, FALSE, 5),
    (10, 'Lawrence Joseph', 'Ellison PharmD', FALSE, FALSE, TRUE, NULL),
    (11, 'William Henry', 'Gates III PharmD', FALSE, FALSE, TRUE, NULL),
    (12, 'Steven Paul', 'Jobs PharmD', FALSE, FALSE, TRUE, NULL),
    (13, 'Mark Elliot', 'Zuckerberg PharmD', FALSE, FALSE, TRUE, NULL);

INSERT INTO
    locations
VALUES
    (1, 'Emergency Room', FALSE),
    (2, 'Intensive Care Unit', TRUE),
    (3, 'Progressive Care Unit', TRUE),
    (4, 'Missouri Psychiatric Center', FALSE),
    (5, 'Other', FALSE);

INSERT INTO
    consult_types
VALUES
    (1, 'Medication History Consultation'),
    (2, 'Medication History Consultation - Extended'),
    (3, 'Medication History Consultation - Pediatric');
