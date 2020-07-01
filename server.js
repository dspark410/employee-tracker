const mysql = require("mysql");
const inquirer = require('inquirer');
const cTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "employees_db"
});

connection.connect(err => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  employeeMenu();
});

const employeeMenu = () =>{
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add departments",
        "Add roles",
        "Add employees",
        "View departments",
        "View roles",
        "View employees",
        "Update employee roles",
        "Delete an employee",
        "Delete a role",
        "Delete a department"]
    })
    .then(answer => {
      switch (answer.action) {
        case "Add departments":
          addDepartment();
          break;
        case "Add roles":
          addRole();
          break;
        case "Add employees":
          addEmployee();
          break;
        case "View departments":
          viewDepartments();
          break;
        case "View roles":
          viewRoles();
          break;
        case "View employees":
          viewEmployees();
          break;
        case "Update employee roles":
          updateEmployeeRole();
          break;
        case "Delete an employee":
          deleteEmployee();
          break;
        case "Delete a role":
          deleteRole();
          break;
        case "Delete a department":
          deleteDepartment();
          break;
      }
    });
}


const addDepartment = () =>{
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "Enter the department name",
      }
    ])
    .then(answer => {
      connection.query("INSERT INTO department SET ?",
        [{
          name: answer.departmentName
        }],
        (err, results) => {
          if (err) throw err;
          console.log('Department added')
        });
      employeeMenu();
    });
}


const addRole = () => {
  inquirer
    .prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "Enter the role title",
      },
      {
        name: "roleSalary",
        type: "input",
        message: "Enter the role's salary",
      }
    ])
    .then(answer => {
      connection.query("INSERT INTO role SET ?",
        [{
          title: answer.roleTitle, salary: answer.roleSalary
        }],
        (err, results) => {
          if (err) throw err;
          console.log('Role added')
        })
      employeeMenu();
    });
}


const addEmployee = () => {
  connection.query("SELECT * FROM role", (err, result) => {
    if (err) throw err;
    inquirer.prompt([{
      type: "input",
      name: "firstName",
      message: "What is the employees first name?"
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employees last name?"
    },
    {
      type: "list",
      name: "roleId",
      message: "What is the employees role",
      choices: function () {
        let choiceArray = result.map(choice => choice.id + " " + choice.title);
        return choiceArray;
      }
    }
    ]).then(res => {
      let roleSelect = res.roleId.split(" ")
      connection.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)', [res.firstName, res.lastName, roleSelect[0]], (err, data) => {
        if (err) throw err;
        console.table("Successfully Inserted");
        employeeMenu();
      })
    })
  })
}


const viewEmployees = () => {
  connection.query("SELECT * FROM employee",
    (err, results) =>  {
      if (err) throw err;
      console.table(results)
      employeeMenu();
    }
  )
}


const viewDepartments = () => {
  connection.query("SELECT * FROM department", (err, results) =>  {
    if (err) throw err;
    console.table(results)
    employeeMenu();
  }
  )
}


const viewRoles = () => {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    console.table(results)
    employeeMenu();
  }
  )
}

const updateEmployeeRole = () =>{
  let employeeID;
  let roleID;
  connection.query("SELECT id, first_name, last_name FROM employee", (err, result) => {
    if (err) throw err;
    inquirer
      .prompt(
        {
          name: "employeeName",
          type: "list",
          message: "Which employee's role would you like to update?",
          choices: function () {
            let choiceArray = result.map(choice => choice.id + " " + choice.first_name + " " + choice.last_name);
            return choiceArray;
          }
        }).then((answer) => {
          let getID = answer.employeeName.split(" ");
          employeeID = getID[0]
          connection.query("SELECT id, title FROM role", (err, result) => {
            if (err) throw err;
            inquirer
              .prompt(
                {
                  name: "employeeRole",
                  type: "list",
                  message: "What is the employee's new role?",
                  choices: function () {
                    let choiceArray = result.map(choice => choice.id + " " + choice.title);
                    return choiceArray;
                  }
                }).then(answer => {
                  let getRoleID = answer.employeeRole.split(" ");
                  roleID = getRoleID[0]
                  connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleID, employeeID], (err, results) => {
                    if (err) throw err;
                    console.log("Role Changed!");
                    employeeMenu();
                  })
                })
          })
        })
  })
};

const deleteEmployee = () => {
  connection.query("SELECT * FROM employee", (err, result) =>{
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employeeName",
          type: "list",
          message: "Select Employee you want to fire !",
          choices: function () {
            let choiceArray = result.map(choice => choice.id + " " + choice.first_name + " " + choice.last_name);
            return choiceArray;
          }
        }
      ])
      .then(answer => {
        let firedID = answer.employeeName.split(" ")
        connection.query("DELETE FROM employee WHERE id = ?", [firedID[0]], (err, results) => {
          if (err) throw err;
          console.log('Employee is deleted')
          employeeMenu();
        });
      });
  })
}

const deleteRole = () => {
  connection.query("SELECT * FROM role", (err, result) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "role",
          type: "list",
          message: "Select role you want to remove",
          choices: function () {
            let choiceArray = result.map(choice => choice.id + " " + choice.title + " " + choice.salary);
            return choiceArray;
          }
        }
      ])
      .then(function (answer) {
        let roleID = answer.role.split(" ")
        connection.query("DELETE FROM role WHERE id = ?", [roleID[0]], (err, results) => {
          if (err) throw err;
          console.log('Role has been removed')
          employeeMenu();
        });
      });
  })
}

const deleteDepartment = () => {
  connection.query("SELECT * FROM department", (err, result) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "department",
          type: "list",
          message: "Select department you want to remove",
          choices: function () {
            let choiceArray = result.map(choice => choice.id + " " + choice.name);
            return choiceArray;
          }
        }
      ])
      .then(answer => {
        let departmentID = answer.department.split(" ")
        connection.query("DELETE FROM department WHERE id = ?", [departmentID[0]], (err, results) => {
          if (err) throw err;
          console.log('Department has been removed')
          employeeMenu();
        });
      });
  })
}