CREATE DATABASE employee_tracker;

\c employee_tracker;

SELECT current_database();

CREATE TABLE departments (
department_name VARCHAR(75),
department_id INTEGER
);

CREATE TABLE roles (
job_title VARCHAR(75),
role_id INTEGER,
department_id INTEGER,
salary INTEGER
);

CREATE TABLE employees (
employee_id INTEGER,
first_name VARCHAR(75),
last_name VARCHAR(75),
job_title VARCHAR(75),
department_id INTEGER,
salary INTEGER,
manager VARCHAR(75)
);