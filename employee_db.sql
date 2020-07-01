DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title	VARCHAR(30)	NOT NULL,
  salary DECIMAL NOT NULL,
  department_id	INT NULL,
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name	VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  INDEX role_ind (role_id),
  INDEX man_ind (manager_id),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE
);

INSERT INTO department (name)
VALUES ("Research and Development");
INSERT INTO department (name)
VALUES ("Marketing");
INSERT INTO department (name)
VALUES ("Engineering");

SELECT * FROM department; 
SELECT * FROM role;
INSERT INTO role (title, salary)
VALUES ("Manager", 150000);
INSERT INTO role (title, salary)
VALUES ("Supervisor", 120000);
INSERT INTO role (title, salary)
VALUES ("Developer 1", 80000);
INSERT INTO role (title, salary)
VALUES ("Developer 2", 1000000);

SELECT * FROM role;
SELECT * FROM employee;

INSERT INTO employee  (first_name, last_name, role_id, manager_id)
VALUES  ('John', 'Doe', 1, NULL),('Ashley', 'Rodriguez', 2, NULL),('Kevin', 'Tupik', 3, NULL),('Kunal', 'Singh', 4, NULL);