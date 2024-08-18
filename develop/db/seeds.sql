INSERT INTO departments (department_name) 
VALUES
('marketing'),
('finance'),
('IT'),
('design'),
('managment');

INSERT INTO roles (job_title, department_id, salary) 
VALUES
('social media specialist', 1, 65000.00),
('graphic designer', 4, 60000.00),
('financial consultant', 2, 80000.00),
('ui developer', 3, 115000.00),
('backend developer', 3, 140000.00),
('manager', 5, 200000.00);

INSERT INTO employees (first_name, last_name, role_id, manager_id) 
VALUES
('lunafreya', 'fleuret', 6);
('ciri', 'riannon', 1, 'fleuret'),
('princess', 'zelda', 2, 'fleuret'),
('lara', 'croft', 3, 'fleuret'),
('tifa', 'lockheart', 4, 'fleuret'),
('yuna', 'braska', 5, 'fleuret'),
