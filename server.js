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
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  employeeMenu();
});
function employeeMenu() {
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
        "Delete an employee"]
    })
    .then(function (answer) {
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
      }
    });
}
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "Enter the department name",
      }
    ])
    .then(function (answer) {
      connection.query("INSERT INTO department SET ?",
        [{
          name: answer.departmentName
        }],
        function (err, results) {
          if (err) throw err;
          console.log('Department added')
        });
      employeeMenu();
    });
}
function addRole() {
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
    .then(function (answer) {
      connection.query("INSERT INTO role SET ?",
        [{
          title: answer.roleTitle, salary: answer.roleSalary
        }],
        function (err, results) {
          if (err) throw err;
          console.log('Role added')
        })
      employeeMenu();
    });
}
function addEmployee() {
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
    type: "number",
    name: "roleId",
    message: "What is the employees role ID"
  }
  ]).then(function (res) {
    connection.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)', [res.firstName, res.lastName, res.roleId], function (err, data) {
      if (err) throw err;
      console.table("Successfully Inserted");
      employeeMenu();
    })
  })
}
function viewEmployees() {
  connection.query("SELECT * FROM employee",
    function (err, results) {
      if (err) throw err;
      console.table(results)
      employeeMenu();
    }
  )
}
function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    console.table(results)
    employeeMenu();
  }
  )
}
function viewRoles() {
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    console.table(results)
    employeeMenu();
  }
  )
}
function updateEmployeeRole() {
  let employeeID;
  let roleID;
  connection.query("SELECT id, first_name, last_name FROM employee", function (err, result) {
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
          connection.query("SELECT id, title FROM role", function (err, result) {
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
                }).then((answer) => {
                  let getRoleID = answer.employeeRole.split(" ");
                  roleID = getRoleID[0]
                  connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleID, employeeID], function (err, results) {
                    if (err) throw err;
                    console.log("Role Changed!");
                    employeeMenu();
                  })
                })
          })
        })
  })
};

function deleteEmployee() {
  connection.query("SELECT * FROM employee", function (err, result) {
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
      .then(function (answer) {
        let firedID = answer.employeeName.split(" ")
        connection.query("DELETE FROM employee WHERE id = ?", [firedID[0]], function (err, results) {
          if (err) throw err;
          console.log('Employee is deleted')
          employeeMenu();
        });
      });
  })
}