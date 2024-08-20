import inquirer from "inquirer";
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

await connectToDb();

class companyData {
    public async makeSelection(): Promise<void> {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'choices',
                message:
                    'Would you like to view, add, or update the employee data?',
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
        const { dataType } = await inquirer.prompt([
            {
            type: 'list'
            name: 'dataType'
            message: 'Which of the following would you like to view?'
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
        const result = await pool.query('SELECT * FROM departments');
        const departments = result.rows;
        if (departments.length > 0) {
            console.table(departments);
        } else {
            console.log('No departments found.');
        }
    }
    private async viewRoles(): Promise<void> {
        const result = await pool.query('SELECT * FROM roles');
        const roles = result.rows;
        if (roles.length > 0) {
            console.table(roles);
        } else {
            console.log('No roles found.');
        }
    }

    // look at database connection
    private async viewEmployees(): Promise<void> {
        const result = await pool.query('SELECT * FROM employees FULL OUTER JOIN roles ON employees.role_id = roles.role_id');
        const employees = result.rows;
        if (employees.length > 0) {
            console.table(employees);
        } else {
            console.log('No employees found.');
        }
    }

    //not finished 
    private async addData(): Promise<void> {
        const answers = await inquirer.prompt([
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
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'department',
                    message: 'Enter Department Name',
                },
            ]);
            const departmentName = answers.department;
            const results = await pool.query('INSERT INTO departments (department_name) VALUES ($1)', [departmentName]);
            console.log('Department added sucessfully!');
        } catch (error) {
            console.error('Error adding department:', error);
        }
    }

    private async createRole(): Promise<void> {
        try {
            const departmentResult = await pool.query('SELECT department_id, department_name FROM departments');
            const departments = departmentResult.rows;

            if (departments.length === 0) {
                console.log('No departments found. Please add a department first.');
                return;
            }
            const departmentChoices = departments.map((dep: { department_id: number; department_name: string }) => ({
                name: department.department_name,
                value: department.department_id,
            }));
            const answers = await inquirer.prompt([
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
            const result = await pool.query(
                'INSERT INTO roles (job_title, salary, department_id) VALUES ($1, $2, $3,)',
                [job_title, salary, department]
            );
            console.log('Role added sucessfully!');
        } catch (error) {
            console.error('Error adding role:', error);
        }
    }



    //     private async createEmployee(): Promise<void> {
    //     try {
    //    const answers = await inquirer.prompt([
    //             {
    //                 type: 'input',
    //                 name: 'first_name',
    //                 message: 'Provide the First Name of the Employee:',
    //             },
    //             {
    //                type: 'input',
    //                 name: 'last_name',
    //                 message: 'Provide the Last Name of the Employee:',
    //             },
    //             {
    //                type: 'input',
    //                 name: 'manager',
    //                 message: 'Provide the Manager of the Employee:',
    //             },
    //             {
    //                 type: 'list',
    //                 name: 'role',
    //                 message: 'Select the Role of the Employee',
    //                 choices: roleChoices,
    //             },
    //         ]);

    //         const { job_title, salary, department } = answers;
    //         const result = await pool.query(
    //             'INSERT INTO roles (job_title, salary, department_id) VALUES ($1, $2, $3,)',
    //             [job_title, salary, department]
    //         );
    //         console.log('Role added sucessfully!');
    //     } catch (error) {
    //         console.error('Error adding role:', error);
    //     }
    // }

}