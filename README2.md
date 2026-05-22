# Car Manufacturing System

A full-stack Car Manufacturing Management System developed using Node.js, Express.js, MySQL, HTML, CSS, JavaScript, and Bootstrap 5.

This project helps manage car manufacturing operations including car models, suppliers, inventory, employees, manufacturing orders, assembly tracking, and sales.

---

# Features

- User Authentication
- Dashboard Analytics
- Car Models Management
- Inventory Management
- Supplier Management
- Employee Management
- Manufacturing Orders Tracking
- Assembly Tracking System
- Sales Management
- Revenue Reports
- Responsive UI Design
- MySQL Database Integration

---

# Technologies Used

## Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Bootstrap Icons

## Backend
- Node.js
- Express.js

## Database
- MySQL

---

# Database Tables

The database contains the following tables:

1. users
2. car_models
3. suppliers
4. inventory
5. employees
6. manufacturing_orders
7. assembly_tracking
8. sales

Database name:

```sql
car_manufacturing_system
```

---

# Project Structure

```bash
car-manufacturing-system/
│
├── frontend/
│   ├── dashboard.html
│   ├── carmodels.html
│   ├── inventory.html
│   ├── suppliers.html
│   ├── employees.html
│   ├── orders.html
│   ├── assembly.html
│   ├── sales.html
│   ├── reports.html
│   ├── css/
│   └── js/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│
├── database/
│   └── car_manufacturing.sql
│
└── README.md
```

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone <your-github-repository-link>
```

---

## 2. Open Project

Open the project folder in VS Code.

---

## 3. Install Backend Dependencies

Open terminal:

```bash
cd backend
npm install
```

---

## 4. Configure MySQL

Create database in MySQL:

```sql
CREATE DATABASE car_manufacturing_system;
```

Import SQL file:

```sql
SOURCE car_manufacturing.sql;
```

---

## 5. Configure Database Connection

Edit `db.js` file:

```js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'car_manufacturing_system'
});
```

---

## 6. Run Backend Server

```bash
npm start
```

or

```bash
node server.js
```

---

## 7. Open Website

Open browser:

```bash
http://localhost:3000
```

---

# Main Functionalities

## Dashboard
- Total Revenue
- Total Sales
- Employees Count
- Inventory Status

## Car Models
- Add/Edit/Delete car models
- Track car prices and engine types

## Inventory
- Manage manufacturing parts
- Low stock monitoring

## Suppliers
- Supplier details management

## Employees
- Employee records
- Department tracking
- Salary management

## Manufacturing Orders
- Production order management
- Production status tracking

## Assembly Tracking
- Production stage monitoring
- Employee assignment
- Progress tracking

## Sales
- Customer orders
- Payment tracking
- Revenue generation

---

# SQL Concepts Used

- Joins
- Aggregate Functions
- GROUP BY
- HAVING
- UNION
- Subqueries
- Nested Queries
- Constraints
- DCL Commands
- TCL Commands

---

# Future Improvements

- AI-based production prediction
- Real-time analytics dashboard
- Role-based authentication
- Email notifications
- Cloud deployment
- REST API improvements

---

# Developed By

Lingaraj Melavanki

Computer Science Engineering Student

---

# License

This project is developed for educational and academic purposes.