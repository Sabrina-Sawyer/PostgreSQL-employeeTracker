import inquirer from "inquirer";
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

await connectToDb();

interface Department {
    department_id: number;
    department_name: string;
}

interface Role {
    role_id: number;
    job_title: string;
    salary: number;
    department_id: number;
}

interface Employee {
    employee_id: number;
    first_name: string;
    last_name: string;
    role_id: number;
    manager_id: number | null;

}
class companyData {
    public async makeSelection(): Promise<void> {
        const answers = await inquirer.prompt<{ choices: string }>([
            {
                type: 'list',
                name: 'choices',
                message: 'Would you like to view, add, or update the employee data?',
                choices: ['View', 'Add', 'Update'],
            },
        ]);
        if (answers.choices === 'View') {
            await this.viewData();
        } else if (answers.choices === 'Add') {
            await this.addData();
        } if (answers.choices === 'Update') {
            await this.updateData();
        }
    }

    private async viewData(): Promise<void> {
        const { dataType } = await inquirer.prompt<{ dataType: string }>([
            {
                type: 'list',
                name: 'dataType',
                message: 'Which of the following would you like to view?',
                choices: ['Departments', 'Roles', 'Employees'],
            },
        ]);
        if (dataType === 'Departments') {
            await this.viewDepartments();
        } else if (dataType === 'Roles') {
            await this.viewRoles();
        } else if (dataType === 'Employees') {
            await this.viewEmployees();
        }
    }


    private async viewDepartments(): Promise<void> {
        const result: QueryResult<Department> = await pool.query('SELECT * FROM departments');
        const departments = result.rows;
        if (departments.length > 0) {
            console.table(departments);
        } else {
            console.log('No departments found.');
        }
    }
    private async viewRoles(): Promise<void> {
        const result: QueryResult<Role> = await pool.query('SELECT * FROM roles');
        const roles = result.rows;
        if (roles.length > 0) {
            console.table(roles);
        } else {
            console.log('No roles found.');
        }
    }

    // look at database connection
    private async viewEmployees(): Promise<void> {
        const result: QueryResult<Employee> = await pool.query('SELECT * FROM employees FULL OUTER JOIN roles ON employees.role_id = roles.role_id');
        const employees = result.rows;
        if (employees.length > 0) {
            console.table(employees);
        } else {
            console.log('No employees found.');
        }
    }


    private async addData(): Promise<void> {
        const answers = await inquirer.prompt<{ dataType: string }>([
            {
                type: 'list',
                name: 'dataType',
                message: 'Select where you would like to add data:',
                choices: ['Department', 'Role', 'Employee'],
            },
        ]);
        if (answers.dataType === 'Department') {
            await this.createDepartment();
        }
        else if (answers.dataType === 'Role') {
            await this.createRole();
        }
        else if (answers.dataType === 'Employee') {
            await this.createEmployee();
        }
    }

    //not finished 
    private async createDepartment(): Promise<void> {
        try {
            const answers = await inquirer.prompt<{ department: string }>([
                {
                    type: 'input',
                    name: 'department',
                    message: 'Enter Department Name',
                },
            ]);
            const departmentName = answers.department;
            await pool.query('INSERT INTO departments (department_name) VALUES ($1)', [departmentName]);
            console.log('Department added successfully!');
        } catch (error) {
            console.error('Error adding department:', error);
        }
    }

    private async createRole(): Promise<void> {
        try {
            const departmentResult: QueryResult<Department> = await pool.query('SELECT department_id, department_name FROM departments');
            const departments = departmentResult.rows;

            if (departments.length === 0) {
                console.log('No departments found. Please add a department first.');
                return;
            }
            const departmentChoices = departments.map(dep => ({
                name: dep.department_name,
                value: dep.department_id,
            }));
            const answers = await inquirer.prompt<{
                job_title: string;
                salary: number;
                department: number;
            }>([
                {
                    type: 'input',
                    name: 'job_title',
                    message: 'Enter the Title of the Role',
                },
                {
                    type: 'number',
                    name: 'salary',
                    message: 'Enter the Salary of the Role with Two Decimals',
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Select the Department of the Role',
                    choices: departmentChoices,
                },
            ]);
            const { job_title, salary, department } = answers;
            await pool.query('INSERT INTO roles (job_title, salary, department_id) VALUES ($1, $2, $3)', [job_title, salary, department]);
            console.log('Role added successfully!');
        } catch (error) {
            console.error('Error adding role:', error);
        }
    }



    private async createEmployee(): Promise<void> {
        try {
            const rolesResult: QueryResult<Role> = await pool.query('SELECT role_id, job_title FROM roles');
            const roles = rolesResult.rows;

            const managersResults: QueryResult<Employee> = await pool.query('SELECT manager_id, last_name FROM employees')
            const managers = managersResults.rows;

            if (roles.length === 0) {
                console.log('No roles found. Please add a role first.');
                return;
            }
            const roleChoices = roles.map(role => ({
                name: role.job_title,
                value: role.role_id,
            }));

            const managerChoices = managers.map(employees => ({
                name: employees.last_name,
                value: employees.manager_id,
            }));

            managerChoices.unshift({ name: 'None', value: null });

            const answers = await inquirer.prompt<{
                first_name: string;
                last_name: string;
                manager: number | null;
                role: number;
            }>([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'Provide the First Name of the Employee:',
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Provide the Last Name of the Employee:',
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Provide the Manager of the Employee:',
                    choices: managerChoices,
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Select the Role of the Employee',
                    choices: roleChoices,
                },
            ]);

            const { first_name, last_name, manager, role } = answers;
            await pool.query(
                'INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES ($1, $2, $3, $4)',
                [first_name, last_name, manager, role]
            );
            console.log('Employee added successfully!');
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    }

    private async updateData(): Promise<void> {
        try {
            const employeeResult: QueryResult<Employee> = await pool.query('SELECT employee_id, first_name, last_name FROM employees');
            const employees = employeeResult.rows.map(emp => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.employee_id,
            }));

            if (employees.length === 0) {
                console.log('No employees found to update.');
                return;
            }

            const { selectedEmployee } = await inquirer.prompt<{ selectedEmployee: number }>({
                type: 'list',
                name: 'selectedEmployee',
                message: 'Select the employee you want to update:',
                choices: employees,
            });

            const roleResult: QueryResult<Role> = await pool.query('SELECT role_id, job_title FROM roles');
            const roles = roleResult.rows.map(role => ({
                name: role.job_title,
                value: role.role_id,
            }));

            const { newRole } = await inquirer.prompt<{ newRole: number }>({
                type: 'list',
                name: 'newRole',
                message: 'Select the new role for the employee:',
                choices: roles,
            });
            const managersResults: QueryResult<Employee> = await pool.query('SELECT manager_id, last_name FROM employees')
            const managers = managersResults.rows;
            const managerChoices = managers.map(employees => ({
                name: employees.last_name,
                value: employees.manager_id,
            }));

            const { manager } = await inquirer.prompt<{ manager: number }>({
                type: 'list',
                name: 'manager',
                message: 'Select the manager for the employee:',
                choices: managerChoices,
            });

            await pool.query('UPDATE employees SET role_id = $1 WHERE employee_id = $2', [newRole, selectedEmployee]);
            console.log('Employee role updated successfully!');
        } catch (error) {
            console.error('Error updating employee role:', error);
        }
    }
}