DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

\c employee_tracker;

DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;


CREATE TABLE departments (
department_id SERIAL PRIMARY KEY,
department_name VARCHAR(75)
);

CREATE TABLE roles (
role_id SERIAL PRIMARY KEY,
job_title VARCHAR(75),
department_id INTEGER,
FOREIGN KEY (department_id)
REFERENCES departments(department_id)
ON DELETE SET NULL,
salary NUMERIC (10, 2)
);

CREATE TABLE employees (
employee_id SERIAL PRIMARY KEY,
first_name VARCHAR(75),
last_name VARCHAR(75),
role_id INTEGER,
FOREIGN KEY (role_id)
REFERENCES roles(role_id)
ON DELETE SET NULL,
manager_id INTEGER 
REFERENCES employees(employee_id)
);