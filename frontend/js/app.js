// app.js - Shared utility functions used across all pages
// Include this file in every page

const API_BASE = '/api'; // Backend API base URL

// =============================================
// AUTH FUNCTIONS
// =============================================

// Check if user is logged in, redirect if not
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return null;
    }
    return getUser();
}

// Get logged in user from localStorage
function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// =============================================
// UI HELPERS
// =============================================

// Set user info in navbar
function setUserInfo() {
    const user = getUser();
    if (!user) return;

    const nameEl = document.getElementById('userName');
    const roleEl = document.getElementById('userRole');
    const avatarEl = document.getElementById('userAvatar');

    if (nameEl) nameEl.textContent = user.username;
    if (roleEl) roleEl.textContent = user.role;
    if (avatarEl) avatarEl.textContent = user.username.charAt(0).toUpperCase();
}

// Show toast notification
function showToast(message, type = 'success') {
    // Create container if not exists
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-msg ${type === 'error' ? 'error' : type === 'warning' ? 'warning' : ''}`;

    const iconMap = {
        success: '<i class="bi bi-check-circle-fill text-success"></i>',
        error: '<i class="bi bi-x-circle-fill text-danger"></i>',
        warning: '<i class="bi bi-exclamation-triangle-fill text-warning"></i>',
        info: '<i class="bi bi-info-circle-fill text-info"></i>'
    };

    toast.innerHTML = `${iconMap[type] || iconMap.info} <span>${message}</span>`;
    container.appendChild(toast);

    // Auto-remove after 3.5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Show loading state in a button
function setButtonLoading(btn, loading = true, originalText = '') {
    if (loading) {
        btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
        btn.disabled = true;
    } else {
        btn.innerHTML = btn.dataset.originalText || originalText;
        btn.disabled = false;
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR' 
    }).format(amount || 0);
}

// Format date
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Format datetime
function formatDateTime(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Get status badge HTML
function getStatusBadge(status) {
    const map = {
        'Active': 'badge-active', 'active': 'badge-active',
        'Completed': 'badge-completed', 'completed': 'badge-completed',
        'Paid': 'badge-paid',
        'Inactive': 'badge-inactive', 'inactive': 'badge-inactive',
        'Cancelled': 'badge-cancelled',
        'Refunded': 'badge-refunded',
        'Pending': 'badge-pending',
        'In Progress': 'badge-in-progress',
        'On Leave': 'badge-on-leave',
        'Partial': 'badge-partial',
        'On Hold': 'badge-on-hold',
        'Upcoming': 'badge-upcoming',
        'Discontinued': 'badge-discontinued',
        'Not Started': 'badge-not-started'
    };
    const cls = map[status] || 'badge-pending';
    return `<span class="badge-status ${cls}">${status}</span>`;
}

// Confirm delete dialog
function confirmDelete(message = 'Are you sure you want to delete this record? This cannot be undone.') {
    return confirm(message);
}

// =============================================
// API FETCH HELPERS
// =============================================

// Generic GET request
async function apiGet(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'Request failed');
        return data.data;
    } catch (err) {
        console.error(`GET ${endpoint} error:`, err);
        showToast(`Error: ${err.message}`, 'error');
        throw err;
    }
}

// Generic POST request
async function apiPost(endpoint, body) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'Request failed');
        return data;
    } catch (err) {
        console.error(`POST ${endpoint} error:`, err);
        throw err;
    }
}

// Generic PUT request
async function apiPut(endpoint, body) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'Request failed');
        return data;
    } catch (err) {
        console.error(`PUT ${endpoint} error:`, err);
        throw err;
    }
}

// Generic DELETE request
async function apiDelete(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, { method: 'DELETE' });
        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'Request failed');
        return data;
    } catch (err) {
        console.error(`DELETE ${endpoint} error:`, err);
        throw err;
    }
}

// =============================================
// SIDEBAR ACTIVE LINK
// =============================================
function setActiveSidebarLink() {
    const current = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === current) {
            link.classList.add('active');
        }
    });
}

// Run on load
document.addEventListener('DOMContentLoaded', () => {
    setActiveSidebarLink();
    setUserInfo();
});
