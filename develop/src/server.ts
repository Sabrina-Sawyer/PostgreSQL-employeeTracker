import inquirer from "inquirer";
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

await connectToDb();

class companyData {
    public async makeSelection (): Promise<void> {
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
    const { dataType } = await inquirer.prompt{[
        {
            type: 'list'
            name: 'dataType'
            message: 'Which of the following would you like to view?'
            choices: ['Departments', 'Roles', 'Employees'],
        },
    ]};
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

private async viewEmployees(): Promise<void> {
    //  const result = await pool.query('SELECT * FROM employees FULL OUTER JOIN roles ON employees.role_id = roles.role_id');
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
//not finished 
// private async createRole(): Promise<void> {
//     const result = await this.pool.query('SELECT department_name FROM departments');
//     const departments = result.rows;

//     if (departments.length === 0) {
//         console.log('No departments found.');
//         return;
//     }
// }
    const departmentChoices = departments.map(department => ({
        name: department.department_name,
        value: department.department_id,
    }));
   const { job_title, salary, department_name} = await inquirer.prompt([
        {
            type: 'input',
            name: 'job_title',
            message: 'Enter Job Title',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter Salary',
        },
        {
            type: 'list',
            name: 'department_name',
            message: 'Select the Department for this',
            choices: departmentChoices,
        },
    ])
        // .then((answers) => {
        //     let sql = `INSERT INTO department (department_name) VALUES (?)`;
        //     connection.query(sql, answer.department, (error, response) =>
        //         if (error) throw error;
        //         console.log(answer.department + `was sucessfully created.`);
        //         viewAllDepartments();
        //     });
        }



}