/**
 * ERP System - CRM Module
 * JavaScript for CRM functionality
 */

// Load the navigation menu
function loadNavigation() {
    const navContainer = document.getElementById('globalNavContainer');
    if (navContainer) {
        fetch('nav-menu.html')
            .then(response => response.text())
            .then(html => {
                navContainer.innerHTML = html;
                // Initialize navigation after it's loaded
                if (typeof initNavigation === 'function') {
                    initNavigation();
                }
            })
            .catch(error => {
                console.error('Error loading navigation:', error);
            });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Load navigation
    loadNavigation();
    
    // Load navigation script dynamically
    const navScript = document.createElement('script');
    navScript.src = 'nav-script.js';
    document.head.appendChild(navScript);
    
    // ======================================
    // GLOBAL VARIABLES
    // ======================================
    let sortDirection = {};
    let currentPage = 1;
    let itemsPerPage = 10;
    let totalLeads = document.querySelectorAll('#leadsTableBody tr').length;
    let totalCustomers = document.querySelectorAll('#customersTableBody tr').length;
    let filteredLeads = [];
    let filteredCustomers = [];
    let currentLeadId = null;
    let currentCustomerId = null;
    
    // ======================================
    // UTILITY FUNCTIONS
    // ======================================
    
    /**
     * Show a toast notification
     * @param {string} type - 'success', 'error', 'warning', 'info'
     * @param {string} title - Title of the notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds
     */
    function showToast(type, title, message, duration = 5000) {
        const toastContainer = document.getElementById("toastContainer");
        
        // Create toast element
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        
        // Set icon based on type
        let icon = "";
        switch (type) {
            case "success":
                icon = "check-circle";
                break;
            case "error":
                icon = "exclamation-circle";
                break;
            case "warning":
                icon = "exclamation-triangle";
                break;
            case "info":
                icon = "info-circle";
                break;
        }
        
        // Create toast content
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Add click event to close button
        const closeBtn = toast.querySelector(".toast-close");
        closeBtn.addEventListener("click", () => {
            toast.style.animation = "slideOutRight 0.3s forwards";
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        });
        
        // Auto remove after duration
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toast.style.animation = "slideOutRight 0.3s forwards";
                setTimeout(() => {
                    if (toastContainer.contains(toast)) {
                        toastContainer.removeChild(toast);
                    }
                }, 300);
            }
        }, duration);
    }
    
    /**
     * Format date to a readable format
     * @param {string} dateString - Date string to format
     * @returns {string} Formatted date
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    /**
     * Open a modal
     * @param {HTMLElement} modal - Modal element to open
     */
    function openModal(modal) {
        if (modal) {
            modal.classList.add("show");
            document.body.style.overflow = "hidden";
        }
    }
    
    /**
     * Close a modal
     * @param {HTMLElement} modal - Modal element to close
     */
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove("show");
            document.body.style.overflow = "";
        }
    }
    
    /**
     * Toggle dropdown visibility
     * @param {HTMLElement} dropdown - Dropdown element to toggle
     * @param {boolean} show - Whether to show or hide
     */
    function toggleDropdown(dropdown, show) {
        if (dropdown) {
            if (show) {
                dropdown.classList.add("show");
            } else {
                dropdown.classList.remove("show");
            }
        }
    }
    
    /**
     * Get initials from a name
     * @param {string} name - Full name
     * @returns {string} Initials (up to 2 characters)
     */
    function getInitials(name) {
        if (!name) return '??';
        
        const names = name.split(' ');
        if (names.length === 1) {
            return names[0].substring(0, 2).toUpperCase();
        }
        
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
    
    /**
     * Update pagination display and controls
     * @param {string} type - 'leads' or 'customers'
     * @param {string} viewType - 'table' or 'card'
     */
    function updatePagination(type = 'leads', viewType = 'table') {
        let totalItems, currentPageEl, totalPagesEl, prevBtn, nextBtn;
        
        if (type === 'leads') {
            totalItems = filteredLeads.length || totalLeads;
            if (viewType === 'table') {
                currentPageEl = document.getElementById('currentPage');
                totalPagesEl = document.getElementById('totalPages');
                prevBtn = document.getElementById('prevPage');
                nextBtn = document.getElementById('nextPage');
            } else {
                currentPageEl = document.getElementById('currentPageCard');
                totalPagesEl = document.getElementById('totalPagesCard');
                prevBtn = document.getElementById('prevPageCard');
                nextBtn = document.getElementById('nextPageCard');
            }
        } else if (type === 'customers') {
            totalItems = filteredCustomers.length || totalCustomers;
            currentPageEl = document.getElementById('currentPageCustomer');
            totalPagesEl = document.getElementById('totalPagesCustomer');
            prevBtn = document.getElementById('prevPageCustomer');
            nextBtn = document.getElementById('nextPageCustomer');
        }
        
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        if (currentPageEl) currentPageEl.textContent = currentPage;
        if (totalPagesEl) totalPagesEl.textContent = totalPages;
        
        if (prevBtn) prevBtn.disabled = currentPage <= 1;
        if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
    }
    
    /**
     * Apply sorting to a table
     * @param {string} tableId - ID of the table
     * @param {string} column - Column to sort by
     * @param {boolean} isAscending - Sort direction
     */
    function sortTable(tableId, column, isAscending) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        // Remove any existing sort indicators
        table.querySelectorAll('th.sortable').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
        });
        
        // Add sort indicator to current column
        const currentHeader = table.querySelector(`th[data-sort="${column}"]`);
        if (currentHeader) {
            currentHeader.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
        }
        
        // Sort rows
        rows.sort((a, b) => {
            let aVal, bVal;
            
            // Get cell index for the column
            const headers = Array.from(table.querySelectorAll('th'));
            const headerIndex = headers.findIndex(th => th.getAttribute('data-sort') === column);
            
            if (headerIndex !== -1) {
                // Get cell value
                aVal = a.cells[headerIndex].textContent.trim();
                bVal = b.cells[headerIndex].textContent.trim();
                
                // Handle date columns
                if (column === 'date') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }
                
                // Handle numeric columns
                if (column === 'value' || column === 'orders') {
                    aVal = parseFloat(aVal.replace(/[^0-9.-]+/g, ''));
                    bVal = parseFloat(bVal.replace(/[^0-9.-]+/g, ''));
                }
                
                // Handle status special case
                if (column === 'status') {
                    // Extract the status text from the span
                    aVal = a.cells[headerIndex].querySelector('.status-badge')?.textContent.trim();
                    bVal = b.cells[headerIndex].querySelector('.status-badge')?.textContent.trim();
                }
                
                // Compare values
                if (aVal < bVal) {
                    return isAscending ? -1 : 1;
                }
                if (aVal > bVal) {
                    return isAscending ? 1 : -1;
                }
                return 0;
            }
            
            return 0;
        });
        
        // Reorder rows in the table
        rows.forEach(row => {
            tbody.appendChild(row);
        });
    }
    
    /**
     * Filter leads based on selected criteria
     */
    function filterLeads() {
        const statusFilter = document.getElementById('statusFilter').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const sourceFilter = document.getElementById('sourceFilter').value;
        const assignedUserFilter = document.getElementById('assignedUserFilter').value;
        
        // Get all lead rows
        const leadRows = Array.from(document.querySelectorAll('#leadsTableBody tr'));
        
        filteredLeads = leadRows.filter(row => {
            let matchesStatus = true;
            let matchesDate = true;
            let matchesSource = true;
            let matchesAssignedUser = true;
            
            // Status filter
            if (statusFilter !== 'all') {
                const statusCell = row.querySelector('td:nth-child(8)');
                const statusBadge = statusCell.querySelector('.status-badge');
                const status = statusBadge ? statusBadge.textContent.trim().toLowerCase() : '';
                matchesStatus = status === statusFilter;
            }
            
            // Date filter
            if (startDate || endDate) {
                const dateCell = row.querySelector('td:nth-child(9)');
                const dateValue = dateCell ? dateCell.textContent.trim() : '';
                const rowDate = new Date(dateValue);
                
                if (startDate && endDate) {
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    matchesDate = rowDate >= start && rowDate <= end;
                } else if (startDate) {
                    const start = new Date(startDate);
                    matchesDate = rowDate >= start;
                } else if (endDate) {
                    const end = new Date(endDate);
                    matchesDate = rowDate <= end;
                }
            }
            
            // Source filter
            if (sourceFilter !== 'all') {
                const sourceCell = row.querySelector('td:nth-child(7)');
                const source = sourceCell ? sourceCell.textContent.trim().toLowerCase() : '';
                matchesSource = source === sourceFilter;
            }
            
            // Assigned User filter - would be implemented with real data
            if (assignedUserFilter !== 'all') {
                // In a real app, this would be based on actual assigned user data
                matchesAssignedUser = true; // Simplified for demo
            }
            
            return matchesStatus && matchesDate && matchesSource && matchesAssignedUser;
        });
        
        // Now update the table to show only filtered rows
        displayFilteredRows('leads');
        
        // Reset to first page
        currentPage = 1;
        updatePagination('leads', 'table');
        updatePagination('leads', 'card');
    }
    
    /**
     * Display filtered rows in the table
     * @param {string} type - 'leads' or 'customers'
     */
    function displayFilteredRows(type) {
        let tableBody, allRows, filteredRows;
        
        if (type === 'leads') {
            tableBody = document.getElementById('leadsTableBody');
            allRows = Array.from(tableBody.querySelectorAll('tr'));
            filteredRows = filteredLeads;
        } else if (type === 'customers') {
            tableBody = document.getElementById('customersTableBody');
            allRows = Array.from(tableBody.querySelectorAll('tr'));
            filteredRows = filteredCustomers;
        }
        
        if (!tableBody) return;
        
        if (filteredRows && filteredRows.length > 0) {
            // Hide all rows first
            allRows.forEach(row => {
                row.style.display = 'none';
            });
            
            // Show only filtered rows
            filteredRows.forEach(row => {
                row.style.display = '';
            });
        } else {
            // If no filters or all filters removed, show all rows
            allRows.forEach(row => {
                row.style.display = '';
            });
        }
        
        if (type === 'leads') {
            // Also update the card view
            updateCardView();
        }
    }
    
    /**
     * Update card view to match table filters
     */
    function updateCardView() {
        const cardGrid = document.getElementById('leadCardGrid');
        if (!cardGrid) return;
        
        const allCards = Array.from(cardGrid.querySelectorAll('.lead-card'));
        
        if (filteredLeads && filteredLeads.length > 0) {
            // Hide all cards first
            allCards.forEach(card => {
                card.style.display = 'none';
            });
            
            // Show only filtered cards
            filteredLeads.forEach(row => {
                const leadId = row.querySelector('td:nth-child(2)').textContent.trim();
                const card = cardGrid.querySelector(`.lead-card[data-id="${leadId}"]`);
                if (card) {
                    card.style.display = '';
                }
            });
        } else {
            // If no filters or all filters removed, show all cards
            allCards.forEach(card => {
                card.style.display = '';
            });
        }
    }
    
    /**
     * Search leads and customers based on input text
     * @param {string} searchText - Text to search for
     */
    function searchEntities(searchText) {
        if (!searchText) {
            // If search is empty, reset filters
            document.getElementById('resetFiltersBtn').click();
            return;
        }
        
        searchText = searchText.toLowerCase();
        
        // Get active tab
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        
        if (activeTab === 'leads') {
            // Search leads
            const leadRows = Array.from(document.querySelectorAll('#leadsTableBody tr'));
            
            filteredLeads = leadRows.filter(row => {
                // Search in all relevant cells
                const cells = Array.from(row.querySelectorAll('td')).slice(1, -1); // Skip checkbox and actions
                
                return cells.some(cell => {
                    const text = cell.textContent.toLowerCase();
                    return text.includes(searchText);
                });
            });
            
            // Display results
            displayFilteredRows('leads');
            
            // Reset to first page
            currentPage = 1;
            updatePagination('leads', 'table');
            updatePagination('leads', 'card');
        } else if (activeTab === 'customers') {
            // Search customers
            const customerRows = Array.from(document.querySelectorAll('#customersTableBody tr'));
            
            filteredCustomers = customerRows.filter(row => {
                // Search in all relevant cells
                const cells = Array.from(row.querySelectorAll('td')).slice(1, -1); // Skip checkbox and actions
                
                return cells.some(cell => {
                    const text = cell.textContent.toLowerCase();
                    return text.includes(searchText);
                });
            });
            
            // Display results
            displayFilteredRows('customers');
            
            // Reset to first page
            currentPage = 1;
            updatePagination('customers', 'table');
        }
    }
    
    /**
     * Create a new lead (simulated)
     * @param {Object} formData - Form data for the new lead
     */
    function createNewLead(formData) {
        // Generate a new ID based on the current highest ID
        const leadRows = document.querySelectorAll('#leadsTableBody tr');
        const lastLeadId = leadRows.length > 0
            ? leadRows[leadRows.length - 1].querySelector('td:nth-child(2)').textContent
            : 'LEAD-2023-000';
        
        const idNumber = parseInt(lastLeadId.split('-')[2]) + 1;
        const newId = `LEAD-2023-${String(idNumber).padStart(3, '0')}`;
        
        // Create name from first and last name
        const fullName = `${formData.firstName} ${formData.lastName}`;
        
        // Add new lead to the table
        const tableBody = document.getElementById('leadsTableBody');
        const newRow = document.createElement('tr');
        
        newRow.innerHTML = `
            <td class="checkbox-cell">
                <label class="checkbox">
                    <input type="checkbox" class="lead-checkbox" data-id="${newId}">
                    <span class="checkmark"></span>
                </label>
            </td>
            <td>${newId}</td>
            <td>${fullName}</td>
            <td>${formData.company}</td>
            <td>${formData.email}</td>
            <td>${formData.phone}</td>
            <td>${capitalizeFirstLetter(formData.source)}</td>
            <td><span class="status-badge ${formData.status}">${capitalizeFirstLetter(formData.status)}</span></td>
            <td>${new Date().toISOString().split('T')[0]}</td>
            <td class="actions-cell">
                <button class="btn-icon view-btn" data-id="${newId}" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon edit-btn" data-id="${newId}" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon convert-btn" data-id="${newId}" title="Convert to Customer">
                    <i class="fas fa-user-check"></i>
                </button>
                <button class="btn-icon delete-btn" data-id="${newId}" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(newRow);
        
        // Also add to card view
        const cardGrid = document.getElementById('leadCardGrid');
        const initials = getInitials(fullName);
        
        const newCard = document.createElement('div');
        newCard.className = 'lead-card';
        newCard.setAttribute('data-id', newId);
        
        newCard.innerHTML = `
            <div class="lead-card-header">
                <div class="lead-initials">${initials}</div>
                <div class="lead-info">
                    <h3>${fullName}</h3>
                    <p>${formData.company}</p>
                </div>
                <span class="status-badge ${formData.status}">${capitalizeFirstLetter(formData.status)}</span>
            </div>
            <div class="lead-card-body">
                <div class="lead-detail">
                    <i class="fas fa-envelope"></i>
                    <span>${formData.email}</span>
                </div>
                <div class="lead-detail">
                    <i class="fas fa-phone"></i>
                    <span>${formData.phone}</span>
                </div>
                <div class="lead-detail">
                    <i class="fas fa-globe"></i>
                    <span>${capitalizeFirstLetter(formData.source)}</span>
                </div>
                <div class="lead-detail">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(new Date())}</span>
                </div>
            </div>
            <div class="lead-card-footer">
                <button class="btn-icon view-btn" data-id="${newId}" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon edit-btn" data-id="${newId}" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon convert-btn" data-id="${newId}" title="Convert to Customer">
                    <i class="fas fa-user-check"></i>
                </button>
                <button class="btn-icon delete-btn" data-id="${newId}" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cardGrid.appendChild(newCard);
        
        // Update counter
        totalLeads++;
        updatePagination('leads', 'table');
        updatePagination('leads', 'card');
        
        // Add event listeners to the new elements
        attachEventListeners();
    }
    
    /**
     * Attach event listeners to dynamic elements
     */
    function attachEventListeners() {
        // View Lead buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            if (!btn.hasAttribute('data-event-attached')) {
                btn.setAttribute('data-event-attached', 'true');
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const id = this.getAttribute('data-id');
                    if (id) {
                        // In a real app, you would fetch the lead details here
                        console.log(`Viewing lead/customer: ${id}`);
                        showLeadDetails(id);
                    }
                });
            }
        });
        
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            if (!btn.hasAttribute('data-event-attached')) {
                btn.setAttribute('data-event-attached', 'true');
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const id = this.getAttribute('data-id');
                    if (id) {
                        // In a real app, you would fetch the lead details to edit
                        console.log(`Editing: ${id}`);
                        showToast('info', 'Edit Mode', `Opening edit form for ${id}`);
                    }
                });
            }
        });
        
        // Convert to Customer buttons
        document.querySelectorAll('.convert-btn').forEach(btn => {
            if (!btn.hasAttribute('data-event-attached')) {
                btn.setAttribute('data-event-attached', 'true');
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const id = this.getAttribute('data-id');
                    if (id) {
                        // In a real app, you would convert the lead to a customer
                        console.log(`Converting to customer: ${id}`);
                        showToast('success', 'Conversion Started', `Converting ${id} to customer`);
                    }
                });
            }
        });
        
        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            if (!btn.hasAttribute('data-event-attached')) {
                btn.setAttribute('data-event-attached', 'true');
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const id = this.getAttribute('data-id');
                    if (id) {
                        if (confirm(`Are you sure you want to delete ${id}?`)) {
                            // In a real app, you would send a delete request to the server
                            console.log(`Deleting: ${id}`);
                            
                            // Remove element from UI
                            const tableRow = document.querySelector(`tr .delete-btn[data-id="${id}"]`).closest('tr');
                            const card = document.querySelector(`.lead-card[data-id="${id}"]`);
                            
                            if (tableRow) tableRow.remove();
                            if (card) card.remove();
                            
                            showToast('success', 'Deleted', `Successfully deleted ${id}`);
                            
                            // Update counters
                            if (id.startsWith('LEAD')) {
                                totalLeads--;
                                updatePagination('leads', 'table');
                                updatePagination('leads', 'card');
                            } else if (id.startsWith('CUST')) {
                                totalCustomers--;
                                updatePagination('customers', 'table');
                            }
                        }
                    }
                });
            }
        });
    }
    
    /**
     * Show lead details in the view modal
     * @param {string} leadId - Lead ID to view
     */
    function showLeadDetails(leadId) {
        const viewLeadModal = document.getElementById('viewLeadModal');
        
        // In a real app, you would fetch the lead details from the server
        // For this demo, we'll find the row containing the lead ID
        let leadRow = null;
        const rows = document.querySelectorAll('#leadsTableBody tr');
        for (const row of rows) {
            if (row.cells[1].textContent.trim() === leadId) {
                leadRow = row;
                break;
            }
        }
        
        if (!leadRow) {
            showToast("error", "Not Found", `Lead with ID ${leadId} not found.`);
            return;
        }
        
        // Extract lead data from the row
        const name = leadRow.cells[2].textContent;
        const company = leadRow.cells[3].textContent;
        const email = leadRow.cells[4].textContent;
        const phone = leadRow.cells[5].textContent;
        const source = leadRow.cells[6].textContent;
        const status = leadRow.cells[7].querySelector('.status-badge').textContent;
        const createdDate = leadRow.cells[8].textContent;
        
        // Populate the modal
        document.getElementById('viewLeadName').textContent = name;
        document.getElementById('viewLeadCompany').textContent = company;
        document.getElementById('viewLeadId').textContent = leadId;
        document.getElementById('viewLeadEmail').textContent = email;
        document.getElementById('viewLeadPhone').textContent = phone;
        document.getElementById('viewLeadSource').textContent = source;
        document.getElementById('viewLeadCreated').textContent = formatDate(createdDate);
        
        // Set the status badge class
        const statusBadge = document.getElementById('viewLeadStatus');
        statusBadge.textContent = status;
        statusBadge.className = `status-badge ${status.toLowerCase()}`;
        
        // For demo purposes, we'll set some placeholder data for fields not in the table
        document.getElementById('viewLeadAddress').textContent = '123 Main St, Suite 500, Anytown, CA 90210';
        document.getElementById('viewLeadInterest').textContent = 'Medium';
        document.getElementById('viewLeadAssigned').textContent = 'John Doe';
        
        // Show the modal
        openModal(viewLeadModal);
    }
    
    /**
     * Capitalize the first letter of a string
     * @param {string} string - String to capitalize
     * @returns {string} Capitalized string
     */
    function capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    /**
     * Create a new customer (simulated)
     * @param {Object} formData - Form data for the new customer
     */
    function createNewCustomer(formData) {
        // Generate a new ID based on the current highest ID
        const customerRows = document.querySelectorAll('#customersTableBody tr');
        const lastCustomerId = customerRows.length > 0
            ? customerRows[customerRows.length - 1].querySelector('td:nth-child(2)').textContent
            : 'CUST-2023-000';
        
        const idNumber = parseInt(lastCustomerId.split('-')[2]) + 1;
        const newId = `CUST-2023-${String(idNumber).padStart(3, '0')}`;
        
        // Create name from first and last name
        const fullName = `${formData.firstName} ${formData.lastName}`;
        
        // Add new customer to the table
        const tableBody = document.getElementById('customersTableBody');
        const newRow = document.createElement('tr');
        
        newRow.innerHTML = `
            <td class="checkbox-cell">
                <label class="checkbox">
                    <input type="checkbox" class="customer-checkbox" data-id="${newId}">
                    <span class="checkmark"></span>
                </label>
            </td>
            <td>${newId}</td>
            <td>${fullName}</td>
            <td>${formData.company}</td>
            <td>${formData.email}</td>
            <td>${formData.phone}</td>
            <td><span class="status-badge active">Active</span></td>
            <td>0</td>
            <td>$0.00</td>
            <td class="actions-cell">
                <button class="btn-icon view-btn" data-id="${newId}" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon edit-btn" data-id="${newId}" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete-btn" data-id="${newId}" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(newRow);
        
        // Update counter
        totalCustomers++;
        updatePagination('customers', 'table');
        
        // Add event listeners to the new elements
        attachEventListeners();
    }

    // ======================================
    // EVENT LISTENERS
    // ======================================
    
    // Show loader
    const loader = document.getElementById("loader");
    loader.classList.add("show");
  
    // Simulate loading time
    setTimeout(() => {
        loader.classList.remove("show");
        showToast("success", "Welcome!", "Customer Relationship Management System loaded successfully.");
    }, 800);
  
    // Tab switching
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
  
    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const tabId = button.getAttribute("data-tab");
  
            // Remove active class from all buttons and contents
            tabButtons.forEach((btn) => btn.classList.remove("active"));
            tabContents.forEach((content) => content.classList.remove("active"));
  
            // Add active class to clicked button and corresponding content
            button.classList.add("active");
            document.getElementById(`${tabId}-tab`).classList.add("active");
        });
    });
  
    // Toggle view (Table/Card) for Leads
    const tableViewBtn = document.getElementById("tableViewBtn");
    const cardViewBtn = document.getElementById("cardViewBtn");
    const tableView = document.getElementById("tableView");
    const cardView = document.getElementById("cardView");
  
    if (tableViewBtn && cardViewBtn && tableView && cardView) {
        tableViewBtn.addEventListener("click", () => {
            tableView.classList.add("active");
            cardView.classList.remove("active");
            tableViewBtn.classList.add("active");
            cardViewBtn.classList.remove("active");
        });
      
        cardViewBtn.addEventListener("click", () => {
            cardView.classList.add("active");
            tableView.classList.remove("active");
            cardViewBtn.classList.add("active");
            tableViewBtn.classList.remove("active");
        });
    }
  
    // Toggle filters
    const toggleFiltersBtn = document.getElementById("toggleFilters");
    const filterBody = document.querySelector(".filter-body");
  
    if (toggleFiltersBtn && filterBody) {
        toggleFiltersBtn.addEventListener("click", () => {
            filterBody.classList.toggle("hidden");
            toggleFiltersBtn.querySelector("i").classList.toggle("fa-chevron-up");
            toggleFiltersBtn.querySelector("i").classList.toggle("fa-chevron-down");
        });
    }
  
    // Modal handling
    const newLeadBtn = document.getElementById("newLeadBtn");
    const leadModal = document.getElementById("leadModal");
    const closeLeadModal = document.getElementById("closeLeadModal");
    const cancelLead = document.getElementById("cancelLead");
  
    const newCustomerBtn = document.getElementById("newCustomerBtn");
    const customerModal = document.getElementById("customerModal");
    const closeCustomerModal = document.getElementById("closeCustomerModal");
    const cancelCustomer = document.getElementById("cancelCustomer");
  
    const viewLeadModal = document.getElementById("viewLeadModal");
    const closeViewLeadModal = document.getElementById("closeViewLeadModal");
    const backToLeadsBtn = document.getElementById("backToLeadsBtn");
  
    // Open lead modal
    if (newLeadBtn && leadModal) {
        newLeadBtn.addEventListener("click", () => {
            openModal(leadModal);
        });
    }
  
    // Open customer modal
    if (newCustomerBtn && customerModal) {
        newCustomerBtn.addEventListener("click", () => {
            openModal(customerModal);
        });
    }
  
    // Close lead modal
    if (closeLeadModal && leadModal) {
        closeLeadModal.addEventListener("click", () => {
            closeModal(leadModal);
        });
    }
  
    if (cancelLead && leadModal) {
        cancelLead.addEventListener("click", () => {
            closeModal(leadModal);
        });
    }
    
    // Close customer modal
    if (closeCustomerModal && customerModal) {
        closeCustomerModal.addEventListener("click", () => {
            closeModal(customerModal);
        });
    }
  
    if (cancelCustomer && customerModal) {
        cancelCustomer.addEventListener("click", () => {
            closeModal(customerModal);
        });
    }
  
    // Close view lead modal
    if (closeViewLeadModal && viewLeadModal) {
        closeViewLeadModal.addEventListener("click", () => {
            closeModal(viewLeadModal);
        });
    }
  
    if (backToLeadsBtn && viewLeadModal) {
        backToLeadsBtn.addEventListener("click", () => {
            closeModal(viewLeadModal);
        });
    }
  
    // Close modals when clicking outside
    window.addEventListener("click", (e) => {
        if (e.target === leadModal) {
            closeModal(leadModal);
        }
        if (e.target === customerModal) {
            closeModal(customerModal);
        }
        if (e.target === viewLeadModal) {
            closeModal(viewLeadModal);
        }
    });
  
    // Form tab switching
    const formTabs = document.querySelectorAll(".form-tab");
    const formTabContents = document.querySelectorAll(".form-tab-content");
  
    formTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const tabId = tab.getAttribute("data-tab");
  
            // Remove active class from all tabs and contents
            formTabs.forEach((t) => t.classList.remove("active"));
            formTabContents.forEach((content) => content.classList.remove("active"));
  
            // Add active class to clicked tab and corresponding content
            tab.classList.add("active");
            document.getElementById(`${tabId}-tab`).classList.add("active");
        });
    });
  
    // Detail tab switching
    const detailTabs = document.querySelectorAll(".detail-tab");
    const detailTabContents = document.querySelectorAll(".detail-tab-content");
  
    detailTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const tabId = tab.getAttribute("data-tab");
  
            // Remove active class from all tabs and contents
            detailTabs.forEach((t) => t.classList.remove("active"));
            detailTabContents.forEach((content) => content.classList.remove("active"));
  
            // Add active class to clicked tab and corresponding content
            tab.classList.add("active");
            document.getElementById(`${tabId}-tab`).classList.add("active");
        });
    });
  
    // Lead form validation and submission
    const leadForm = document.getElementById("leadForm");
    if (leadForm) {
        leadForm.addEventListener("submit", (e) => {
            e.preventDefault();
    
            // Reset error messages
            document.querySelectorAll(".form-error").forEach((el) => (el.textContent = ""));
    
            // Validate required fields
            let isValid = true;
    
            const firstName = document.getElementById("leadFirstName");
            if (!firstName.value) {
                document.getElementById("leadFirstNameError").textContent = "Please enter the first name";
                isValid = false;
            }
    
            const lastName = document.getElementById("leadLastName");
            if (!lastName.value) {
                document.getElementById("leadLastNameError").textContent = "Please enter the last name";
                isValid = false;
            }
    
            const company = document.getElementById("leadCompany");
            if (!company.value) {
                document.getElementById("leadCompanyError").textContent = "Please enter the company name";
                isValid = false;
            }
    
            const source = document.getElementById("leadSource");
            if (!source.value) {
                document.getElementById("leadSourceError").textContent = "Please select a lead source";
                isValid = false;
            }
    
            const email = document.getElementById("leadEmail");
            if (!email.value) {
                document.getElementById("leadEmailError").textContent = "Please enter an email address";
                isValid = false;
            } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
                document.getElementById("leadEmailError").textContent = "Please enter a valid email address";
                isValid = false;
            }
    
            const phone = document.getElementById("leadPhone");
            if (!phone.value) {
                document.getElementById("leadPhoneError").textContent = "Please enter a phone number";
                isValid = false;
            }
    
            if (!isValid) {
                // Show error toast
                showToast("error", "Validation Error", "Please fill in all required fields correctly.");
                return;
            }
    
            // Collect form data
            const formData = {
                firstName: firstName.value,
                lastName: lastName.value,
                company: company.value,
                title: document.getElementById("leadTitle")?.value || '',
                source: source.value,
                email: email.value,
                phone: phone.value,
                address: document.getElementById("leadAddress")?.value || '',
                city: document.getElementById("leadCity")?.value || '',
                state: document.getElementById("leadState")?.value || '',
                zip: document.getElementById("leadZip")?.value || '',
                country: document.getElementById("leadCountry")?.value || 'United States',
                status: document.getElementById("leadStatus")?.value || 'new',
                assignedTo: document.getElementById("leadAssignedTo")?.value || '',
                interest: document.getElementById("leadInterest")?.value || 'medium',
                notes: document.getElementById("leadNotes")?.value || ''
            };
    
            // Show loader
            loader.classList.add("show");
    
            // Simulate API call
            setTimeout(() => {
                // Here you would typically send this data to your backend
                console.log("Lead form submitted:", formData);
    
                // Create the new lead
                createNewLead(formData);
    
                // Hide loader
                loader.classList.remove("show");
    
                // Close the modal
                closeModal(leadModal);
    
                // Show success message
                showToast("success", "Success!", "Lead created successfully.");
    
                // Reset form
                leadForm.reset();
            }, 1000);
        });
    }
    
    // Customer form validation and submission
    const customerForm = document.getElementById("customerForm");
    if (customerForm) {
        customerForm.addEventListener("submit", (e) => {
            e.preventDefault();
    
            // Reset error messages
            document.querySelectorAll(".form-error").forEach((el) => (el.textContent = ""));
    
            // Validate required fields
            let isValid = true;
    
            const firstName = document.getElementById("customerFirstName");
            if (!firstName.value) {
                document.getElementById("customerFirstNameError").textContent = "Please enter the first name";
                isValid = false;
            }
    
            const lastName = document.getElementById("customerLastName");
            if (!lastName.value) {
                document.getElementById("customerLastNameError").textContent = "Please enter the last name";
                isValid = false;
            }
    
            const company = document.getElementById("customerCompany");
            if (!company.value) {
                document.getElementById("customerCompanyError").textContent = "Please enter the company name";
                isValid = false;
            }
    
            const email = document.getElementById("customerEmail");
            if (!email.value) {
                document.getElementById("customerEmailError").textContent = "Please enter an email address";
                isValid = false;
            } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
                document.getElementById("customerEmailError").textContent = "Please enter a valid email address";
                isValid = false;
            }
    
            const phone = document.getElementById("customerPhone");
            if (!phone.value) {
                document.getElementById("customerPhoneError").textContent = "Please enter a phone number";
                isValid = false;
            }
    
            if (!isValid) {
                // Show error toast
                showToast("error", "Validation Error", "Please fill in all required fields correctly.");
                return;
            }
    
            // Collect form data
            const formData = {
                firstName: firstName.value,
                lastName: lastName.value,
                company: company.value,
                customerType: document.getElementById("customerType")?.value || 'regular',
                industry: document.getElementById("customerIndustry")?.value || '',
                email: email.value,
                phone: phone.value,
                address: document.getElementById("customerAddress")?.value || '',
                city: document.getElementById("customerCity")?.value || '',
                state: document.getElementById("customerState")?.value || '',
                zip: document.getElementById("customerZip")?.value || '',
                country: document.getElementById("customerCountry")?.value || 'United States',
                status: document.getElementById("customerStatus")?.value || 'active',
                assignedTo: document.getElementById("customerAssignedTo")?.value || '',
                paymentTerms: document.getElementById("customerPaymentTerms")?.value || 'net30',
                notes: document.getElementById("customerNotes")?.value || ''
            };
    
            // Show loader
            loader.classList.add("show");
    
            // Simulate API call
            setTimeout(() => {
                // Here you would typically send this data to your backend
                console.log("Customer form submitted:", formData);
    
                // Create the new customer
                createNewCustomer(formData);
    
                // Hide loader
                loader.classList.remove("show");
    
                // Close the modal
                closeModal(customerModal);
    
                // Show success message
                showToast("success", "Success!", "Customer created successfully.");
    
                // Reset form
                customerForm.reset();
                
                // Switch to the Customers tab to show the new customer
                const customersTab = document.querySelector('.tab-btn[data-tab="customers"]');
                if (customersTab) {
                    customersTab.click();
                }
            }, 1000);
        });
    }
  
    // Filter application
    const applyFiltersBtn = document.getElementById("applyFiltersBtn");
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener("click", () => {
            // Apply filters based on active tab
            const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
            
            if (activeTab === 'leads') {
                filterLeads();
            } else if (activeTab === 'customers') {
                // Implement customer filtering similar to filterLeads()
                showToast("info", "Filter Applied", "Customer filtering will be implemented in a future update.");
            }
        });
    }
  
    // Reset filters
    const resetFiltersBtn = document.getElementById("resetFiltersBtn");
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener("click", () => {
            // Reset form elements
            document.getElementById("statusFilter").value = 'all';
            document.getElementById("startDate").value = '';
            document.getElementById("endDate").value = '';
            document.getElementById("sourceFilter").value = 'all';
            document.getElementById("assignedUserFilter").value = 'all';
            
            // Clear filters
            filteredLeads = [];
            filteredCustomers = [];
            
            // Update display
            const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
            
            if (activeTab === 'leads') {
                displayFilteredRows('leads');
                updatePagination('leads', 'table');
                updatePagination('leads', 'card');
            } else if (activeTab === 'customers') {
                displayFilteredRows('customers');
                updatePagination('customers', 'table');
            }
            
            showToast("info", "Filters Reset", "All filters have been cleared.");
        });
    }
  
    // Search functionality
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener("click", () => {
            searchEntities(searchInput.value);
        });
        
        searchInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                searchEntities(searchInput.value);
            }
        });
    }
  
    // Bulk actions
    const leadBulkActionBtn = document.getElementById("leadBulkActionBtn");
    const leadBulkActionMenu = document.getElementById("leadBulkActionMenu");
    
    if (leadBulkActionBtn && leadBulkActionMenu) {
        leadBulkActionBtn.addEventListener("click", () => {
            toggleDropdown(leadBulkActionMenu, !leadBulkActionMenu.classList.contains("show"));
        });
        
        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!e.target.closest("#leadBulkActionBtn") && !e.target.closest("#leadBulkActionMenu")) {
                toggleDropdown(leadBulkActionMenu, false);
            }
        });
    }
  
    // Handle select all checkboxes
    const selectAllLeads = document.getElementById("selectAllLeads");
    if (selectAllLeads) {
        selectAllLeads.addEventListener("change", () => {
            const checkboxes = document.querySelectorAll(".lead-checkbox");
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAllLeads.checked;
            });
        });
    }
  
    const selectAllCustomers = document.getElementById("selectAllCustomers");
    if (selectAllCustomers) {
        selectAllCustomers.addEventListener("change", () => {
            const checkboxes = document.querySelectorAll(".customer-checkbox");
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAllCustomers.checked;
            });
        });
    }
  
    // Pagination
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                updatePagination('leads', 'table');
                // Implement pagination logic to show correct rows
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener("click", () => {
            const totalPages = Math.ceil(
                (filteredLeads.length || totalLeads) / itemsPerPage
            );
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination('leads', 'table');
                // Implement pagination logic to show correct rows
            }
        });
    }
  
    // Card pagination
    const prevPageCardBtn = document.getElementById("prevPageCard");
    const nextPageCardBtn = document.getElementById("nextPageCard");
    
    if (prevPageCardBtn) {
        prevPageCardBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                updatePagination('leads', 'card');
                // Implement pagination logic to show correct cards
            }
        });
    }
    
    if (nextPageCardBtn) {
        nextPageCardBtn.addEventListener("click", () => {
            const totalPages = Math.ceil(
                (filteredLeads.length || totalLeads) / itemsPerPage
            );
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination('leads', 'card');
                // Implement pagination logic to show correct cards
            }
        });
    }
  
    // Customer pagination
    const prevPageCustomerBtn = document.getElementById("prevPageCustomer");
    const nextPageCustomerBtn = document.getElementById("nextPageCustomer");
    
    if (prevPageCustomerBtn) {
        prevPageCustomerBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                updatePagination('customers', 'table');
                // Implement pagination logic to show correct rows
            }
        });
    }
    
    if (nextPageCustomerBtn) {
        nextPageCustomerBtn.addEventListener("click", () => {
            const totalPages = Math.ceil(
                (filteredCustomers.length || totalCustomers) / itemsPerPage
            );
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination('customers', 'table');
                // Implement pagination logic to show correct rows
            }
        });
    }
  
    // Sortable table headers
    document.querySelectorAll("th.sortable").forEach(header => {
        header.addEventListener("click", () => {
            const column = header.getAttribute("data-sort");
            
            // Toggle sort direction or set to ascending if not sorted
            if (!sortDirection[column]) {
                sortDirection[column] = true;
            } else {
                sortDirection[column] = !sortDirection[column];
            }
            
            // Clear other sort directions
            for (const key in sortDirection) {
                if (key !== column) {
                    delete sortDirection[key];
                }
            }
            
            // Sort table
            const tableId = header.closest("table").id;
            sortTable(tableId, column, sortDirection[column]);
        });
    });
  
    // Initialize the application
    function init() {
        // Initial pagination setup
        updatePagination('leads', 'table');
        updatePagination('leads', 'card');
        updatePagination('customers', 'table');
        
        // Attach event listeners to dynamic elements
        attachEventListeners();
    }
  
    // Run initialization
    init();
});