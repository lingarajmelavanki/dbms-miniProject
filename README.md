# 🚗 Car Manufacturing System

A fully working DBMS project website for managing a car manufacturing plant. Built with Node.js, Express, MySQL, and Bootstrap 5.

---

## 📋 Technologies Used

| Layer       | Technology                            |
|-------------|---------------------------------------|
| Frontend    | HTML, CSS, JavaScript, Bootstrap 5, Chart.js |
| Backend     | Node.js, Express.js                   |
| Database    | MySQL                                 |

---

## 📁 Folder Structure

```
car-manufacturing-system/
│── frontend/
│   │── index.html          ← Welcome / redirect page
│   │── login.html          ← Login form
│   │── dashboard.html      ← Summary cards + charts
│   │── carmodels.html      ← Car Models CRUD
│   │── inventory.html      ← Inventory CRUD
│   │── suppliers.html      ← Suppliers CRUD
│   │── orders.html         ← Manufacturing Orders CRUD
│   │── employees.html      ← Employees CRUD
│   │── assembly.html       ← Assembly Tracking CRUD
│   │── sales.html          ← Sales CRUD
│   │── reports.html        ← Reports with charts
│   ├── css/
│   │   └── style.css       ← Global styles
│   └── js/
│       └── app.js          ← Shared JS utilities
│
│── backend/
│   │── server.js           ← Express server + all API routes
│   │── db.js               ← MySQL connection
│   │── package.json        ← Node.js dependencies
│
│── database/
│   └── car_manufacturing.sql  ← Full MySQL script
│
└── README.md
```

---

## 🗄️ MySQL Setup Steps

### Step 1: Install MySQL
- Download MySQL from https://dev.mysql.com/downloads/
- Install and start the MySQL service

### Step 2: Import the Database
Open MySQL Workbench or the MySQL command line and run:

```bash
# Using command line:
mysql -u root -p < database/car_manufacturing.sql

# OR open MySQL Workbench and run the SQL file manually
```

This will:
- Create the `car_manufacturing_system` database
- Create all 8 tables with foreign keys
- Insert sample data for all tables

### Step 3: Update Database Credentials
Open `backend/db.js` and update your MySQL credentials:

```javascript
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',          // ← Your MySQL username
    password: '',          // ← Your MySQL password
    database: 'car_manufacturing_system'
});
```

---

## ⚙️ Node.js Backend Setup

### Step 1: Navigate to backend folder
```bash
cd car-manufacturing-system/backend
```

### Step 2: Install dependencies
```bash
npm install
```

This installs: `express`, `mysql2`, `cors`

### Step 3: Start the server
```bash
node server.js
```

You should see:
```
✅ Connected to MySQL database: car_manufacturing_system
🚗 Car Manufacturing System Server Running!
📡 Server: http://localhost:3000
🔐 Login: http://localhost:3000/login.html
```

---

## ▶️ How to Run the Project

1. Make sure **MySQL** is running
2. Import the SQL file (see MySQL Setup above)
3. Update database credentials in `backend/db.js`
4. Run `npm install` in the `backend/` folder
5. Run `node server.js` in the `backend/` folder
6. Open browser: **http://localhost:3000**

---

## 🔐 Default Login Credentials

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `admin123` |
| Role     | `Admin`    |

Other test accounts:
- `manager1` / `manager123` (Manager)
- `emp1` / `emp123` (Employee)

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint     | Description     |
|--------|-------------|-----------------|
| POST   | /api/login  | Login with credentials |

### Car Models
| Method | Endpoint               | Description          |
|--------|------------------------|----------------------|
| GET    | /api/carmodels         | Get all car models   |
| POST   | /api/carmodels         | Add new car model    |
| PUT    | /api/carmodels/:id     | Update car model     |
| DELETE | /api/carmodels/:id     | Delete car model     |

### Inventory
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| GET    | /api/inventory        | Get all inventory  |
| POST   | /api/inventory        | Add inventory item |
| PUT    | /api/inventory/:id    | Update item        |
| DELETE | /api/inventory/:id    | Delete item        |

### Suppliers
| Method | Endpoint             | Description       |
|--------|----------------------|-------------------|
| GET    | /api/suppliers       | Get all suppliers |
| POST   | /api/suppliers       | Add supplier      |
| PUT    | /api/suppliers/:id   | Update supplier   |
| DELETE | /api/suppliers/:id   | Delete supplier   |

### Manufacturing Orders
| Method | Endpoint         | Description      |
|--------|------------------|------------------|
| GET    | /api/orders      | Get all orders   |
| POST   | /api/orders      | Create order     |
| PUT    | /api/orders/:id  | Update order     |
| DELETE | /api/orders/:id  | Delete order     |

### Employees
| Method | Endpoint            | Description        |
|--------|---------------------|--------------------|
| GET    | /api/employees      | Get all employees  |
| POST   | /api/employees      | Add employee       |
| PUT    | /api/employees/:id  | Update employee    |
| DELETE | /api/employees/:id  | Delete employee    |

### Assembly Tracking
| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| GET    | /api/assembly       | Get all records      |
| POST   | /api/assembly       | Add assembly record  |
| PUT    | /api/assembly/:id   | Update record        |
| DELETE | /api/assembly/:id   | Delete record        |

### Sales
| Method | Endpoint        | Description    |
|--------|-----------------|----------------|
| GET    | /api/sales      | Get all sales  |
| POST   | /api/sales      | Record a sale  |
| PUT    | /api/sales/:id  | Update sale    |
| DELETE | /api/sales/:id  | Delete sale    |

### Dashboard & Reports
| Method | Endpoint                 | Description              |
|--------|--------------------------|--------------------------|
| GET    | /api/dashboard-summary   | Dashboard stat cards     |
| GET    | /api/reports             | Charts and report data   |

---

## 📱 Pages Included

| Page             | File               | Features                                      |
|------------------|--------------------|-----------------------------------------------|
| Welcome          | index.html         | Auto-redirects to login                       |
| Login            | login.html         | Username/password/role form                   |
| Dashboard        | dashboard.html     | 8 stat cards + 2 charts                       |
| Car Models       | carmodels.html     | Add/Edit/Delete car models                    |
| Inventory        | inventory.html     | Parts management with low-stock badges        |
| Suppliers        | suppliers.html     | Supplier directory with status                |
| Mfg Orders       | orders.html        | Production orders with status badges          |
| Employees        | employees.html     | HR records with department/salary             |
| Assembly         | assembly.html      | Stage tracking with progress bars             |
| Sales            | sales.html         | Sales records with total auto-calculation     |
| Reports          | reports.html       | 4 charts + low stock + top model tables       |

---

## 🗃️ Database Tables

1. **users** — Login credentials and roles
2. **car_models** — Vehicle models catalog
3. **suppliers** — Parts suppliers directory
4. **inventory** — Parts and stock levels
5. **employees** — Workforce records
6. **manufacturing_orders** — Production orders
7. **assembly_tracking** — Stage-by-stage assembly progress
8. **sales** — Customer sales transactions

---

## 💡 Tips

- If you get a DB connection error, make sure MySQL is running and credentials in `db.js` are correct
- The server serves the frontend from `http://localhost:3000` — no separate web server needed
- All pages check for login via `localStorage` — clear browser storage to reset session
- Use VS Code with the "REST Client" extension to test API routes directly
