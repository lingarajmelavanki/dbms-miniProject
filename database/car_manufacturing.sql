-- ==============================================
-- Car Manufacturing System - MySQL Database Script
-- ==============================================

-- Create and use database
CREATE DATABASE IF NOT EXISTS car_manufacturing_system;
USE car_manufacturing_system;

-- ==============================================
-- TABLE: users
-- ==============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Manager', 'Employee') DEFAULT 'Employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- TABLE: car_models
-- ==============================================
CREATE TABLE IF NOT EXISTS car_models (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(150) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    engine_type VARCHAR(100),
    price DECIMAL(12, 2) NOT NULL,
    status ENUM('Active', 'Discontinued', 'Upcoming') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- TABLE: suppliers
-- ==============================================
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(150),
    phone VARCHAR(20),
    address TEXT,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- TABLE: inventory
-- ==============================================
CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    part_name VARCHAR(150) NOT NULL,
    part_code VARCHAR(50) UNIQUE,
    supplier_id INT,
    quantity INT NOT NULL DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'units',
    min_stock INT DEFAULT 10,
    unit_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

-- ==============================================
-- TABLE: employees
-- ==============================================
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    department VARCHAR(100),
    position VARCHAR(100),
    salary DECIMAL(10, 2),
    hire_date DATE,
    status ENUM('Active', 'Inactive', 'On Leave') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- TABLE: manufacturing_orders
-- ==============================================
CREATE TABLE IF NOT EXISTS manufacturing_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    car_model_id INT,
    quantity INT NOT NULL,
    start_date DATE,
    end_date DATE,
    status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_model_id) REFERENCES car_models(id) ON DELETE SET NULL
);

-- ==============================================
-- TABLE: assembly_tracking
-- ==============================================
CREATE TABLE IF NOT EXISTS assembly_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    employee_id INT,
    stage VARCHAR(150) NOT NULL,
    progress INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    start_time DATETIME,
    end_time DATETIME,
    status ENUM('Not Started', 'In Progress', 'Completed', 'On Hold') DEFAULT 'Not Started',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES manufacturing_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- ==============================================
-- TABLE: sales
-- ==============================================
CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_number VARCHAR(50) UNIQUE NOT NULL,
    car_model_id INT,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150),
    customer_phone VARCHAR(20),
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(12, 2) NOT NULL,
    total_amount DECIMAL(14, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    sale_date DATE NOT NULL,
    payment_status ENUM('Pending', 'Paid', 'Partial', 'Refunded') DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_model_id) REFERENCES car_models(id) ON DELETE SET NULL
);

-- ==============================================
-- SAMPLE DATA: users
-- ==============================================
INSERT INTO users (username, password, role) VALUES
('admin', 'admin123', 'Admin'),
('manager1', 'manager123', 'Manager'),
('emp1', 'emp123', 'Employee');

-- ==============================================
-- SAMPLE DATA: car_models
-- ==============================================
INSERT INTO car_models (model_name, brand, year, engine_type, price, status) VALUES
('glanza', 'AutoMax', 2024, 'V6 Petrol', 655000.00, 'Active'),
('Eco Drive', 'GreenWheels', 2024, 'Electric', 442000.00, 'Active'),
('etios', 'TurboLine', 2023, 'V8 Turbo', 758000.00, 'Active'),
('innova crysta', 'ComfortRide', 2024, 'V4 Petrol', 228000.00, 'Active'),
('OffRoad hilux', 'TrailBlazer', 2023, 'V8 Diesel', 465000.00, 'Discontinued'),
('fortuner', 'UrbanDrive', 2025, 'Hybrid', 522000.00, 'Upcoming');

-- ==============================================
-- SAMPLE DATA: suppliers
-- ==============================================
INSERT INTO suppliers (supplier_name, contact_person, email, phone, address, status) VALUES
('SteelWorks Ltd', 'Ramesh D K', 'rdk@steelworks.com', '555-1001', 'Peenya Industrial Area, Bengaluru, Karnataka', 'Active'),
('ElectroParts Inc', 'Sharan K', 'sharan@electroparts.com', '555-1002', 'Electronic City Phase 1, Bengaluru, Karnataka', 'Active'),
('TireMaster Co', 'Mike Johnson', 'mike@tiremaster.com', '555-1003', 'MIDC Industrial Area, Pune, Maharashtra', 'Active'),
('GlassCraft Industries', 'Peter Parkour', 'parkour@glasscraft.com', '555-1004', 'Guindy Industrial Estate, Chennai, Tamil Nadu', 'Active'),
('EngineCore Systems', 'Shivu', 'shivu@enginecore.com', '555-1005', 'Bommasandra Industrial Area, Bengaluru, Karnataka', 'Inactive');

-- ==============================================
-- SAMPLE DATA: inventory
-- ==============================================
INSERT INTO inventory (part_name, part_code, supplier_id, quantity, unit, min_stock, unit_price) VALUES
('Steel Frame Panel', 'SFP-001', 1, 150, 'units', 20, 25000.00),
('Engine Block V6', 'EBV-001', 5, 40, 'units', 10, 150000.00),
('Alloy Wheel 18"', 'AW-018', 3, 200, 'units', 40, 18000.00),
('Windshield Glass', 'WG-001', 4, 75, 'units', 15, 32000.00),
('Car Battery 12V', 'CB-12V', 2, 8, 'units', 20, 12000.00),
('Brake Pad Set', 'BPS-001', 3, 500, 'sets', 50, 4500.00),
('Headlight LED', 'HL-LED', 2, 12, 'units', 30, 95000.00),
('Exhaust Pipe', 'EP-001', 1, 90, 'units', 15, 75000.00),
('Turbocharger Unit', 'TCU-001', 5, 5, 'units', 10, 22000.00),
('Leather Seat Set', 'LSS-001', 1, 30, 'sets', 10, 85000.00);

-- ==============================================
-- SAMPLE DATA: employees
-- ==============================================
INSERT INTO employees 
(first_name, last_name, email, phone, department, position, salary, hire_date, status) 
VALUES

('Rahul', 'Sharma', 'rahul.sharma@carmanufacturing.com', '9876500011', 
'Assembly', 'Assembly Technician', 55000.00, '2020-03-15', 'Active'),

('Priya', 'Reddy', 'priya.reddy@carmanufacturing.com', '9876500012', 
'Quality Control', 'QC Inspector', 62000.00, '2019-07-22', 'Active'),

('Arjun', 'Patel', 'arjun.patel@carmanufacturing.com', '9876500013', 
'Engineering', 'Mechanical Engineer', 78000.00, '2018-01-10', 'Active'),

('Sneha', 'Kulkarni', 'sneha.k@carmanufacturing.com', '9876500014', 
'Sales', 'Sales Manager', 85000.00, '2017-05-30', 'Active'),

('Vikram', 'Gowda', 'vikram.g@carmanufacturing.com', '9876500015', 
'Assembly', 'Line Supervisor', 70000.00, '2016-11-01', 'Active'),

('Anjali', 'Naik', 'anjali.naik@carmanufacturing.com', '9876500016', 
'HR', 'HR Manager', 72000.00, '2019-03-14', 'Active'),

('Kiran', 'Shetty', 'kiran.s@carmanufacturing.com', '9876500017', 
'Engineering', 'Design Engineer', 75000.00, '2021-08-20', 'On Leave'),

('Pooja', 'Joshi', 'pooja.j@carmanufacturing.com', '9876500018', 
'Inventory', 'Warehouse Manager', 60000.00, '2020-06-01', 'Active');

-- ==============================================
-- SAMPLE DATA: manufacturing_orders
-- ==============================================
INSERT INTO manufacturing_orders (order_number, car_model_id, quantity, start_date, end_date, status, notes) VALUES
('MO-2024-001', 1, 50, '2024-01-10', '2024-02-28', 'Completed', 'First batch of Titan X'),
('MO-2024-002', 2, 30, '2024-02-01', '2024-03-31', 'Completed', 'Eco Drive production run'),
('MO-2024-003', 3, 20, '2024-03-15', '2024-05-15', 'In Progress', 'Sport Coupe Z special edition'),
('MO-2024-004', 4, 40, '2024-04-01', '2024-05-30', 'In Progress', 'Family Van Pro batch'),
('MO-2024-005', 1, 60, '2024-05-01', '2024-07-31', 'Pending', 'Second batch Titan X'),
('MO-2024-006', 2, 25, '2024-06-01', '2024-07-31', 'Pending', 'Eco Drive second run');

-- ==============================================
-- SAMPLE DATA: assembly_tracking
-- ==============================================
INSERT INTO assembly_tracking (order_id, employee_id, stage, progress, start_time, end_time, status, notes) VALUES
(1, 1, 'Frame Assembly', 100, '2024-01-10 08:00:00', '2024-01-20 17:00:00', 'Completed', 'Completed on time'),
(1, 3, 'Engine Installation', 100, '2024-01-21 08:00:00', '2024-02-05 17:00:00', 'Completed', 'All engines installed'),
(1, 2, 'Quality Check', 100, '2024-02-06 08:00:00', '2024-02-10 17:00:00', 'Completed', 'Passed QC'),
(3, 5, 'Frame Assembly', 65, '2024-03-15 08:00:00', NULL, 'In Progress', 'On track'),
(3, 1, 'Engine Installation', 20, '2024-04-01 08:00:00', NULL, 'In Progress', 'Awaiting turbo units'),
(4, 5, 'Frame Assembly', 80, '2024-04-01 08:00:00', NULL, 'In Progress', 'Going well'),
(5, 7, 'Design Review', 0, NULL, NULL, 'Not Started', 'Scheduled to begin May'),
(4, 2, 'Quality Check', 0, NULL, NULL, 'Not Started', 'Pending frame completion');

-- ==============================================
-- SAMPLE DATA: sales
-- ==============================================
INSERT INTO sales (sale_number, car_model_id, customer_name, customer_email, customer_phone, quantity, unit_price, sale_date, payment_status, notes) VALUES
('SL-2024-001', 1, 'AutoPlex Dealership', 'orders@autoplex.com', '555-3001', 10, 370000.00, '2024-02-15', 'Paid', 'Bulk order discount applied'),
('SL-2024-002', 2, 'GreenCars Ltd', 'buy@greencars.com', '555-3002', 5, 440000.00, '2024-03-10', 'Paid', 'Fleet purchase'),
('SL-2024-003', 3, 'Luxury Motors', 'sales@luxurymotors.com', '555-3003', 3, 600000.00, '2024-03-25', 'Partial', 'Payment in installments'),
('SL-2024-004', 4, 'Family First Autos', 'orders@familyfirst.com', '555-3004', 8, 290000.00, '2024-04-05', 'Paid', 'Standard order'),
('SL-2024-005', 1, 'Metro Car Rentals', 'fleet@metrocar.com', '555-3005', 15, 360000.00, '2024-04-20', 'Pending', 'Fleet deal pending approval'),
('SL-2024-006', 2, 'EcoFleet Solutions', 'purchase@ecofleet.com', '555-3006', 12, 435000.00, '2024-05-01', 'Paid', 'Corporate fleet order');
-- ==============================================
-- CAR MANUFACTURING SYSTEM - DBMS QUERIES
-- ==============================================

USE car_manufacturing_system;

-- ==============================================
-- 1. CARTESIAN PRODUCT
-- ==============================================

SELECT e.first_name, e.department, c.model_name, c.brand
FROM employees e
CROSS JOIN car_models c;

-- ==============================================
-- 2. SIMPLE JOIN
-- ==============================================

SELECT mo.order_number, cm.model_name, mo.quantity, mo.status
FROM manufacturing_orders mo, car_models cm
WHERE mo.car_model_id = cm.id;

-- ==============================================
-- 3. EQUI JOIN
-- ==============================================

SELECT i.part_name, i.part_code, s.supplier_name
FROM inventory i
JOIN suppliers s
ON i.supplier_id = s.id;

-- ==============================================
-- 4. INNER JOIN
-- ==============================================

SELECT s.sale_number, cm.model_name, s.customer_name, s.total_amount
FROM sales s
INNER JOIN car_models cm
ON s.car_model_id = cm.id;

-- ==============================================
-- 5. LEFT OUTER JOIN
-- ==============================================

SELECT s.supplier_name, i.part_name, i.quantity
FROM suppliers s
LEFT JOIN inventory i
ON s.id = i.supplier_id;

-- ==============================================
-- 6. RIGHT OUTER JOIN
-- ==============================================

SELECT s.supplier_name, i.part_name, i.quantity
FROM suppliers s
RIGHT JOIN inventory i
ON s.id = i.supplier_id;

-- ==============================================
-- 7. FULL OUTER JOIN (MYSQL ALTERNATIVE)
-- ==============================================

SELECT s.supplier_name, i.part_name
FROM suppliers s
LEFT JOIN inventory i
ON s.id = i.supplier_id

UNION

SELECT s.supplier_name, i.part_name
FROM suppliers s
RIGHT JOIN inventory i
ON s.id = i.supplier_id;

-- ==============================================
-- 8. AGGREGATE FUNCTIONS
-- ==============================================

-- COUNT
SELECT COUNT(*) AS total_employees
FROM employees;

-- AVG
SELECT AVG(salary) AS average_salary
FROM employees;

-- MAX
SELECT MAX(price) AS highest_car_price
FROM car_models;

-- MIN
SELECT MIN(price) AS lowest_car_price
FROM car_models;

-- SUM
SELECT SUM(total_amount) AS total_sales_amount
FROM sales;

-- ==============================================
-- 9. GROUP BY
-- ==============================================

SELECT department, COUNT(*) AS total_employees
FROM employees
GROUP BY department;

SELECT payment_status, SUM(total_amount) AS total_amount
FROM sales
GROUP BY payment_status;

-- ==============================================
-- 10. HAVING CLAUSE
-- ==============================================

SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 65000;

-- ==============================================
-- 11. DISTINCT CLAUSE
-- ==============================================

SELECT DISTINCT department
FROM employees;

-- ==============================================
-- 12. ALL CLAUSE
-- ==============================================

SELECT model_name, price
FROM car_models
WHERE price >= ALL (
    SELECT price
    FROM car_models
);

-- ==============================================
-- 13. UNION
-- ==============================================

SELECT first_name AS name
FROM employees

UNION

SELECT contact_person AS name
FROM suppliers;

-- ==============================================
-- 14. UNION ALL
-- ==============================================

SELECT status
FROM employees

UNION ALL

SELECT status
FROM suppliers;

-- ==============================================
-- 15. INTERSECT ALTERNATIVE IN MYSQL
-- ==============================================

SELECT status
FROM employees
WHERE status IN (
    SELECT status
    FROM suppliers
);

-- ==============================================
-- 16. EXCEPT ALTERNATIVE IN MYSQL
-- ==============================================

SELECT id, model_name
FROM car_models
WHERE id NOT IN (
    SELECT car_model_id
    FROM sales
);

-- ==============================================
-- 17. DIVISION OPERATION
-- ==============================================

SELECT e.id, e.first_name, e.last_name
FROM employees e
WHERE NOT EXISTS (
    SELECT mo.id
    FROM manufacturing_orders mo
    WHERE mo.status = 'Completed'
    AND NOT EXISTS (
        SELECT at.id
        FROM assembly_tracking at
        WHERE at.employee_id = e.id
        AND at.order_id = mo.id
    )
);

-- ==============================================
-- 18. NOT NULL CONSTRAINT
-- ==============================================

INSERT INTO employees(first_name, last_name)
VALUES (NULL, 'Kumar');

-- ==============================================
-- 19. UNIQUE CONSTRAINT
-- ==============================================

INSERT INTO employees(first_name, last_name, email)
VALUES ('Test', 'User', 'rahul.sharma@carmanufacturing.com');

-- ==============================================
-- 20. CHECK CONSTRAINT
-- ==============================================

INSERT INTO assembly_tracking(order_id, employee_id, stage, progress)
VALUES (1, 1, 'Testing Stage', 150);

-- ==============================================
-- 21. DEFAULT CONSTRAINT
-- ==============================================

INSERT INTO suppliers(supplier_name)
VALUES ('New Auto Parts');

SELECT * FROM suppliers;

-- ==============================================
-- 22. DCL COMMANDS
-- ==============================================

CREATE USER 'student1'@'localhost'
IDENTIFIED BY 'student123';

GRANT SELECT, INSERT
ON car_manufacturing_system.*
TO 'student1'@'localhost';

REVOKE INSERT
ON car_manufacturing_system.*
FROM 'student1'@'localhost';

-- ==============================================
-- 23. TCL COMMANDS
-- ==============================================

-- COMMIT
START TRANSACTION;

UPDATE inventory
SET quantity = quantity - 5
WHERE id = 1;

COMMIT;

-- ROLLBACK
START TRANSACTION;

DELETE FROM sales
WHERE id = 1;

ROLLBACK;

-- SAVEPOINT
START TRANSACTION;

UPDATE inventory
SET quantity = quantity - 10
WHERE id = 1;

SAVEPOINT sp1;

UPDATE inventory
SET quantity = quantity - 20
WHERE id = 2;

ROLLBACK TO sp1;

COMMIT;

-- SET TRANSACTION
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

START TRANSACTION;

SELECT * FROM sales;

COMMIT;

-- ==============================================
-- 24. SUBQUERY
-- ==============================================

SELECT *
FROM employees
WHERE salary > (
    SELECT AVG(salary)
    FROM employees
);

-- ==============================================
-- 25. NESTED QUERY
-- ==============================================

SELECT model_name
FROM car_models
WHERE id IN (
    SELECT car_model_id
    FROM sales
    WHERE quantity > 5
);

-- ==============================================
-- 26. DISPLAY TABLES
-- ==============================================

SELECT * FROM employees;
SELECT * FROM car_models;
SELECT * FROM suppliers;
SELECT * FROM inventory;
SELECT * FROM manufacturing_orders;
SELECT * FROM assembly_tracking;
SELECT * FROM sales;