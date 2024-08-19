import inquirer from "inquirer";
import { Connection } from "pg";
import { pool, connectToDb } from './connection.js';

await connectToDb();


// class Cli {
//     companyData: (Truck | Motorbike | Car)[];
//     selectedVehicleVin: string | undefined;
//     exit: boolean = false;

//     constructor(companyData: (Truck | Motorbike | Car)[]) {
//         this.companyData = companyData;
//     }


//     addData(): void {
//         inquirer
//           .prompt([
//             {
//               type: 'list',
//               name: 'dataType',
//               message: 'Select where you would like to add data:',
//               choices: ['Department', 'Role', 'Employee'],
//             },
//           ])
//           .then((answers) => {
//             if (answers.dataType === 'Department') {
//               this.createDepartment();
//             }
//             else if (answers.dataType === 'Role') {
//               this.createRole();
//             }
//             else if (answers.dataType === 'Employee') {
//               this.createEmployee();
//             }
//           });
//       }
    createDepartment(): void {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'department',
                    message: 'Enter Department Name',
                },
            ])
            .then((answers) => {
                let sql = `INSERT INTO department (department_name) VALUES (?)`;
                connection.query(sql, answer.department, (error, response) =>
        if (err) throw error;
                    console.log(answer.department + `was sucessfully created.`);
                    viewAllDepartments();
                });
            }


//     startCli(): void {
//         inquirer
//             .prompt([
//                 {
//                     type: 'list',
//                     name: 'choices',
//                     message:
//                         'Would you like to view, add, or update the employee data?,
//             choices: ['View', 'Add', 'Update'],
//                 },
//             ])
//             .then((answers) => {
//                 if (answers.choices === 'View') {
//                     this.viewData();
//                 } if (answers.choices === 'Add') {
//                     this.addData();
//                 } if (answers.choices === 'Update') {
//                     this.updateData();
//                 });
//     }
// }