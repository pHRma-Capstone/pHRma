DROP DATABASE IF EXISTS devDB;
CREATE DATABASE devDB;
USE devDB

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

CREATE TABLE employees (
    employee_id INTEGER PRIMARY KEY,
    employee_first_name VARCHAR(50) NOT NULL,
    employee_last_name VARCHAR(50) NOT NULL,
    med_history_technician BOOLEAN DEFAULT FALSE,
    med_history_intern BOOLEAN DEFAULT FALSE,
    pharmacist BOOLEAN DEFAULT FALSE, 
    shift_schedule INTEGER DEFAULT NULL
);
TRUNCATE employees CASCADE;

CREATE TABLE locations (
    location_id INTEGER PRIMARY KEY,
    location_name VARCHAR(50) UNIQUE NOT NULL,
    intensive BOOLEAN DEFAULT FALSE NOT NULL
);
TRUNCATE locations CASCADE;

CREATE TABLE authorized_users (
    user_id INTEGER PRIMARY KEY,
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id),  
    user_username VARCHAR(20) UNIQUE NOT NULL,
    hashed_password BINARY(20),
    admin_privileges BOOLEAN DEFAULT FALSE NOT NULL,
    supervisor_privileges BOOLEAN DEFAULT FALSE NOT NULL    
);
TRUNCATE authorized_users CASCADE;

CREATE TABLE consult_types (
    consult_type_id INTEGER PRIMARY KEY,
    consult_type_name VARCHAR(50) UNIQUE NOT NULL,
);
TRUNCATE consult_types CASCADE;

CREATE TABLE consults (
    consult_id INTEGER PRIMARY KEY,
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id),
    FOREIGN KEY (asst_employee_id) REFERENCES employees (employee_id),
    FOREIGN KEY (reported_to_id) REFERENCES employees (employee_id),
    FOREIGN KEY (location_id) REFERENCES locations (location_id),
    FOREIGN KEY (consult_type_id) REFERENCES consult_types (consult_type_id),
    consult_date TIMESTAMP NOT NULL,
    status ENUM('Not Completed', 'Abbreviated', 'In-Progress', 'Investigating', 'Completed') NOT NULL,
    medications TINYINT UNSIGNED,
    interventions TINYINT UNSIGNED,
    duration ENUM('<1 Minute', '1-5 Minutes', '6-15 Minutes', '16-30 Minutes', '31-60 Minutes', '>1 Hour') NOT NULL,
    admit_orders_placed BOOLEAN,
    intervention_missing BOOLEAN DEFAULT FALSE NOT NULL,
    intervention_not_taking BOOLEAN DEFAULT FALSE NOT NULL,
    intervention_incorrect_medication BOOLEAN DEFAULT FALSE NOT NULL,
    intervention_incorrect_dose BOOLEAN DEFAULT FALSE NOT NULL,
    intervention_incorrect_frequency BOOLEAN DEFAULT FALSE NOT NULL,
    intervention_incorrect_route BOOLEAN DEFAULT FALSE NOT NULL,
    intervention_allergies_updated BOOLEAN DEFAULT FALSE NOT NULL,
    intervention_vaccination_documented BOOLEAN DEFAULT FALSE NOT NULL,
    request BOOLEAN DEFAULT FALSE NOT NULL
);
TRUNCATE consults CASCADE;

CREATE TABLE holiday_preferences (
    preference_id INTEGER PRIMARY KEY,
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id),
    preference_year YEAR NOT NULL,
    season ENUM('Summer', 'Winter') NOT NULL,
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
TRUNCATE holiday_preferences CASCADE;

CREATE TABLE exception_log (
    exception_id INTEGER PRIMARY KEY,
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id),
    exception_date DATE NOT NULL,
    missed_punch_in BOOLEAN DEFAULT FALSE NOT NULL,
    in_time TIMESTAMP,
    missed_punch_lunch_in BOOLEAN DEFAULT FALSE NOT NULL,
    lunch_in_time TIMESTAMP,
    missed_punch_lunch_out BOOLEAN DEFAULT FALSE NOT NULL,
    lunch_out_time TIMESTAMP,
    missed_punch_out BOOLEAN DEFAULT FALSE NOT NULL,
    out_time TIMESTAMP,
    signed_employee BOOLEAN DEFAULT FALSE NOT NULL,
    signed_supervisor BOOLEAN DEFAULT FALSE NOT NULL,
    reason VARCHAR(100),
    hours_time_off DECIMAL(2, 4),
    time_off_type ENUM('PTO', 'Personal', 'Vacation', 'Sick')
);
TRUNCATE exception_log CASCADE;

CREATE TABLE shifts (
    shift_id INTEGER PRIMARY KEY,
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id),
    shift_start TIMESTAMP NOT NULL,
    shift_end TIMESTAMP NOT NULL
);
TRUNCATE shifts CASCADE;

CREATE TABLE shift_swap_request (
    swap_id INTEGER PRIMARY KEY,
    FOREIGN KEY (shift_id) REFERENCES shifts (shift_id),
    FOREIGN KEY (current_employee_id) REFERENCES employees (employee_id),
    FOREIGN KEY (swapped_employee_id) REFERENCES employees (employee_id),
    current_signed BOOLEAN DEFAULT FALSE NOT NULL,
    swap_signed BOOLEAN DEFAULT FALSE NOT NULL,
    supervisor_signed BOOLEAN DEFAULT FALSE NOT NULL,
    supervisor_approved BOOLEAN DEFAULT FALSE NOT NULL
);
TRUNCATE shift_swap_request CASCADE;

CREATE TABLE employee_statistics (
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id),
    statistics_day DATE NOT NULL,
    number_notes TINYINT UNSIGNED  DEFAULT 0 NOT NULL,
    number_consult_notes TINYINT UNSIGNED DEFAULT 0 NOT NULL,
    number_abbreviated_notes TINYINT UNSIGNED DEFAULT 0 NOT NULL,
    number_medications SMALLINT UNSIGNED DEFAULT 0 NOT NULL,
    average_medications_per_consult TINYINT UNSIGNED DEFAULT 0 NOT NULL,
    number_intervention SMALLINT UNSIGNED DEFAULT 0 NOT NULL,
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
TRUNCATE employee_statistics CASCADE;

CREATE TABLE service_statistics (
    statistics_day DATE PRIMARY KEY,
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
TRUNCATE service_statistics CASCADE;

INSERT INTO employees VALUES
    (0, 'dev', 'dev', FALSE, FALSE, FALSE)
    (1, 'Brian Wilson', 'Kernighan CPhT', TRUE, FALSE, FALSE, 1)
    (2, 'Dennis Macalistair', 'Ritchie CPhT', TRUE, FALSE, FALSE, 2)
    (3, 'Kenneth Lane', 'Thompson CPhT', TRUE, FALSE, FALSE, 3)
    (4, 'James Arthur', 'Gosling CPhT', TRUE, FALSE, FALSE, 4)
    (5, 'James', 'Grady', FALSE, TRUE, FALSE, 5)
    (6, 'Nathaniel', 'Rupp', FALSE, TRUE, FALSE, 5)
    (7, 'Grant', 'Clemmons', FALSE, TRUE, FALSE, 5)
    (8, 'Dee', 'Archdekin', FALSE, TRUE, FALSE, 5)
    (9, 'Carter', 'Scranton', FALSE, TRUE, FALSE, 5)
    (10, 'Lawrence Joseph', 'Ellison PharmD', FALSE, FALSE, TRUE, NULL)
    (11, 'William Henry', 'Gates III PharmD', FALSE, FALSE, TRUE, NULL)
    (12, 'Steven Paul', 'Jobs PharmD', FALSE, FALSE, TRUE, NULL)
    (13, 'Mark Elliot', 'Zuckerberg PharmD', FALSE, FALSE, TRUE, NULL)
;

INSERT INTO locations VALUES
    (1, 'Emergency Room', FALSE)
    (2, 'Intensive Care Unit', TRUE)
    (3, 'Progressive Care Unit', TRUE)
    (4, 'Missouri Psychiatric Center', FALSE)
    (5, 'Other', FALSE)
;

INSERT INTO consult_types VALUES
    (1, 'Medication History Consultation')
    (2, 'Medication History Consultation - Extended')
    (3, 'Medication History Consultation - Pediatric')
;

INSERT INTO authorized_users VALUES
    (0, 0, 'dev', NULL, TRUE, TRUE)
;
