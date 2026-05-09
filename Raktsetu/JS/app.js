/**
 * RaktSetu - Blood Bank Management System
 * Main JavaScript Application File
 */

// ============================================
// CONFIGURATION & STATE
// ============================================

const APP_CONFIG = {
    apiBaseUrl: '/api/v1', // Placeholder API base URL
    tokenKey: 'raktsetu_token',
    userKey: 'raktsetu_user',
    sessionTimeout: 30 * 60 * 1000 // 30 minutes
};

// Application State
const AppState = {
    user: null,
    isAuthenticated: false,
    sidebarOpen: window.innerWidth > 768,
    notifications: [],
    currentPage: 1,
    itemsPerPage: 10
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function to limit rapid function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format date to locale string
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Format date with time
 */
function formatDateTime(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Generate unique ID
 */
function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Get element by selector
 */
function $(selector) {
    return document.querySelector(selector);
}

/**
 * Get all elements by selector
 */
function $$(selector) {
    return document.querySelectorAll(selector);
}

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const Storage = {
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage get error:', e);
            return null;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Storage set error:', e);
        }
    },
    
    remove(key) {
        localStorage.removeItem(key);
    },
    
    clear() {
        localStorage.clear();
    }
};

// ============================================
// API SERVICE (PLACEHOLDER)
// ============================================

const ApiService = {
    /**
     * Generic fetch wrapper with auth headers
     */
    async request(endpoint, options = {}) {
        const token = Storage.get(APP_CONFIG.tokenKey);
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }
        
        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        };
        
        try {
            // Placeholder: In production, this would make actual API calls
            console.log(`API Request: ${options.method || 'GET'} ${APP_CONFIG.apiBaseUrl}${endpoint}`);
            console.log('Request body:', options.body);
            
            // Simulate API response delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Return mock success response
            return { success: true, data: {} };
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    // Auth endpoints
    async login(credentials) {
        /*
         * POST /api/v1/auth/login
         * Body: { role, username, password }
         * Response: { token, user }
         */
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },
    
    async register(userData) {
        /*
         * POST /api/v1/auth/register
         * Body: { organizationName, name, email, mobile, password, role }
         */
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },
    
    async logout() {
        /*
         * POST /api/v1/auth/logout
         */
        return this.request('/auth/logout', { method: 'POST' });
    },
    
    // Inventory endpoints
    async getInventory(filters = {}) {
        /*
         * GET /api/v1/inventory
         * Query: { bloodGroup, componentType, district, page, limit }
         */
        const query = new URLSearchParams(filters).toString();
        return this.request(`/inventory?${query}`);
    },
    
    async addInventory(data) {
        /*
         * POST /api/v1/inventory
         * Body: { bloodBankName, bloodGroup, componentType, units, district, receivedDate, expiryDate }
         */
        return this.request('/inventory', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    async updateInventory(id, data) {
        /*
         * PUT /api/v1/inventory/:id
         */
        return this.request(`/inventory/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // Request endpoints
    async getRequests(filters = {}) {
        /*
         * GET /api/v1/requests
         */
        const query = new URLSearchParams(filters).toString();
        return this.request(`/requests?${query}`);
    },
    
    async createRequest(data) {
        /*
         * POST /api/v1/requests
         * Body: { hospitalName, bloodGroup, componentType, units }
         */
        return this.request('/requests', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    async updateRequestStatus(id, status) {
        /*
         * PATCH /api/v1/requests/:id/status
         * Body: { status: 'approved' | 'rejected' }
         */
        return this.request(`/requests/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
    },
    
    // Reservation endpoints
    async getReservations(filters = {}) {
        /*
         * GET /api/v1/reservations
         */
        const query = new URLSearchParams(filters).toString();
        return this.request(`/reservations?${query}`);
    },
    
    async releaseReservation(id) {
        /*
         * DELETE /api/v1/reservations/:id
         */
        return this.request(`/reservations/${id}`, { method: 'DELETE' });
    },
    
    // Alerts endpoints
    async getAlerts(filters = {}) {
        /*
         * GET /api/v1/alerts
         */
        const query = new URLSearchParams(filters).toString();
        return this.request(`/alerts?${query}`);
    },
    
    async markAlertRead(id) {
        /*
         * PATCH /api/v1/alerts/:id/read
         */
        return this.request(`/alerts/${id}/read`, { method: 'PATCH' });
    },
    
    async acknowledgeAlert(id) {
        /*
         * PATCH /api/v1/alerts/:id/acknowledge
         */
        return this.request(`/alerts/${id}/acknowledge`, { method: 'PATCH' });
    },
    
    // Reports endpoints
    async getAuditLogs(filters = {}) {
        /*
         * GET /api/v1/reports/audit-logs
         */
        const query = new URLSearchParams(filters).toString();
        return this.request(`/reports/audit-logs?${query}`);
    },
    
    async getReportData(reportType) {
        /*
         * GET /api/v1/reports/:type
         * Types: usage, wastage, reservations, shortages, emergency
         */
        return this.request(`/reports/${reportType}`);
    },
    
    // Dashboard endpoints
    async getDashboardStats() {
        /*
         * GET /api/v1/dashboard/stats
         */
        return this.request('/dashboard/stats');
    },
    
    async getEmergencyRequests() {
        /*
         * GET /api/v1/dashboard/emergency-requests
         */
        return this.request('/dashboard/emergency-requests');
    }
};

// ============================================
// AUTHENTICATION MODULE
// ============================================

const Auth = {
    init() {
        const user = Storage.get(APP_CONFIG.userKey);
        const token = Storage.get(APP_CONFIG.tokenKey);
        
        if (user && token) {
            AppState.user = user;
            AppState.isAuthenticated = true;
        }
    },
    
    async login(role, username, password) {
        try {
            // Placeholder: Simulate login
            const response = await ApiService.login({ role, username, password });
            
            // Mock user data based on role
            const mockUser = {
                id: generateId(),
                name: username,
                role: role,
                email: `${username}@example.com`,
                avatar: username.charAt(0).toUpperCase()
            };
            
            // Store auth data
            Storage.set(APP_CONFIG.tokenKey, 'mock_jwt_token_' + Date.now());
            Storage.set(APP_CONFIG.userKey, mockUser);
            
            AppState.user = mockUser;
            AppState.isAuthenticated = true;
            
            return { success: true, user: mockUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    async register(userData) {
        try {
            const response = await ApiService.register(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    logout() {
        Storage.remove(APP_CONFIG.tokenKey);
        Storage.remove(APP_CONFIG.userKey);
        AppState.user = null;
        AppState.isAuthenticated = false;
        window.location.href = 'login.html';
    },
    
    isAuthenticated() {
        return AppState.isAuthenticated;
    },
    
    getUser() {
        return AppState.user;
    },
    
    hasRole(role) {
        return AppState.user && AppState.user.role === role;
    },
    
    isAdmin() {
        return this.hasRole('admin');
    }
};

// ============================================
// UI COMPONENTS
// ============================================

const UI = {
    // Sidebar Toggle
    initSidebar() {
        const toggleBtn = $('#sidebar-toggle');
        const sidebar = $('#sidebar');
        const overlay = $('#sidebar-overlay');
        
        if (!toggleBtn || !sidebar) return;
        
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
            AppState.sidebarOpen = sidebar.classList.contains('active');
        });
        
        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                AppState.sidebarOpen = false;
            });
        }
        
        // Close sidebar on window resize (mobile)
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
            }
        }, 250));
    },
    
    // Modal Management
    openModal(modalId) {
        const modal = $(`#${modalId}`);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },
    
    closeModal(modalId) {
        const modal = $(`#${modalId}`);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    closeAllModals() {
        $$('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    },
    
    // Dropdown Management
    initDropdowns() {
        $$('[data-dropdown-toggle]').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdownId = toggle.getAttribute('data-dropdown-toggle');
                const dropdown = $(`#${dropdownId}`);
                
                // Close other dropdowns
                $$('.dropdown-menu.active').forEach(d => {
                    if (d.id !== dropdownId) d.classList.remove('active');
                });
                
                if (dropdown) {
                    dropdown.classList.toggle('active');
                }
            });
        });
        
        // Close dropdowns on outside click
        document.addEventListener('click', () => {
            $$('.dropdown-menu.active').forEach(d => d.classList.remove('active'));
        });
    },
    
    // Toast Notifications
    showToast(type, title, message, duration = 5000) {
        const container = $('#toast-container') || this.createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-icon ${type}">
                ${this.getToastIcon(type)}
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    },
    
    getToastIcon(type) {
        const icons = {
            success: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
            error: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            warning: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
            info: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
        };
        return icons[type] || icons.info;
    },
    
    // Notification Dropdown
    initNotifications() {
        const bell = $('#notification-bell');
        const dropdown = $('#notification-dropdown');
        
        if (!bell || !dropdown) return;
        
        bell.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== bell) {
                dropdown.classList.remove('active');
            }
        });
    },
    
    // Update notification badge count
    updateNotificationBadge(count) {
        const badge = $('#notification-badge');
        if (badge) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
};

// ============================================
// FORM VALIDATION
// ============================================

const FormValidator = {
    rules: {
        required: (value) => value.trim() !== '' || 'This field is required',
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email address',
        phone: (value) => /^\d{10}$/.test(value.replace(/\D/g, '')) || 'Invalid phone number',
        minLength: (min) => (value) => value.length >= min || `Minimum ${min} characters required`,
        maxLength: (max) => (value) => value.length <= max || `Maximum ${max} characters allowed`,
        match: (fieldId, fieldName) => (value) => {
            const field = $(`#${fieldId}`);
            return (field && value === field.value) || `Must match ${fieldName}`;
        },
        password: (value) => {
            const hasUpper = /[A-Z]/.test(value);
            const hasLower = /[a-z]/.test(value);
            const hasNumber = /\d/.test(value);
            const hasSpecial = /[!@#$%^&*]/.test(value);
            const isLongEnough = value.length >= 8;
            
            if (!isLongEnough) return 'Password must be at least 8 characters';
            if (!hasUpper) return 'Password must contain an uppercase letter';
            if (!hasLower) return 'Password must contain a lowercase letter';
            if (!hasNumber) return 'Password must contain a number';
            if (!hasSpecial) return 'Password must contain a special character (!@#$%^&*)';
            return true;
        }
    },
    
    validate(form) {
        let isValid = true;
        const errors = {};
        
        form.querySelectorAll('[data-validate]').forEach(field => {
            const rules = field.dataset.validate.split('|');
            const value = field.value;
            
            for (const rule of rules) {
                let validator;
                let params = [];
                
                if (rule.includes(':')) {
                    const [ruleName, ...ruleParams] = rule.split(':');
                    params = ruleParams;
                    validator = this.rules[ruleName];
                    if (typeof validator === 'function' && params.length) {
                        validator = validator(...params);
                    }
                } else {
                    validator = this.rules[rule];
                }
                
                if (validator) {
                    const result = validator(value);
                    if (result !== true) {
                        isValid = false;
                        errors[field.name || field.id] = result;
                        this.showError(field, result);
                        break;
                    } else {
                        this.clearError(field);
                    }
                }
            }
        });
        
        return { isValid, errors };
    },
    
    showError(field, message) {
        field.classList.add('error');
        
        let errorEl = field.parentElement.querySelector('.form-error');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'form-error';
            field.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = message;
    },
    
    clearError(field) {
        field.classList.remove('error');
        const errorEl = field.parentElement.querySelector('.form-error');
        if (errorEl) errorEl.remove();
    },
    
    clearAllErrors(form) {
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        form.querySelectorAll('.form-error').forEach(el => el.remove());
    }
};

// ============================================
// PASSWORD STRENGTH INDICATOR
// ============================================

const PasswordStrength = {
    init(inputId, indicatorId) {
        const input = $(`#${inputId}`);
        const indicator = $(`#${indicatorId}`);
        
        if (!input || !indicator) return;
        
        input.addEventListener('input', () => {
            const strength = this.calculate(input.value);
            this.update(indicator, strength);
        });
    },
    
    calculate(password) {
        let score = 0;
        
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
        
        if (score <= 2) return { level: 'weak', label: 'Weak' };
        if (score <= 3) return { level: 'fair', label: 'Fair' };
        if (score <= 4) return { level: 'good', label: 'Good' };
        return { level: 'strong', label: 'Strong' };
    },
    
    update(indicator, strength) {
        const bars = indicator.querySelectorAll('.password-strength-bar');
        const text = indicator.querySelector('.password-strength-text');
        
        bars.forEach((bar, index) => {
            bar.className = 'password-strength-bar';
            
            if (strength.level === 'weak' && index === 0) {
                bar.classList.add('weak');
            } else if (strength.level === 'fair' && index <= 1) {
                bar.classList.add('fair');
            } else if (strength.level === 'good' && index <= 2) {
                bar.classList.add('good');
            } else if (strength.level === 'strong') {
                bar.classList.add('strong');
            }
        });
        
        if (text) {
            text.textContent = strength.label;
            text.className = `password-strength-text text-${strength.level === 'weak' ? 'danger' : strength.level === 'fair' ? 'warning' : 'success'}`;
        }
    }
};

// ============================================
// TABLE FUNCTIONALITY
// ============================================

const TableManager = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    
    init(tableId, data, renderRow) {
        this.tableId = tableId;
        this.data = data;
        this.filteredData = [...data];
        this.renderRow = renderRow;
        this.totalItems = data.length;
        this.render();
    },
    
    render() {
        const table = $(`#${this.tableId}`);
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageData = this.filteredData.slice(start, end);
        
        tbody.innerHTML = pageData.map(this.renderRow).join('');
        
        this.updatePagination();
    },
    
    filter(filters) {
        this.filteredData = this.data.filter(item => {
            return Object.keys(filters).every(key => {
                if (!filters[key]) return true;
                return String(item[key]).toLowerCase().includes(String(filters[key]).toLowerCase());
            });
        });
        
        this.totalItems = this.filteredData.length;
        this.currentPage = 1;
        this.render();
    },
    
    search(query, searchFields) {
        if (!query) {
            this.filteredData = [...this.data];
        } else {
            const lowerQuery = query.toLowerCase();
            this.filteredData = this.data.filter(item => {
                return searchFields.some(field => {
                    return String(item[field]).toLowerCase().includes(lowerQuery);
                });
            });
        }
        
        this.totalItems = this.filteredData.length;
        this.currentPage = 1;
        this.render();
    },
    
    sort(field, direction = 'asc') {
        this.filteredData.sort((a, b) => {
            const aVal = a[field];
            const bVal = b[field];
            
            if (direction === 'asc') {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            } else {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            }
        });
        
        this.render();
    },
    
    goToPage(page) {
        const maxPage = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = Math.max(1, Math.min(page, maxPage));
        this.render();
    },
    
    updatePagination() {
        const pagination = $(`#${this.tableId}-pagination`);
        if (!pagination) return;
        
        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
        
        const infoEl = pagination.querySelector('.pagination-info');
        if (infoEl) {
            infoEl.textContent = `Showing ${start}-${end} of ${this.totalItems} entries`;
        }
        
        const controlsEl = pagination.querySelector('.pagination-controls');
        if (controlsEl) {
            let buttonsHtml = `
                <button class="pagination-btn" onclick="TableManager.goToPage(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15,18 9,12 15,6"></polyline></svg>
                </button>
            `;
            
            for (let i = 1; i <= Math.min(5, totalPages); i++) {
                let pageNum = i;
                if (totalPages > 5) {
                    if (this.currentPage <= 3) {
                        pageNum = i;
                    } else if (this.currentPage >= totalPages - 2) {
                        pageNum = totalPages - 5 + i;
                    } else {
                        pageNum = this.currentPage - 3 + i;
                    }
                }
                
                buttonsHtml += `
                    <button class="pagination-btn ${pageNum === this.currentPage ? 'active' : ''}" 
                            onclick="TableManager.goToPage(${pageNum})">${pageNum}</button>
                `;
            }
            
            buttonsHtml += `
                <button class="pagination-btn" onclick="TableManager.goToPage(${this.currentPage + 1})" ${this.currentPage === totalPages ? 'disabled' : ''}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"></polyline></svg>
                </button>
            `;
            
            controlsEl.innerHTML = buttonsHtml;
        }
    }
};

// ============================================
// PAGE-SPECIFIC INITIALIZERS
// ============================================

// Login Page
function initLoginPage() {
    const form = $('#login-form');
    if (!form) return;
    
    // Password visibility toggle
    const togglePassword = $('#toggle-password');
    const passwordInput = $('#password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            togglePassword.innerHTML = type === 'password' 
                ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
                : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
        });
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const role = $('#role').value;
        const username = $('#username').value;
        const password = $('#password').value;
        
        if (!role || !username || !password) {
            UI.showToast('error', 'Validation Error', 'Please fill in all fields');
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Signing in...';
        
        const result = await Auth.login(role, username, password);
        
        if (result.success) {
            UI.showToast('success', 'Welcome!', `Logged in as ${result.user.role}`);
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            UI.showToast('error', 'Login Failed', result.error || 'Invalid credentials');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Sign In';
        }
    });
}

// Register Page
function initRegisterPage() {
    const form = $('#register-form');
    if (!form) return;
    
    // Initialize password strength indicator
    PasswordStrength.init('password', 'password-strength');
    
    // Password visibility toggles
    ['password', 'confirm-password'].forEach(id => {
        const toggle = $(`#toggle-${id}`);
        const input = $(`#${id}`);
        
        if (toggle && input) {
            toggle.addEventListener('click', () => {
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
            });
        }
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const { isValid } = FormValidator.validate(form);
        
        if (!isValid) {
            UI.showToast('error', 'Validation Error', 'Please fix the errors in the form');
            return;
        }
        
        const termsChecked = $('#terms').checked;
        if (!termsChecked) {
            UI.showToast('error', 'Terms Required', 'Please accept the terms and conditions');
            return;
        }
        
        const userData = {
            organizationName: $('#organization-name').value,
            name: $('#name').value,
            email: $('#email').value,
            mobile: $('#mobile').value,
            password: $('#password').value,
            role: $('#role').value
        };
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Creating account...';
        
        const result = await Auth.register(userData);
        
        if (result.success) {
            UI.showToast('success', 'Account Created', 'Please login with your credentials');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            UI.showToast('error', 'Registration Failed', result.error || 'Could not create account');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Create Account';
        }
    });
}

// Dashboard Page
function initDashboardPage() {
    // Check authentication
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update user info in navbar
    const user = Auth.getUser();
    const userName = $('#user-name');
    const userRole = $('#user-role');
    const userAvatar = $('#user-avatar');
    
    if (userName) userName.textContent = user.name;
    if (userRole) userRole.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    if (userAvatar) userAvatar.textContent = user.avatar;
    
    // Initialize UI components
    UI.initSidebar();
    UI.initDropdowns();
    UI.initNotifications();
    
    // Load dashboard data (placeholder)
    loadDashboardData();
}

async function loadDashboardData() {
    // Placeholder: Load real data from API
    console.log('Loading dashboard data...');
    
    // Mock data would be populated here
    UI.updateNotificationBadge(5);
}

// Inventory Page
function initInventoryPage() {
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    UI.initSidebar();
    UI.initDropdowns();
    UI.initNotifications();
    
    // Check if user can add inventory
    const addBtn = $('#add-inventory-btn');
    if (addBtn && !Auth.isAdmin()) {
        addBtn.style.display = 'none';
    }
    
    // Initialize filters
    initInventoryFilters();
    
    // Initialize modals
    initInventoryModals();
}

function initInventoryFilters() {
    const searchInput = $('#inventory-search');
    const bloodGroupSelect = $('#filter-blood-group');
    const componentSelect = $('#filter-component');
    const districtSelect = $('#filter-district');
    
    const applyFilters = debounce(() => {
        const filters = {
            search: searchInput?.value || '',
            bloodGroup: bloodGroupSelect?.value || '',
            component: componentSelect?.value || '',
            district: districtSelect?.value || ''
        };
        
        console.log('Applying filters:', filters);
        // TableManager.filter(filters);
    }, 300);
    
    [searchInput, bloodGroupSelect, componentSelect, districtSelect].forEach(el => {
        if (el) el.addEventListener('change', applyFilters);
    });
    
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
}

function initInventoryModals() {
    // Add Inventory Modal
    const addBtn = $('#add-inventory-btn');
    const addModal = $('#add-inventory-modal');
    
    if (addBtn && addModal) {
        addBtn.addEventListener('click', () => UI.openModal('add-inventory-modal'));
    }
    
    // Update Inventory Modal
    const updateModal = $('#update-inventory-modal');
    
    // Modal close buttons
    $$('.modal-close, [data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => UI.closeAllModals());
    });
    
    // Close on overlay click
    $$('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) UI.closeAllModals();
        });
    });
    
    // Form submissions
    const addForm = $('#add-inventory-form');
    if (addForm) {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
                bloodBankName: $('#add-blood-bank').value,
                bloodGroup: $('#add-blood-group').value,
                componentType: $('#add-component').value,
                bloodUnitId: $('#add-unit-id').value,
                units: $('#add-units').value,
                district: $('#add-district').value,
                receivedDate: $('#add-received-date').value,
                expiryDate: $('#add-expiry-date').value
            };
            
            console.log('Adding inventory:', data);
            
            UI.showToast('success', 'Inventory Added', 'Blood unit has been added successfully');
            UI.closeAllModals();
            addForm.reset();
        });
    }
    
    const updateForm = $('#update-inventory-form');
    if (updateForm) {
        updateForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
                bloodBankName: $('#update-blood-bank').value,
                bloodGroup: $('#update-blood-group').value,
                componentType: $('#update-component').value,
                reservedUnits: $('#update-reserved-units').value
            };
            
            console.log('Updating inventory:', data);
            
            UI.showToast('success', 'Inventory Updated', 'Blood unit has been updated successfully');
            UI.closeAllModals();
        });
    }
}

// Requests Page
function initRequestsPage() {
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    UI.initSidebar();
    UI.initDropdowns();
    UI.initNotifications();
    
    // Initialize request modal
    const newRequestBtn = $('#new-request-btn');
    if (newRequestBtn) {
        newRequestBtn.addEventListener('click', () => UI.openModal('new-request-modal'));
    }
    
    // Modal close handlers
    $$('.modal-close, [data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => UI.closeAllModals());
    });
    
    $$('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) UI.closeAllModals();
        });
    });
    
    // Request form
    const requestForm = $('#new-request-form');
    if (requestForm) {
        requestForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
                hospitalName: $('#request-hospital').value,
                bloodGroup: $('#request-blood-group').value,
                componentType: $('#request-component').value,
                units: $('#request-units').value
            };
            
            console.log('Creating request:', data);
            
            UI.showToast('success', 'Request Sent', 'Your blood request has been submitted');
            UI.closeAllModals();
            requestForm.reset();
        });
    }
}

// Request action handlers
function approveRequest(requestId) {
    console.log('Approving request:', requestId);
    
    // Update UI
    const row = document.querySelector(`tr[data-request-id="${requestId}"]`);
    if (row) {
        const statusCell = row.querySelector('.status-tag');
        if (statusCell) {
            statusCell.className = 'status-tag active';
            statusCell.textContent = 'Approved';
        }
    }
    
    UI.showToast('success', 'Request Approved', `Request #${requestId} has been approved`);
}

function rejectRequest(requestId) {
    console.log('Rejecting request:', requestId);
    
    // Update UI
    const row = document.querySelector(`tr[data-request-id="${requestId}"]`);
    if (row) {
        const statusCell = row.querySelector('.status-tag');
        if (statusCell) {
            statusCell.className = 'status-tag critical';
            statusCell.textContent = 'Rejected';
        }
    }
    
    UI.showToast('warning', 'Request Rejected', `Request #${requestId} has been rejected`);
}

// Reservations Page
function initReservationsPage() {
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    UI.initSidebar();
    UI.initDropdowns();
    UI.initNotifications();
}

function releaseReservation(reservationId) {
    console.log('Releasing reservation:', reservationId);
    
    // Update UI
    const row = document.querySelector(`tr[data-reservation-id="${reservationId}"]`);
    if (row) {
        row.style.opacity = '0.5';
        setTimeout(() => row.remove(), 500);
    }
    
    UI.showToast('success', 'Reservation Released', 'Blood units have been returned to available inventory');
}

// Alerts Page
function initAlertsPage() {
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    UI.initSidebar();
    UI.initDropdowns();
    UI.initNotifications();
}

function markAlertRead(alertId) {
    console.log('Marking alert as read:', alertId);
    
    const row = document.querySelector(`tr[data-alert-id="${alertId}"]`);
    if (row) {
        row.classList.remove('unread');
        const statusCell = row.querySelector('.status-tag');
        if (statusCell) {
            statusCell.className = 'status-tag inactive';
            statusCell.textContent = 'Read';
        }
    }
    
    UI.showToast('info', 'Alert Marked', 'Alert has been marked as read');
}

function acknowledgeAlert(alertId) {
    console.log('Acknowledging alert:', alertId);
    
    const row = document.querySelector(`tr[data-alert-id="${alertId}"]`);
    if (row) {
        const statusCell = row.querySelector('.status-tag');
        if (statusCell) {
            statusCell.className = 'status-tag active';
            statusCell.textContent = 'Acknowledged';
        }
    }
    
    UI.showToast('success', 'Alert Acknowledged', 'Alert has been acknowledged');
}

function viewAlertDetails(alertId) {
    console.log('Viewing alert details:', alertId);
    UI.showToast('info', 'Alert Details', 'Opening alert details...');
}

// Reports Page
function initReportsPage() {
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    UI.initSidebar();
    UI.initDropdowns();
    UI.initNotifications();
}

// ============================================
// GLOBAL INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize authentication state
    Auth.init();
    
    // Determine current page and initialize
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    
    switch (page) {
        case 'index.html':
        case '':
            // Landing page - no special init needed
            break;
        case 'login.html':
            initLoginPage();
            break;
        case 'register.html':
            initRegisterPage();
            break;
        case 'dashboard.html':
            initDashboardPage();
            break;
        case 'inventory.html':
            initInventoryPage();
            break;
        case 'requests.html':
            initRequestsPage();
            break;
        case 'reservations.html':
            initReservationsPage();
            break;
        case 'alerts.html':
            initAlertsPage();
            break;
        case 'reports.html':
            initReportsPage();
            break;
    }
    
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape to close modals
        if (e.key === 'Escape') {
            UI.closeAllModals();
        }
    });
});

// Expose necessary functions globally
window.UI = UI;
window.Auth = Auth;
window.TableManager = TableManager;
window.approveRequest = approveRequest;
window.rejectRequest = rejectRequest;
window.releaseReservation = releaseReservation;
window.markAlertRead = markAlertRead;
window.acknowledgeAlert = acknowledgeAlert;
window.viewAlertDetails = viewAlertDetails;
