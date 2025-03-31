// Initial Data
let tickets = [
    {
        id: "TKT-001",
        customer: "John Smith",
        issue: "Login issues after password reset",
        description: "Unable to login after resetting password",
        priority: "High",
        status: "Open",
        date: "2025-03-22"
    },
    {
        id: "TKT-002",
        customer: "Sarah Johnson",
        issue: "Cannot access billing information",
        description: "Billing section shows error message",
        priority: "Medium",
        status: "In Progress",
        date: "2025-03-21"
    },
    {
        id: "TKT-003",
        customer: "Michael Brown",
        issue: "Feature request: Export data to CSV",
        description: "Need ability to export reports to CSV format",
        priority: "Low",
        status: "Open",
        date: "2025-03-20"
    }
];

let expenses = [
    {
        id: "EXP-001",
        description: "Office supplies",
        category: "Office",
        amount: 245.50,
        date: "2025-03-15",
        status: "Approved",
        receipt: true
    },
    {
        id: "EXP-002",
        description: "Team lunch",
        category: "Meals",
        amount: 187.25,
        date: "2025-03-14",
        status: "Pending",
        receipt: true
    },
    {
        id: "EXP-003",
        description: "Software subscription",
        category: "Software",
        amount: 99.99,
        date: "2025-03-12",
        status: "Approved",
        receipt: true
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default for ticket and expense date fields
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('ticketDate').value = today;
    document.getElementById('expenseDate').value = today;
    
    renderTickets();
    renderExpenses();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Navigation Tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.section');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding section
            const tabId = tab.getAttribute('data-tab');
            sections.forEach(section => {
                section.classList.add('hidden');
                if (section.id === tabId + '-section') {
                    section.classList.remove('hidden');
                }
            });
        });
    });

    // Modal Open Buttons
    const createTicketBtn = document.getElementById('createTicketBtn');
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    
    createTicketBtn.addEventListener('click', () => {
        document.getElementById('createTicketModal').classList.add('show');
        // Set focus to first input
        document.getElementById('customer').focus();
    });
    
    addExpenseBtn.addEventListener('click', () => {
        document.getElementById('addExpenseModal').classList.add('show');
        
        // Set current date as default for expense date
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expenseDate').value = today;
        
        // Set focus to first input
        document.getElementById('expenseDescription').focus();
    });

    // Modal Close Buttons
    document.getElementById('closeTicketModal').addEventListener('click', () => {
        document.getElementById('createTicketModal').classList.remove('show');
    });
    
    document.getElementById('closeExpenseModal').addEventListener('click', () => {
        document.getElementById('addExpenseModal').classList.remove('show');
    });
    
    document.getElementById('cancelTicketBtn').addEventListener('click', () => {
        document.getElementById('createTicketModal').classList.remove('show');
    });
    
    document.getElementById('cancelExpenseBtn').addEventListener('click', () => {
        document.getElementById('addExpenseModal').classList.remove('show');
    });

    // Close modal when clicking on overlay
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.parentElement.classList.remove('show');
        });
    });

    // Form Submissions
    const submitTicketBtn = document.getElementById('submitTicketBtn');
    const submitExpenseBtn = document.getElementById('submitExpenseBtn');
    
    submitTicketBtn.addEventListener('click', createTicket);
    submitExpenseBtn.addEventListener('click', addExpense);

    // Search Functionality
    const ticketSearch = document.getElementById('ticketSearch');
    const expenseSearch = document.getElementById('expenseSearch');
    
    ticketSearch.addEventListener('input', () => {
        renderTickets();
    });

    expenseSearch.addEventListener('input', () => {
        renderExpenses();
    });

    // Sort Functionality
    const ticketSort = document.getElementById('ticketSort');
    const expenseSort = document.getElementById('expenseSort');
    
    ticketSort.addEventListener('change', () => {
        renderTickets();
    });

    expenseSort.addEventListener('change', () => {
        renderExpenses();
    });

    // Filter Dropdowns
    const ticketFilterBtn = document.getElementById('ticketFilterBtn');
    const expenseFilterBtn = document.getElementById('expenseFilterBtn');
    
    ticketFilterBtn.addEventListener('click', () => {
        ticketFilterBtn.parentElement.classList.toggle('show');
        expenseFilterBtn.parentElement.classList.remove('show');
    });

    expenseFilterBtn.addEventListener('click', () => {
        expenseFilterBtn.parentElement.classList.toggle('show');
        ticketFilterBtn.parentElement.classList.remove('show');
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filter-dropdown') && !e.target.closest('#ticketFilterBtn')) {
            ticketFilterBtn.parentElement.classList.remove('show');
        }
        if (!e.target.closest('.filter-dropdown') && !e.target.closest('#expenseFilterBtn')) {
            expenseFilterBtn.parentElement.classList.remove('show');
        }
    });

    // Apply Filters
    const applyTicketFilters = document.getElementById('applyTicketFilters');
    const applyExpenseFilters = document.getElementById('applyExpenseFilters');
    
    applyTicketFilters.addEventListener('click', () => {
        renderTickets();
        ticketFilterBtn.parentElement.classList.remove('show');
    });

    applyExpenseFilters.addEventListener('click', () => {
        renderExpenses();
        expenseFilterBtn.parentElement.classList.remove('show');
    });

    // Reset Filters
    const resetTicketFilters = document.getElementById('resetTicketFilters');
    const resetExpenseFilters = document.getElementById('resetExpenseFilters');
    
    resetTicketFilters.addEventListener('click', () => {
        document.getElementById('ticketStatusFilter').value = 'all';
        document.getElementById('ticketPriorityFilter').value = 'all';
        renderTickets();
        ticketFilterBtn.parentElement.classList.remove('show');
    });

    resetExpenseFilters.addEventListener('click', () => {
        document.getElementById('expenseStatusFilter').value = 'all';
        document.getElementById('expenseCategoryFilter').value = 'all';
        renderExpenses();
        expenseFilterBtn.parentElement.classList.remove('show');
    });
}

// Create Ticket Function
function createTicket() {
    const form = document.getElementById('createTicketForm');
    if (form.checkValidity()) {
        const customer = document.getElementById('customer').value;
        const issue = document.getElementById('issue').value;
        const priority = document.getElementById('priority').value;
        const status = document.getElementById('status').value;
        const ticketDate = document.getElementById('ticketDate').value;
        const description = document.getElementById('description').value;
        
        // Format date for display
        const dateObj = new Date(ticketDate);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Generate ticket ID
        const ticketId = `TKT-${String(tickets.length + 1).padStart(3, '0')}`;
        
        // Create new ticket object
        const newTicket = {
            id: ticketId,
            customer,
            issue,
            description,
            priority,
            status,
            date: ticketDate,
            formattedDate: formattedDate
        };
        
        // Add to tickets array
        tickets.unshift(newTicket);
        
        // Render tickets
        renderTickets();
        
        // Close modal
        document.getElementById('createTicketModal').classList.remove('show');
        
        // Show notification
        showNotification('Ticket created successfully!');
        
        // Reset form
        form.reset();
        
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('ticketDate').value = today;
    } else {
        form.reportValidity();
    }
}

// Add Expense Function
function addExpense() {
    const form = document.getElementById('addExpenseForm');
    if (form.checkValidity()) {
        const description = document.getElementById('expenseDescription').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const dateInput = document.getElementById('expenseDate').value;
        const status = document.getElementById('expenseStatus').value;
        const notes = document.getElementById('notes').value;
        const receipt = document.getElementById('receipt').files.length > 0;
        
        // Format date for display
        const dateObj = new Date(dateInput);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Generate expense ID
        const expenseId = `EXP-${String(expenses.length + 1).padStart(3, '0')}`;
        
        // Create new expense object
        const newExpense = {
            id: expenseId,
            description,
            category,
            amount,
            date: dateInput,
            formattedDate: formattedDate,
            status,
            receipt,
            notes
        };
        
        // Add to expenses array
        expenses.unshift(newExpense);
        
        // Render expenses
        renderExpenses();
        
        // Close modal
        document.getElementById('addExpenseModal').classList.remove('show');
        
        // Show notification
        showNotification('Expense added successfully!');
        
        // Reset form
        form.reset();
        
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expenseDate').value = today;
    } else {
        form.reportValidity();
    }
}

// Render Tickets Function
function renderTickets() {
    // Get search term
    const searchTerm = document.getElementById('ticketSearch').value.toLowerCase();
    
    // Get filters
    const statusFilter = document.getElementById('ticketStatusFilter').value;
    const priorityFilter = document.getElementById('ticketPriorityFilter').value;
    
    // Get sort option
    const sortOption = document.getElementById('ticketSort').value;
    
    // Filter tickets
    let filteredTickets = tickets.filter(ticket => {
        // Search filter
        const matchesSearch = 
            ticket.id.toLowerCase().includes(searchTerm) ||
            ticket.customer.toLowerCase().includes(searchTerm) ||
            ticket.issue.toLowerCase().includes(searchTerm);
        
        // Status filter
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        
        // Priority filter
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
        
        return matchesSearch && matchesStatus && matchesPriority;
    });
    
    // Sort tickets
    if (sortOption === 'newest') {
        // Already sorted by newest (assuming the newest tickets are at the beginning of the array)
    } else if (sortOption === 'oldest') {
        filteredTickets.reverse();
    } else if (sortOption === 'priority') {
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        filteredTickets.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }
    
    // Clear table
    const ticketsTableBody = document.getElementById('ticketsTableBody');
    ticketsTableBody.innerHTML = '';
    
    // Add tickets to table
    if (filteredTickets.length === 0) {
        ticketsTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">No tickets found</td>
            </tr>
        `;
    } else {
        filteredTickets.forEach(ticket => {
            const row = document.createElement('tr');
            
            // Determine badge classes
            let priorityBadgeClass = 'badge-success';
            if (ticket.priority === 'High') {
                priorityBadgeClass = 'badge-danger';
            } else if (ticket.priority === 'Medium') {
                priorityBadgeClass = 'badge-warning';
            }
            
            let statusBadgeClass = 'badge-primary';
            if (ticket.status === 'Closed') {
                statusBadgeClass = 'badge-success';
            } else if (ticket.status === 'In Progress') {
                statusBadgeClass = 'badge-warning';
            }
            
            // Format date for display if not already formatted
            const displayDate = ticket.formattedDate || new Date(ticket.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            row.innerHTML = `
                <td>${ticket.id}</td>
                <td>${ticket.customer}</td>
                <td>${ticket.issue}</td>
                <td><span class="badge ${priorityBadgeClass}">${ticket.priority}</span></td>
                <td><span class="badge ${statusBadgeClass}">${ticket.status}</span></td>
                <td>${displayDate}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="viewTicket('${ticket.id}')">View</button>
                </td>
            `;
            
            ticketsTableBody.appendChild(row);
        });
    }
}

// Render Expenses Function
function renderExpenses() {
    // Get search term
    const searchTerm = document.getElementById('expenseSearch').value.toLowerCase();
    
    // Get filters
    const statusFilter = document.getElementById('expenseStatusFilter').value;
    const categoryFilter = document.getElementById('expenseCategoryFilter').value;
    
    // Get sort option
    const sortOption = document.getElementById('expenseSort').value;
    
    // Filter expenses
    let filteredExpenses = expenses.filter(expense => {
        const matchesSearch = 
            expense.id.toLowerCase().includes(searchTerm) ||
            expense.description.toLowerCase().includes(searchTerm) ||
            expense.category.toLowerCase().includes(searchTerm);
        
        const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
        
        return matchesSearch && matchesStatus && matchesCategory;
    });
    
    // Sort expenses
    if (sortOption === 'newest') {
        // Already sorted by newest
    } else if (sortOption === 'oldest') {
        filteredExpenses.reverse();
    } else if (sortOption === 'amount-high') {
        filteredExpenses.sort((a, b) => b.amount - a.amount);
    } else if (sortOption === 'amount-low') {
        filteredExpenses.sort((a, b) => a.amount - b.amount);
    }
    
    // Clear table
    const expensesTableBody = document.getElementById('expensesTableBody');
    expensesTableBody.innerHTML = '';
    
    // Add expenses to table
    if (filteredExpenses.length === 0) {
        expensesTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem;">No expenses found</td>
            </tr>
        `;
    } else {
        filteredExpenses.forEach(expense => {
            const row = document.createElement('tr');
            
            // Determine badge class
            let statusBadgeClass = 'badge-primary';
            if (expense.status === 'Approved') {
                statusBadgeClass = 'badge-success';
            } else if (expense.status === 'Rejected') {
                statusBadgeClass = 'badge-danger';
            }
            
            // Format date for display
            const displayDate = expense.formattedDate || new Date(expense.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            // Format amount as INR currency
            const formattedAmount = new Intl.NumberFormat('en-IN', { 
                style: 'currency', 
                currency: 'INR',
                minimumFractionDigits: 2
            }).format(expense.amount);
            
            row.innerHTML = `
                <td>
                    <div>${expense.description}</div>
                    <div class="text-sm text-muted">${expense.id}</div>
                </td>
                <td>${expense.category}</td>
                <td class="font-medium">${formattedAmount}</td>
                <td>${displayDate}</td>
                <td><span class="badge ${statusBadgeClass}">${expense.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="viewExpense('${expense.id}')">View</button>
                </td>
            `;
            
            expensesTableBody.appendChild(row);
        });
    }
}



// View Ticket Function
function viewTicket(id) {
    const ticket = tickets.find(t => t.id === id);
    alert(`Viewing ticket: ${ticket.id}\nCustomer: ${ticket.customer}\nIssue: ${ticket.issue}\nPriority: ${ticket.priority}\nStatus: ${ticket.status}\nDate: ${ticket.formattedDate || ticket.date}\nDescription: ${ticket.description}`);
}

// View Expense Function
function viewExpense(id) {
    const expense = expenses.find(e => e.id === id);
    alert(`Viewing expense: ${expense.id}\nDescription: ${expense.description}\nAmount: $${expense.amount.toFixed(2)}\nCategory: ${expense.category}\nStatus: ${expense.status}\nDate: ${expense.formattedDate || expense.date}\nNotes: ${expense.notes || 'None'}`);
}

// Show Notification Function
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Toggle dropdown function (for sidebar)
function toggleDropdown(event) {
    event.preventDefault();
    const submenu = document.getElementById('crmSubmenu');
    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
}

