// server.js - Main Express Server
// Run with: node server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

// =============================================
// MIDDLEWARE SETUP
// =============================================

// Enable CORS for all origins (allows frontend to call backend)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from the 'frontend' folder
app.use(express.static(path.join(__dirname, '../frontend')));

// =============================================
// ROOT ROUTE - Redirect to login
// =============================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// =============================================
// API: LOGIN
// =============================================
app.post('/api/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Find user by username and password
        const [rows] = await db.query(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const user = rows[0];
        // Return user info (in real apps, use JWT tokens)
        res.json({
            success: true,
            message: 'Login successful',
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

// =============================================
// API: DASHBOARD SUMMARY
// =============================================
app.get('/api/dashboard-summary', async (req, res) => {
    try {
        // Get counts from all main tables
        const [[{ totalModels }]] = await db.query('SELECT COUNT(*) as totalModels FROM car_models WHERE status = "Active"');
        const [[{ totalOrders }]] = await db.query('SELECT COUNT(*) as totalOrders FROM manufacturing_orders');
        const [[{ totalEmployees }]] = await db.query('SELECT COUNT(*) as totalEmployees FROM employees WHERE status = "Active"');
        const [[{ totalRevenue }]] = await db.query('SELECT COALESCE(SUM(total_amount), 0) as totalRevenue FROM sales WHERE payment_status = "Paid"');
        const [[{ totalSales }]] = await db.query('SELECT COUNT(*) as totalSales FROM sales');
        const [[{ lowStockCount }]] = await db.query('SELECT COUNT(*) as lowStockCount FROM inventory WHERE quantity <= min_stock');
        const [[{ pendingOrders }]] = await db.query('SELECT COUNT(*) as pendingOrders FROM manufacturing_orders WHERE status = "Pending"');
        const [[{ inProgressOrders }]] = await db.query('SELECT COUNT(*) as inProgressOrders FROM manufacturing_orders WHERE status = "In Progress"');

        res.json({
            success: true,
            data: {
                totalModels,
                totalOrders,
                totalEmployees,
                totalRevenue,
                totalSales,
                lowStockCount,
                pendingOrders,
                inProgressOrders
            }
        });
    } catch (err) {
        console.error('Dashboard summary error:', err);
        res.status(500).json({ success: false, message: 'Error fetching dashboard data' });
    }
});

// =============================================
// API: REPORTS
// =============================================
app.get('/api/reports', async (req, res) => {
    try {
        // Sales by car model
        const [salesByModel] = await db.query(`
            SELECT cm.model_name, SUM(s.quantity) as units_sold, SUM(s.total_amount) as revenue
            FROM sales s
            JOIN car_models cm ON s.car_model_id = cm.id
            GROUP BY cm.id, cm.model_name
            ORDER BY revenue DESC
        `);

        // Orders by status
        const [ordersByStatus] = await db.query(`
            SELECT status, COUNT(*) as count
            FROM manufacturing_orders
            GROUP BY status
        `);

        // Low stock items
        const [lowStock] = await db.query(`
            SELECT part_name, quantity, min_stock
            FROM inventory
            WHERE quantity <= min_stock
            ORDER BY quantity ASC
        `);

        // Monthly sales (last 6 months)
        const [monthlySales] = await db.query(`
  SELECT 
    DATE_FORMAT(sale_date, '%b %Y') AS month,
    SUM(total_amount) AS revenue,
    COUNT(*) AS transactions
  FROM sales
  GROUP BY YEAR(sale_date), MONTH(sale_date), DATE_FORMAT(sale_date, '%b %Y')
  ORDER BY YEAR(sale_date) DESC, MONTH(sale_date) DESC
  LIMIT 6
`);

        // Assembly by status
        const [assemblyStatus] = await db.query(`
            SELECT status, COUNT(*) as count
            FROM assembly_tracking
            GROUP BY status
        `);

        res.json({
            success: true,
            data: { salesByModel, ordersByStatus, lowStock, monthlySales, assemblyStatus }
        });
    } catch (err) {
        console.error('Reports error:', err);
        res.status(500).json({ success: false, message: 'Error fetching reports' });
    }
});

// =============================================
// API: CAR MODELS - CRUD
// =============================================

// GET all car models
app.get('/api/carmodels', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM car_models ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching car models' });
    }
});

// POST create new car model
app.post('/api/carmodels', async (req, res) => {
    try {
        const { model_name, brand, year, engine_type, price, status } = req.body;
        const [result] = await db.query(
            'INSERT INTO car_models (model_name, brand, year, engine_type, price, status) VALUES (?, ?, ?, ?, ?, ?)',
            [model_name, brand, year, engine_type, price, status || 'Active']
        );
        res.json({ success: true, message: 'Car model added successfully', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error adding car model' });
    }
});

// PUT update car model
app.put('/api/carmodels/:id', async (req, res) => {
    try {
        const { model_name, brand, year, engine_type, price, status } = req.body;
        await db.query(
            'UPDATE car_models SET model_name=?, brand=?, year=?, engine_type=?, price=?, status=? WHERE id=?',
            [model_name, brand, year, engine_type, price, status, req.params.id]
        );
        res.json({ success: true, message: 'Car model updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error updating car model' });
    }
});

// DELETE car model
app.delete('/api/carmodels/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM car_models WHERE id=?', [req.params.id]);
        res.json({ success: true, message: 'Car model deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error deleting car model' });
    }
});

// =============================================
// API: INVENTORY - CRUD
// =============================================

// GET all inventory
app.get('/api/inventory', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT i.*, s.supplier_name 
            FROM inventory i 
            LEFT JOIN suppliers s ON i.supplier_id = s.id
            ORDER BY i.created_at DESC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching inventory' });
    }
});

// POST create inventory item
app.post('/api/inventory', async (req, res) => {
    try {
        const { part_name, part_code, supplier_id, quantity, unit, min_stock, unit_price } = req.body;
        const [result] = await db.query(
            'INSERT INTO inventory (part_name, part_code, supplier_id, quantity, unit, min_stock, unit_price) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [part_name, part_code, supplier_id || null, quantity, unit || 'units', min_stock || 10, unit_price]
        );
        res.json({ success: true, message: 'Inventory item added', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error adding inventory item' });
    }
});

// PUT update inventory
app.put('/api/inventory/:id', async (req, res) => {
    try {
        const { part_name, part_code, supplier_id, quantity, unit, min_stock, unit_price } = req.body;
        await db.query(
            'UPDATE inventory SET part_name=?, part_code=?, supplier_id=?, quantity=?, unit=?, min_stock=?, unit_price=? WHERE id=?',
            [part_name, part_code, supplier_id || null, quantity, unit, min_stock, unit_price, req.params.id]
        );
        res.json({ success: true, message: 'Inventory updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error updating inventory' });
    }
});

// DELETE inventory
app.delete('/api/inventory/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM inventory WHERE id=?', [req.params.id]);
        res.json({ success: true, message: 'Inventory item deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error deleting inventory item' });
    }
});

// =============================================
// API: SUPPLIERS - CRUD
// =============================================

// GET all suppliers
app.get('/api/suppliers', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM suppliers ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching suppliers' });
    }
});

// POST create supplier
app.post('/api/suppliers', async (req, res) => {
    try {
        const { supplier_name, contact_person, email, phone, address, status } = req.body;
        const [result] = await db.query(
            'INSERT INTO suppliers (supplier_name, contact_person, email, phone, address, status) VALUES (?, ?, ?, ?, ?, ?)',
            [supplier_name, contact_person, email, phone, address, status || 'Active']
        );
        res.json({ success: true, message: 'Supplier added successfully', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error adding supplier' });
    }
});

// PUT update supplier
app.put('/api/suppliers/:id', async (req, res) => {
    try {
        const { supplier_name, contact_person, email, phone, address, status } = req.body;
        await db.query(
            'UPDATE suppliers SET supplier_name=?, contact_person=?, email=?, phone=?, address=?, status=? WHERE id=?',
            [supplier_name, contact_person, email, phone, address, status, req.params.id]
        );
        res.json({ success: true, message: 'Supplier updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error updating supplier' });
    }
});

// DELETE supplier
app.delete('/api/suppliers/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM suppliers WHERE id=?', [req.params.id]);
        res.json({ success: true, message: 'Supplier deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error deleting supplier' });
    }
});

// =============================================
// API: MANUFACTURING ORDERS - CRUD
// =============================================

// GET all orders
app.get('/api/orders', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, cm.model_name, cm.brand
            FROM manufacturing_orders o
            LEFT JOIN car_models cm ON o.car_model_id = cm.id
            ORDER BY o.created_at DESC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
});

// POST create order
app.post('/api/orders', async (req, res) => {
    try {
        const { order_number, car_model_id, quantity, start_date, end_date, status, notes } = req.body;
        const [result] = await db.query(
            'INSERT INTO manufacturing_orders (order_number, car_model_id, quantity, start_date, end_date, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [order_number, car_model_id, quantity, start_date, end_date, status || 'Pending', notes]
        );
        res.json({ success: true, message: 'Order created successfully', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error creating order' });
    }
});

// PUT update order
app.put('/api/orders/:id', async (req, res) => {
    try {
        const { order_number, car_model_id, quantity, start_date, end_date, status, notes } = req.body;
        await db.query(
            'UPDATE manufacturing_orders SET order_number=?, car_model_id=?, quantity=?, start_date=?, end_date=?, status=?, notes=? WHERE id=?',
            [order_number, car_model_id, quantity, start_date, end_date, status, notes, req.params.id]
        );
        res.json({ success: true, message: 'Order updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error updating order' });
    }
});

// DELETE order
app.delete('/api/orders/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM manufacturing_orders WHERE id=?', [req.params.id]);
        res.json({ success: true, message: 'Order deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error deleting order' });
    }
});

// =============================================
// API: EMPLOYEES - CRUD
// =============================================

// GET all employees
app.get('/api/employees', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM employees ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching employees' });
    }
});

// POST create employee
app.post('/api/employees', async (req, res) => {
    try {
        const { first_name, last_name, email, phone, department, position, salary, hire_date, status } = req.body;
        const [result] = await db.query(
            'INSERT INTO employees (first_name, last_name, email, phone, department, position, salary, hire_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, phone, department, position, salary, hire_date, status || 'Active']
        );
        res.json({ success: true, message: 'Employee added successfully', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error adding employee' });
    }
});

// PUT update employee
app.put('/api/employees/:id', async (req, res) => {
    try {
        const { first_name, last_name, email, phone, department, position, salary, hire_date, status } = req.body;
        await db.query(
            'UPDATE employees SET first_name=?, last_name=?, email=?, phone=?, department=?, position=?, salary=?, hire_date=?, status=? WHERE id=?',
            [first_name, last_name, email, phone, department, position, salary, hire_date, status, req.params.id]
        );
        res.json({ success: true, message: 'Employee updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error updating employee' });
    }
});

// DELETE employee
app.delete('/api/employees/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM employees WHERE id=?', [req.params.id]);
        res.json({ success: true, message: 'Employee deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error deleting employee' });
    }
});

// =============================================
// API: ASSEMBLY TRACKING - CRUD
// =============================================

// GET all assembly records
app.get('/api/assembly', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT a.*, 
                   mo.order_number, 
                   cm.model_name,
                   CONCAT(e.first_name, ' ', e.last_name) as employee_name
            FROM assembly_tracking a
            LEFT JOIN manufacturing_orders mo ON a.order_id = mo.id
            LEFT JOIN car_models cm ON mo.car_model_id = cm.id
            LEFT JOIN employees e ON a.employee_id = e.id
            ORDER BY a.created_at DESC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching assembly records' });
    }
});

// POST create assembly record
app.post('/api/assembly', async (req, res) => {
    try {
        const { order_id, employee_id, stage, progress, start_time, end_time, status, notes } = req.body;
        const [result] = await db.query(
            'INSERT INTO assembly_tracking (order_id, employee_id, stage, progress, start_time, end_time, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [order_id, employee_id || null, stage, progress || 0, start_time || null, end_time || null, status || 'Not Started', notes]
        );
        res.json({ success: true, message: 'Assembly record added', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error adding assembly record' });
    }
});

// PUT update assembly record
app.put('/api/assembly/:id', async (req, res) => {
    try {
        const { order_id, employee_id, stage, progress, start_time, end_time, status, notes } = req.body;
        await db.query(
            'UPDATE assembly_tracking SET order_id=?, employee_id=?, stage=?, progress=?, start_time=?, end_time=?, status=?, notes=? WHERE id=?',
            [order_id, employee_id || null, stage, progress, start_time || null, end_time || null, status, notes, req.params.id]
        );
        res.json({ success: true, message: 'Assembly record updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error updating assembly record' });
    }
});

// DELETE assembly record
app.delete('/api/assembly/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM assembly_tracking WHERE id=?', [req.params.id]);
        res.json({ success: true, message: 'Assembly record deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error deleting assembly record' });
    }
});

// =============================================
// API: SALES - CRUD
// =============================================

// GET all sales
app.get('/api/sales', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.*, cm.model_name, cm.brand
            FROM sales s
            LEFT JOIN car_models cm ON s.car_model_id = cm.id
            ORDER BY s.created_at DESC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching sales' });
    }
});

// POST create sale
app.post('/api/sales', async (req, res) => {
    try {
        const { sale_number, car_model_id, customer_name, customer_email, customer_phone, quantity, unit_price, sale_date, payment_status, notes } = req.body;
        const [result] = await db.query(
            'INSERT INTO sales (sale_number, car_model_id, customer_name, customer_email, customer_phone, quantity, unit_price, sale_date, payment_status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [sale_number, car_model_id, customer_name, customer_email, customer_phone, quantity, unit_price, sale_date, payment_status || 'Pending', notes]
        );
        res.json({ success: true, message: 'Sale recorded successfully', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error recording sale' });
    }
});

// PUT update sale
app.put('/api/sales/:id', async (req, res) => {
    try {
        const { sale_number, car_model_id, customer_name, customer_email, customer_phone, quantity, unit_price, sale_date, payment_status, notes } = req.body;
        await db.query(
            'UPDATE sales SET sale_number=?, car_model_id=?, customer_name=?, customer_email=?, customer_phone=?, quantity=?, unit_price=?, sale_date=?, payment_status=?, notes=? WHERE id=?',
            [sale_number, car_model_id, customer_name, customer_email, customer_phone, quantity, unit_price, sale_date, payment_status, notes, req.params.id]
        );
        res.json({ success: true, message: 'Sale updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error updating sale' });
    }
});

// DELETE sale
app.delete('/api/sales/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM sales WHERE id=?', [req.params.id]);
        res.json({ success: true, message: 'Sale deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error deleting sale' });
    }
});

// =============================================
// START SERVER
// =============================================
app.listen(PORT, () => {
    console.log(`\n🚗 Car Manufacturing System Server Running!`);
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🔐 Login: http://localhost:${PORT}/login.html`);
    console.log(`\nPress Ctrl+C to stop the server.\n`);
});
