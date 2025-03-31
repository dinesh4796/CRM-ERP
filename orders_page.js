// Sample data (this would normally come from the quotation form or an API)
// This simulates data coming from the previous page (Quotation Form)
let orders = [
    {
        id: "ORD001",
        customerName: "John Smith",
        email: "john.smith@example.com",
        phone: "555-1234",
        product: "Product A",
        quantity: 5,
        price: 499.99,
        status: "pending"
    },
    {
        id: "ORD002",
        customerName: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "555-5678",
        product: "Product B",
        quantity: 2,
        price: 199.50,
        status: "approved"
    },
    {
        id: "ORD003",
        customerName: "Michael Brown",
        email: "m.brown@example.com",
        phone: "555-9012",
        product: "Product C",
        quantity: 1,
        price: 999.00,
        status: "rejected"
    },
    {
        id: "ORD004",
        customerName: "Emily Davis",
        email: "emily.d@example.com",
        phone: "555-3456",
        product: "Product A",
        quantity: 3,
        price: 299.97,
        status: "pending"
    }
];

// DOM elements
const ordersTable = document.getElementById('orders-table');
const ordersData = document.getElementById('orders-data');
const noDataMessage = document.getElementById('no-data-message');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const statusFilter = document.getElementById('status-filter');
const dateFilter = document.getElementById('date-filter');
const filterBtn = document.getElementById('filter-btn');
const resetBtn = document.getElementById('reset-btn');
const approveBtn = document.getElementById('approve-btn');
const rejectBtn = document.getElementById('reject-btn');
const modifyBtn = document.getElementById('modify-btn');
const modifyModal = document.getElementById('modify-modal');
const closeModal = document.querySelector('.close');
const saveChangesBtn = document.getElementById('save-changes');
const cancelChangesBtn = document.getElementById('cancel-changes');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderOrdersTable(orders);
    setupEventListeners();
});

// Render orders table
function renderOrdersTable(data) {
    // Clear existing table data
    ordersData.innerHTML = '';
    
    if (data.length === 0) {
        // Show no data message
        noDataMessage.classList.remove('hidden');
        ordersTable.classList.add('hidden');
    } else {
        // Hide no data message and show table
        noDataMessage.classList.add('hidden');
        ordersTable.classList.remove('hidden');
        
        // Generate table rows
        data.forEach(order => {
            const row = document.createElement('tr');
            row.dataset.id = order.id;
            
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.email}</td>
                <td>${order.phone}</td>
                <td>${order.product}</td>
                <td>${order.quantity}</td>
                <td>$${order.price.toFixed(2)}</td>
                <td class="status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</td>
                <td>
                    <div class="row-actions">
                        <button class="view-btn" data-id="${order.id}">Approve</button>
                        <button class="edit-btn" data-id="${order.id}">Modify</button>
                        <button class="delete-btn" data-id="${order.id}">Delete</button>
                    </div>
                </td>
            `;
            
            ordersData.appendChild(row);
        });
    }
}

// Set up event listeners
function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', function() {
        applyFilters();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
    
    // Filter buttons
    filterBtn.addEventListener('click', function() {
        applyFilters();
    });
    
    resetBtn.addEventListener('click', function() {
        searchInput.value = '';
        statusFilter.value = 'all';
        dateFilter.value = 'all';
        renderOrdersTable(orders);
    });
    
    // Action buttons
    if (approveBtn) {
        approveBtn.addEventListener('click', function() {
            updateAllOrdersStatus('approved');
        });
    }
    
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            updateAllOrdersStatus('rejected');
        });
    }
    
    if (modifyBtn) {
        modifyBtn.addEventListener('click', function() {
            alert('Please use the Modify button in the Actions column to modify a specific order.');
        });
    }
    
    // Row actions event delegation
    ordersData.addEventListener('click', function(e) {
        const target = e.target;
        
        if (target.classList.contains('view-btn')) {
            const orderId = target.dataset.id;
            approveOrder(orderId);
        } else if (target.classList.contains('edit-btn')) {
            const orderId = target.dataset.id;
            openModifyModal(orderId);
        } else if (target.classList.contains('delete-btn')) {
            const orderId = target.dataset.id;
            if (confirm(`Are you sure you want to delete Order ${orderId}?`)) {
                deleteOrder(orderId);
            }
        }
    });
    
    // Modal events
    closeModal.addEventListener('click', closeModifyModal);
    cancelChangesBtn.addEventListener('click', closeModifyModal);
    
    saveChangesBtn.addEventListener('click', function() {
        saveModifiedOrder();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modifyModal) {
            closeModifyModal();
        }
    });
}

// Apply filters to the orders
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const statusValue = statusFilter.value;
    const dateValue = dateFilter.value;
    
    let filteredOrders = [...orders];
    
    // Apply search filter
    if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => 
            order.id.toLowerCase().includes(searchTerm) ||
            order.customerName.toLowerCase().includes(searchTerm) ||
            order.email.toLowerCase().includes(searchTerm) ||
            order.product.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply status filter
    if (statusValue !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusValue);
    }
    
    // Apply date filter (in a real application, you would have date fields)
    // This is just a placeholder for demonstration
    if (dateValue !== 'all') {
        // In a real application, filter by date
        // For now, we're just leaving it as is
    }
    
    renderOrdersTable(filteredOrders);
}

// Approve an order and redirect to another page
function approveOrder(orderId) {
    // Find and update the order status to approved
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
        // Update the order status
        orders[orderIndex].status = 'approved';
        
        // Re-render table to show the status change
        renderOrdersTable(orders);
        
        // Show a confirmation message
        alert(`Order ${orderId} has been approved!`);
        
        // Redirect to another page after a brief delay to allow the user to see the status change
        setTimeout(function() {
            window.location.href = 'approved-orders.html';
        }, 1000);
    }
}

// Update all currently displayed orders status
function updateAllOrdersStatus(newStatus) {
    // Get all currently displayed order IDs
    const visibleRows = document.querySelectorAll('#orders-data tr');
    const visibleOrderIds = Array.from(visibleRows).map(row => row.dataset.id);
    
    if (visibleOrderIds.length > 0) {
        // Update orders array
        orders = orders.map(order => {
            if (visibleOrderIds.includes(order.id)) {
                return { ...order, status: newStatus };
            }
            return order;
        });
        
        // Re-render table
        renderOrdersTable(orders);
    }
}

// Delete an order
function deleteOrder(orderId) {
    // Remove the order from the orders array
    orders = orders.filter(order => order.id !== orderId);
    
    // Re-render the table to reflect the changes
    renderOrdersTable(orders);
    
    // Show a confirmation message
    alert(`Order ${orderId} has been deleted successfully.`);
}

// Open the modify modal
function openModifyModal(orderId) {
    const order = orders.find(order => order.id === orderId);
    
    if (order) {
        // Populate form fields
        document.getElementById('modal-order-id').value = order.id;
        document.getElementById('modal-customer').value = order.customerName;
        document.getElementById('modal-product').value = order.product;
        document.getElementById('modal-quantity').value = order.quantity;
        document.getElementById('modal-price').value = order.price.toFixed(2);
        
        // Show modal
        modifyModal.style.display = 'block';
    }
}

// Close the modify modal
function closeModifyModal() {
    modifyModal.style.display = 'none';
}

// Save modified order
function saveModifiedOrder() {
    const orderId = document.getElementById('modal-order-id').value;
    const customerName = document.getElementById('modal-customer').value;
    const product = document.getElementById('modal-product').value;
    const quantity = parseInt(document.getElementById('modal-quantity').value);
    const price = parseFloat(document.getElementById('modal-price').value);
    
    if (customerName && product && !isNaN(quantity) && !isNaN(price) && quantity > 0 && price >= 0) {
        // Find order index
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex !== -1) {
            // Update order
            orders[orderIndex] = {
                ...orders[orderIndex],
                customerName,
                product,
                quantity,
                price
            };
            
            // Re-render table and close modal
            renderOrdersTable(orders);
            closeModifyModal();
            
            // Show success message
            alert(`Order ${orderId} has been modified successfully.`);
        }
    } else {
        alert('Please fill all fields with valid values.');
    }
}