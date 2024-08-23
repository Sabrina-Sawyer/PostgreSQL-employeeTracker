SELECT * 
FROM employees 
FULL OUTER JOIN roles ON employees.role_id = roles.role_id;