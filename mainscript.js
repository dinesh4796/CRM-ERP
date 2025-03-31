/**
 * ERP System - Dispatch Management
 * Main JavaScript file
 */

document.addEventListener("DOMContentLoaded", () => {
    // ======================================
    // GLOBAL VARIABLES
    // ======================================
    let sortDirection = {};
    let currentPage = 1;
    let itemsPerPage = 10;
    let totalDispatches = 5; // Initial total for demo data
    let filteredDispatches = [];
    let currentDispatchId = null;
    
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
     * Update pagination display and controls
     * @param {string} type - 'table' or 'card'
     */
    function updatePagination(type = 'table') {
        const totalItems = filteredDispatches.length || totalDispatches;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Update display
        if (type === 'table') {
            document.getElementById('currentPage').textContent = currentPage;
            document.getElementById('totalPages').textContent = totalPages;
            
            // Update button states
            document.getElementById('prevPage').disabled = currentPage <= 1;
            document.getElementById('nextPage').disabled = currentPage >= totalPages;
        } else {
            document.getElementById('currentPageCard').textContent = currentPage;
            document.getElementById('totalPagesCard').textContent = totalPages;
            
            // Update button states
            document.getElementById('prevPageCard').disabled = currentPage <= 1;
            document.getElementById('nextPageCard').disabled = currentPage >= totalPages;
        }
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
     * Filter dispatches based on selected criteria
     */
    function filterDispatches() {
        const statusFilter = document.getElementById('statusFilter').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const warehouseFilter = document.getElementById('warehouseFilter').value;
        const customerFilter = document.getElementById('customerFilter').value;
        
        // Get all dispatch rows
        const dispatchRows = Array.from(document.querySelectorAll('#dispatchTableBody tr'));
        
        filteredDispatches = dispatchRows.filter(row => {
            let matchesStatus = true;
            let matchesDate = true;
            let matchesWarehouse = true;
            let matchesCustomer = true;
            
            // Status filter
            if (statusFilter !== 'all') {
                const statusCell = row.querySelector('td:nth-child(6)');
                const statusBadge = statusCell.querySelector('.status-badge');
                const status = statusBadge ? statusBadge.textContent.trim().toLowerCase() : '';
                matchesStatus = status === statusFilter;
            }
            
            // Date filter
            if (startDate || endDate) {
                const dateCell = row.querySelector('td:nth-child(5)');
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
            
            // Warehouse filter - use warehouse from data attribute or another source
            // For demo, just use a simple match
            if (warehouseFilter !== 'all') {
                // In a real app, you'd get the warehouse from the row data
                // This is a simplified example
                const dispatchId = row.querySelector('td:nth-child(2)').textContent.trim();
                // Just simulate a match for demo purposes
                matchesWarehouse = (dispatchId.charCodeAt(0) % 5 + 1).toString() === warehouseFilter.slice(-1);
            }
            
            // Customer filter
            if (customerFilter !== 'all') {
                const customerCell = row.querySelector('td:nth-child(4)');
                const customer = customerCell ? customerCell.textContent.trim() : '';
                
                // Map customer names to filter values (in real app, use proper data attributes)
                const customerMap = {
                    'Acme Corporation': 'customer1',
                    'TechSolutions Inc.': 'customer2',
                    'Global Traders': 'customer3',
                    'Innovative Systems': 'customer4',
                    'Pinnacle Industries': 'customer5'
                };
                
                matchesCustomer = customerMap[customer] === customerFilter;
            }
            
            return matchesStatus && matchesDate && matchesWarehouse && matchesCustomer;
        });
        
        // Now update the table to show only filtered rows
        displayFilteredRows();
        
        // Also update the card view
        displayFilteredCards();
        
        // Reset to first page
        currentPage = 1;
        updatePagination('table');
        updatePagination('card');
    }
    
    /**
     * Display filtered rows in the table
     */
    function displayFilteredRows() {
        const tableBody = document.getElementById('dispatchTableBody');
        const allRows = Array.from(tableBody.querySelectorAll('tr'));
        
        if (filteredDispatches.length > 0) {
            // Hide all rows first
            allRows.forEach(row => {
                row.style.display = 'none';
            });
            
            // Show only filtered rows
            filteredDispatches.forEach(row => {
                row.style.display = '';
            });
        } else {
            // If no filters or all filters removed, show all rows
            allRows.forEach(row => {
                row.style.display = '';
            });
        }
    }
    
    /**
     * Display filtered cards in the card view
     */
    function displayFilteredCards() {
        const cardGrid = document.getElementById('dispatchCardGrid');
        const allCards = Array.from(cardGrid.querySelectorAll('.dispatch-card'));
        
        if (filteredDispatches.length > 0) {
            // Hide all cards first
            allCards.forEach(card => {
                card.style.display = 'none';
            });
            
            // Show only filtered cards
            filteredDispatches.forEach(row => {
                const dispatchId = row.querySelector('td:nth-child(2)').textContent.trim();
                const card = cardGrid.querySelector(`.dispatch-card[data-id="${dispatchId}"]`);
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
     * Search dispatches based on input text
     * @param {string} searchText - Text to search for
     */
    function searchDispatches(searchText) {
        if (!searchText) {
            // If search is empty, reset filters
            document.getElementById('resetFiltersBtn').click();
            return;
        }
        
        searchText = searchText.toLowerCase();
        
        // Get all dispatch rows
        const dispatchRows = Array.from(document.querySelectorAll('#dispatchTableBody tr'));
        
        filteredDispatches = dispatchRows.filter(row => {
            // Search in all cells
            const cells = Array.from(row.querySelectorAll('td')).slice(1, -1); // Skip checkbox and actions
            
            return cells.some(cell => {
                const text = cell.textContent.toLowerCase();
                return text.includes(searchText);
            });
        });
        
        // Display results
        displayFilteredRows();
        displayFilteredCards();
        
        // Reset to first page
        currentPage = 1;
        updatePagination('table');
        updatePagination('card');
    }
    
    /**
     * Get dispatch details by ID (simulated for demo)
     * @param {string} dispatchId - Dispatch ID to get details for
     * @returns {Object} Dispatch details object
     */
    function getDispatchDetails(dispatchId) {
        // In a real app, this would be an API call
        // Here we'll return mock data based on the dispatch ID
        const mockData = {
            'DSP-2023-001': {
                id: 'DSP-2023-001',
                soNumber: 'SO-2023-001',
                customer: 'Acme Corporation',
                dispatchDate: '2023-06-15',
                status: 'pending',
                warehouse: 'Main Warehouse',
                reference: 'REF12345',
                createdBy: 'John Doe',
                deliveryDate: '2023-06-16',
                deliveryTime: '10:00 AM',
                shippingAddress: '123 Main St, Suite 500, Anytown, CA 90210',
                contactPerson: 'Jane Smith',
                contactPhone: '(555) 123-4567',
                deliveryInstructions: 'Please deliver to loading dock at the back of the building. Call 15 minutes before arrival.',
                items: [
                    { product: 'Widget A', sku: 'SKU-001', quantity: 10, unit: 'Pcs' },
                    { product: 'Widget B', sku: 'SKU-002', quantity: 5, unit: 'Pcs' }
                ],
                notes: 'Customer requested special packaging for fragile items.',
                attachments: [
                    { name: 'Invoice.pdf', type: 'pdf' },
                    { name: 'Packing_List.xlsx', type: 'excel' }
                ]
            },
            'DSP-2023-002': {
                id: 'DSP-2023-002',
                soNumber: 'SO-2023-002',
                customer: 'TechSolutions Inc.',
                dispatchDate: '2023-06-16',
                status: 'loading',
                warehouse: 'North Distribution Center',
                reference: 'REF67890',
                createdBy: 'Sarah Johnson',
                deliveryDate: '2023-06-17',
                deliveryTime: '12:30 PM',
                shippingAddress: '456 Tech Blvd, Floor 3, Tech City, WA 98001',
                contactPerson: 'Mike Chen',
                contactPhone: '(555) 987-6543',
                deliveryInstructions: 'Requires dock with lift gate. Security check-in required at front desk.',
                items: [
                    { product: 'Widget C', sku: 'SKU-003', quantity: 20, unit: 'Boxes' },
                    { product: 'Widget D', sku: 'SKU-004', quantity: 7, unit: 'Boxes' },
                    { product: 'Widget E', sku: 'SKU-005', quantity: 15, unit: 'Pcs' }
                ],
                notes: 'Priority customer. Ensure on-time delivery.',
                attachments: [
                    { name: 'Invoice_002.pdf', type: 'pdf' },
                    { name: 'Product_Specs.docx', type: 'word' }
                ]
            },
            'DSP-2023-003': {
                id: 'DSP-2023-003',
                soNumber: 'SO-2023-003',
                customer: 'Global Traders',
                dispatchDate: '2023-06-17',
                status: 'in-progress',
                warehouse: 'South Distribution Center',
                reference: 'REF24680',
                createdBy: 'Robert Smith',
                deliveryDate: '2023-06-18',
                deliveryTime: '09:15 AM',
                shippingAddress: '789 International Way, Global Port, TX 75001',
                contactPerson: 'David Lee',
                contactPhone: '(555) 246-8102',
                deliveryInstructions: 'Requires export documentation. Contact warehouse manager on arrival.',
                items: [
                    { product: 'Widget A', sku: 'SKU-001', quantity: 100, unit: 'Pcs' },
                    { product: 'Widget C', sku: 'SKU-003', quantity: 50, unit: 'Boxes' },
                    { product: 'Widget E', sku: 'SKU-005', quantity: 75, unit: 'Pcs' }
                ],
                notes: 'International shipment. Verify all customs documents.',
                attachments: [
                    { name: 'Invoice_003.pdf', type: 'pdf' },
                    { name: 'Customs_Forms.pdf', type: 'pdf' },
                    { name: 'Export_License.pdf', type: 'pdf' }
                ]
            },
            'DSP-2023-004': {
                id: 'DSP-2023-004',
                soNumber: 'SO-2023-004',
                customer: 'Innovative Systems',
                dispatchDate: '2023-06-14',
                status: 'completed',
                warehouse: 'East Fulfillment Center',
                reference: 'REF13579',
                createdBy: 'Emily Wilson',
                deliveryDate: '2023-06-15',
                deliveryTime: '14:00 PM',
                shippingAddress: '321 Innovation Ave, Tech Park, NY 10001',
                contactPerson: 'Alex Turner',
                contactPhone: '(555) 135-7924',
                deliveryInstructions: 'Deliver to R&D department. Signature required from lab manager only.',
                items: [
                    { product: 'Widget B', sku: 'SKU-002', quantity: 30, unit: 'Pcs' },
                    { product: 'Widget D', sku: 'SKU-004', quantity: 15, unit: 'Boxes' }
                ],
                notes: 'Successfully delivered ahead of schedule. Customer very satisfied.',
                attachments: [
                    { name: 'Invoice_004.pdf', type: 'pdf' },
                    { name: 'Delivery_Receipt.pdf', type: 'pdf' }
                ]
            },
            'DSP-2023-005': {
                id: 'DSP-2023-005',
                soNumber: 'SO-2023-005',
                customer: 'Pinnacle Industries',
                dispatchDate: '2023-06-15',
                status: 'cancelled',
                warehouse: 'West Fulfillment Center',
                reference: 'REF97531',
                createdBy: 'James Brown',
                deliveryDate: '2023-06-16',
                deliveryTime: '11:30 AM',
                shippingAddress: '987 Corporate Drive, Industrial Park, CA 94102',
                contactPerson: 'Patricia Allen',
                contactPhone: '(555) 975-3108',
                deliveryInstructions: 'Forklift required for unloading. Check in at security gate.',
                items: [
                    { product: 'Widget A', sku: 'SKU-001', quantity: 25, unit: 'Pcs' },
                    { product: 'Widget E', sku: 'SKU-005', quantity: 10, unit: 'Pcs' }
                ],
                notes: 'Cancelled by customer due to change in requirements. Credit issued.',
                attachments: [
                    { name: 'Cancellation_Form.pdf', type: 'pdf' },
                    { name: 'Credit_Note.pdf', type: 'pdf' }
                ]
            }
        };
        
        return mockData[dispatchId] || null;
    }
    
    /**
     * Populate view dispatch modal with details
     * @param {string} dispatchId - Dispatch ID to view
     */
    function populateViewDispatchModal(dispatchId) {
        const dispatch = getDispatchDetails(dispatchId);
        if (!dispatch) {
            showToast('error', 'Error', 'Dispatch details not found');
            return;
        }
        
        // Set current dispatch ID
        currentDispatchId = dispatchId;
        
        // Update header
        document.querySelector('.dispatch-id h3').textContent = dispatch.id;
        
        // Update status badge
        const statusBadge = document.getElementById('viewDispatchStatus');
        statusBadge.textContent = dispatch.status.charAt(0).toUpperCase() + dispatch.status.slice(1);
        statusBadge.className = `status-badge ${dispatch.status}`;
        
        // Update detail fields
        document.getElementById('viewSONumber').textContent = dispatch.soNumber;
        document.getElementById('viewCustomer').textContent = dispatch.customer;
        document.getElementById('viewDispatchDate').textContent = formatDate(dispatch.dispatchDate);
        document.getElementById('viewWarehouse').textContent = dispatch.warehouse;
        document.getElementById('viewReference').textContent = dispatch.reference;
        document.getElementById('viewCreatedBy').textContent = dispatch.createdBy;
        
        // Update delivery information
        document.getElementById('viewDeliveryDate').textContent = formatDate(dispatch.deliveryDate);
        document.getElementById('viewDeliveryTime').textContent = dispatch.deliveryTime;
        document.getElementById('viewShippingAddress').textContent = dispatch.shippingAddress;
        document.getElementById('viewContactPerson').textContent = dispatch.contactPerson;
        document.getElementById('viewContactPhone').textContent = dispatch.contactPhone;
        document.getElementById('viewDeliveryInstructions').textContent = dispatch.deliveryInstructions;
        
        // Update items table
        const itemsTableBody = document.getElementById('viewItemsTable').querySelector('tbody');
        itemsTableBody.innerHTML = '';
        
        dispatch.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.product}</td>
                <td>${item.sku}</td>
                <td>${item.quantity}</td>
                <td>${item.unit}</td>
            `;
            itemsTableBody.appendChild(row);
        });
        
        // Update notes
        document.getElementById('viewNotes').textContent = dispatch.notes;
        
        // Update attachments
        const attachmentsSection = document.querySelector('.attachments-section');
        attachmentsSection.innerHTML = '';
        
        dispatch.attachments.forEach(attachment => {
            let iconClass = 'file';
            switch (attachment.type) {
                case 'pdf':
                    iconClass = 'file-pdf';
                    break;
                case 'excel':
                    iconClass = 'file-excel';
                    break;
                case 'word':
                    iconClass = 'file-word';
                    break;
                default:
                    iconClass = 'file';
            }
            
            const attachmentItem = document.createElement('div');
            attachmentItem.className = 'attachment-item';
            attachmentItem.innerHTML = `
                <i class="fas fa-${iconClass}"></i>
                <span>${attachment.name}</span>
                <a href="#" class="attachment-download"><i class="fas fa-download"></i></a>
            `;
            attachmentsSection.appendChild(attachmentItem);
        });
        
        // Open the modal
        openModal(document.getElementById('viewDispatchModal'));
    }
    
    /**
     * Add a new item to the dispatch items table
     */
    function addItemToDispatchTable() {
        const productSelect = document.getElementById('productSelect');
        const itemQty = document.getElementById('itemQty');
        
        // Validate inputs
        let isValid = true;
        
        if (!productSelect.value) {
            document.getElementById('productSelectError').textContent = 'Please select a product';
            isValid = false;
        } else {
            document.getElementById('productSelectError').textContent = '';
        }
        
        if (!itemQty.value || itemQty.value <= 0) {
            document.getElementById('itemQtyError').textContent = 'Please enter a valid quantity';
            isValid = false;
        } else {
            document.getElementById('itemQtyError').textContent = '';
        }
        
        if (!isValid) {
            return;
        }
        
        // Get product details
        const productText = productSelect.options[productSelect.selectedIndex].text;
        const availableQty = document.getElementById('availableQty').value;
        const quantity = itemQty.value;
        
        // Create new row
        const table = document.getElementById('dispatchItemsTable');
        const tbody = table.querySelector('tbody');
        const newRow = document.createElement('tr');
        
        newRow.innerHTML = `
            <td>${productText}</td>
            <td>${availableQty}</td>
            <td>
                <input type="number" class="form-control dispatch-qty" min="1" max="${availableQty}" value="${quantity}">
            </td>
            <td>
                <button type="button" class="btn-icon delete-item-btn"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add delete handler
        const deleteBtn = newRow.querySelector('.delete-item-btn');
        deleteBtn.addEventListener('click', () => {
            tbody.removeChild(newRow);
        });
        
        // Add new row before the "Add Item" row
        const addItemRow = document.getElementById('addItemRow');
        tbody.insertBefore(newRow, addItemRow);
        
        // Close add item modal
        closeModal(document.getElementById('addItemModal'));
        
        // Reset form
        document.getElementById('addItemForm').reset();
    }
    
    /**
     * Add a new item to the transfer items table
     */
    function addItemToTransferTable() {
        // Create new row
        const table = document.getElementById('transferItemsTable');
        const tbody = table.querySelector('tbody');
        const newRow = document.createElement('tr');
        
        // Get available products
        const options = Array.from(document.getElementById('productSelect').options)
            .map(option => {
                if (option.value && option.text) {
                    return `<option value="${option.value}">${option.text}</option>`;
                }
                return '';
            })
            .join('');
        
        // Create cell contents with dropdown
        newRow.innerHTML = `
            <td>
                <select class="form-control product-select">
                    <option value="">Select Product</option>
                    ${options}
                </select>
            </td>
            <td>
                <span class="available-qty">0</span>
            </td>
            <td>
                <input type="number" class="form-control transfer-qty" min="1" value="1">
            </td>
            <td>
                <button type="button" class="btn-icon delete-item-btn"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add event listeners
        const productSelect = newRow.querySelector('.product-select');
        const availableQtySpan = newRow.querySelector('.available-qty');
        const transferQtyInput = newRow.querySelector('.transfer-qty');
        const deleteBtn = newRow.querySelector('.delete-item-btn');
        
        // Update available quantity when product is selected
        productSelect.addEventListener('change', () => {
            // In a real app, you would fetch this from an API
            // For demo, we'll use mock data
            if (productSelect.value) {
                const randomQty = Math.floor(Math.random() * 100) + 50;
                availableQtySpan.textContent = randomQty;
                transferQtyInput.max = randomQty;
            } else {
                availableQtySpan.textContent = '0';
            }
        });
        
        // Delete row
        deleteBtn.addEventListener('click', () => {
            tbody.removeChild(newRow);
        });
        
        // Add new row before the "Add Item" row
        const addItemRow = document.getElementById('addTransferItemRow');
        tbody.insertBefore(newRow, addItemRow);
    }
    
    /**
     * Add a new dispatch row to the table (for demo after form submit)
     * @param {Object} formData - Form data for the new dispatch
     */
    function addNewDispatchRow(formData) {
        // Generate a new dispatch ID
        const newId = `DSP-2023-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        
        // Get the table body
        const tableBody = document.getElementById('dispatchTableBody');
        
        // Create new row
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td class="checkbox-cell">
                <label class="checkbox">
                    <input type="checkbox" class="dispatch-checkbox" data-id="${newId}">
                    <span class="checkmark"></span>
                </label>
            </td>
            <td>${newId}</td>
            <td>${formData.salesOrder}</td>
            <td>${formData.salesOrder.split(' - ')[1] || 'New Customer'}</td>
            <td>${formData.dispatchDate}</td>
            <td><span class="status-badge ${formData.status}">${formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}</span></td>
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
        
        // Add event listeners to the new buttons
        const viewBtn = newRow.querySelector('.view-btn');
        viewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // For demo, we'll use the first dispatch's data
            populateViewDispatchModal('DSP-2023-001');
        });
        
        const editBtn = newRow.querySelector('.edit-btn');
        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('info', 'Edit', `Editing dispatch ${newId}`);
        });
        
        const deleteBtn = newRow.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            confirmDelete([newId]);
        });
        
        // Add the row to the table
        tableBody.insertBefore(newRow, tableBody.firstChild);
        
        // Also add to card view
        addNewDispatchCard(newId, formData);
        
        // Update total
        totalDispatches++;
        updatePagination();
        updatePagination('card');
    }
    
    /**
     * Add a new dispatch card to the grid (for demo after form submit)
     * @param {string} newId - New dispatch ID
     * @param {Object} formData - Form data for the new dispatch
     */
    function addNewDispatchCard(newId, formData) {
        // Get the card grid
        const cardGrid = document.getElementById('dispatchCardGrid');
        
        // Create new card
        const newCard = document.createElement('div');
        newCard.className = 'dispatch-card';
        newCard.setAttribute('data-id', newId);
        
        newCard.innerHTML = `
            <div class="card-header">
                <div class="card-title">
                    <h3>${newId}</h3>
                    <span class="status-badge ${formData.status}">${formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}</span>
                </div>
                <div class="card-actions">
                    <label class="checkbox">
                        <input type="checkbox" class="dispatch-card-checkbox" data-id="${newId}">
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>
            <div class="card-body">
                <div class="card-info">
                    <p><strong>Sales Order:</strong> ${formData.salesOrder}</p>
                    <p><strong>Customer:</strong> ${formData.salesOrder.split(' - ')[1] || 'New Customer'}</p>
                    <p><strong>Dispatch Date:</strong> ${formData.dispatchDate}</p>
                    <p><strong>Items:</strong> ${formData.items.length}</p>
                </div>
                <div class="card-actions-bottom">
                    <button class="btn btn-sm btn-outline view-card-btn" data-id="${newId}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-outline edit-card-btn" data-id="${newId}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const viewBtn = newCard.querySelector('.view-card-btn');
        viewBtn.addEventListener('click', () => {
            // For demo, we'll use the first dispatch's data
            populateViewDispatchModal('DSP-2023-001');
        });
        
        const editBtn = newCard.querySelector('.edit-card-btn');
        editBtn.addEventListener('click', () => {
            showToast('info', 'Edit', `Editing dispatch ${newId}`);
        });
        
        // Add the card to the grid
        cardGrid.insertBefore(newCard, cardGrid.firstChild);
    }
    
    /**
     * Confirm delete operation for dispatches
     * @param {Array} ids - Array of dispatch IDs to delete
     */
    function confirmDelete(ids) {
        if (!ids || ids.length === 0) {
            showToast('error', 'Error', 'No items selected for deletion');
            return;
        }
        
        // Update confirm message
        const message = ids.length === 1
            ? `Are you sure you want to delete dispatch ${ids[0]}? This action cannot be undone.`
            : `Are you sure you want to delete ${ids.length} dispatches? This action cannot be undone.`;
        
        document.querySelector('#confirmDeleteModal .modal-body p').textContent = message;
        
        // Store IDs to delete
        document.getElementById('confirmDeleteBtn').setAttribute('data-ids', JSON.stringify(ids));
        
        // Open the modal
        openModal(document.getElementById('confirmDeleteModal'));
    }
    
    /**
     * Delete dispatches from table and cards
     * @param {Array} ids - Array of dispatch IDs to delete
     */
    function deleteDispatches(ids) {
        if (!ids || ids.length === 0) return;
        
        // Delete from table
        ids.forEach(id => {
            const tableRow = document.querySelector(`#dispatchTableBody tr td:nth-child(2):contains("${id}")`).closest('tr');
            if (tableRow) {
                tableRow.remove();
            }
            
            // Delete from card view
            const card = document.querySelector(`.dispatch-card[data-id="${id}"]`);
            if (card) {
                card.remove();
            }
        });
        
        // Update total
        totalDispatches -= ids.length;
        updatePagination();
        updatePagination('card');
        
        // Show success message
        const message = ids.length === 1
            ? `Dispatch ${ids[0]} has been deleted successfully.`
            : `${ids.length} dispatches have been deleted successfully.`;
        
        showToast('success', 'Deleted!', message);
    }
    
    /**
     * Load products for the add item modal
     * @param {HTMLElement} selectElement - Select element to populate
     */
    function loadProductOptions(selectElement) {
        // In a real app, you would fetch this from an API
        // For demo, we'll use the mock data from the table
        
        // Clear existing options except the first one
        while (selectElement.options.length > 1) {
            selectElement.remove(1);
        }
        
        // Get products from stock table
        const stockTable = document.getElementById('stockTableBody');
        if (stockTable) {
            const rows = stockTable.querySelectorAll('tr');
            rows.forEach(row => {
                const productName = row.cells[0].textContent.trim();
                const option = document.createElement('option');
                option.value = productName.toLowerCase().replace(/\s+/g, '_');
                option.textContent = productName;
                selectElement.appendChild(option);
            });
        } else {
            // Fallback options if stock table isn't available
            const products = ['Widget A', 'Widget B', 'Widget C', 'Widget D', 'Widget E'];
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.toLowerCase().replace(/\s+/g, '_');
                option.textContent = product;
                selectElement.appendChild(option);
            });
        }
    }
    
    /**
     * Update available quantity when product is selected
     * @param {Event} event - Change event
     */
    function updateAvailableQty(event) {
        const productSelect = event.target;
        const availableQty = document.getElementById('availableQty');
        
        if (productSelect.value) {
            // In a real app, you would fetch this from an API
            // For demo, we'll use mock data
            
            // Try to get quantity from stock table
            const stockTable = document.getElementById('stockTableBody');
            if (stockTable) {
                const productName = productSelect.options[productSelect.selectedIndex].text;
                const rows = Array.from(stockTable.querySelectorAll('tr'));
                const row = rows.find(r => r.cells[0].textContent.trim() === productName);
                
                if (row) {
                    // Use Main Warehouse quantity (cell index 2)
                    availableQty.value = row.cells[2].textContent.trim();
                    return;
                }
            }
            
            // Fallback to random quantity
            availableQty.value = Math.floor(Math.random() * 100) + 50;
        } else {
            availableQty.value = '';
        }
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
        showToast("success", "Welcome!", "Dispatch Management System loaded successfully.");
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
    
    // Toggle view (Table/Card)
    const tableViewBtn = document.getElementById("tableViewBtn");
    const cardViewBtn = document.getElementById("cardViewBtn");
    const tableView = document.getElementById("tableView");
    const cardView = document.getElementById("cardView");
    
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
    
    // Toggle filters
    const toggleFiltersBtn = document.getElementById("toggleFilters");
    const filterBody = document.querySelector(".filter-body");
    
    toggleFiltersBtn.addEventListener("click", () => {
        filterBody.classList.toggle("hidden");
        toggleFiltersBtn.querySelector("i").classList.toggle("fa-chevron-up");
        toggleFiltersBtn.querySelector("i").classList.toggle("fa-chevron-down");
    });
    
    // Apply filters
    const applyFiltersBtn = document.getElementById("applyFiltersBtn");
    applyFiltersBtn.addEventListener("click", () => {
        filterDispatches();
        showToast("success", "Filters Applied", "The dispatch list has been filtered according to your criteria.");
    });
    
    // Reset filters
    const resetFiltersBtn = document.getElementById("resetFiltersBtn");
    resetFiltersBtn.addEventListener("click", () => {
        // Reset all filter controls
        document.getElementById('statusFilter').value = 'all';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        document.getElementById('warehouseFilter').value = 'all';
        document.getElementById('customerFilter').value = 'all';
        
        // Clear the filtered dispatches array
        filteredDispatches = [];
        
        // Show all rows
        const allRows = document.querySelectorAll('#dispatchTableBody tr');
        allRows.forEach(row => {
            row.style.display = '';
        });
        
        // Show all cards
        const allCards = document.querySelectorAll('.dispatch-card');
        allCards.forEach(card => {
            card.style.display = '';
        });
        
        // Reset pagination
        currentPage = 1;
        updatePagination();
        updatePagination('card');
        
        showToast("info", "Filters Reset", "All filters have been cleared.");
    });
    
    // Search functionality
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    
    searchBtn.addEventListener("click", () => {
        searchDispatches(searchInput.value);
    });
    
    searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            searchDispatches(searchInput.value);
        }
    });
    
    // Sorting
    const sortableHeaders = document.querySelectorAll('th.sortable');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-sort');
            
            // Toggle sort direction or set to ascending if not sorted yet
            if (!sortDirection[column]) {
                sortDirection[column] = true; // ascending
            } else {
                sortDirection[column] = !sortDirection[column];
            }
            
            // Reset other columns
            Object.keys(sortDirection).forEach(key => {
                if (key !== column) {
                    delete sortDirection[key];
                }
            });
            
            // Sort the table
            const tableId = header.closest('table').id;
            sortTable(tableId, column, sortDirection[column]);
        });
    });
    
    // Pagination
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    });
    
    nextPageBtn.addEventListener("click", () => {
        const totalItems = filteredDispatches.length || totalDispatches;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
        }
    });
    
    // Card view pagination
    const prevPageCardBtn = document.getElementById("prevPageCard");
    const nextPageCardBtn = document.getElementById("nextPageCard");
    
    prevPageCardBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination('card');
        }
    });
    
    nextPageCardBtn.addEventListener("click", () => {
        const totalItems = filteredDispatches.length || totalDispatches;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination('card');
        }
    });
    
    // Select all dispatches
    const selectAllDispatches = document.getElementById("selectAllDispatches");
    
    selectAllDispatches.addEventListener("change", () => {
        const checkboxes = document.querySelectorAll(".dispatch-checkbox");
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAllDispatches.checked;
        });
        
        // Also update card checkboxes
        const cardCheckboxes = document.querySelectorAll(".dispatch-card-checkbox");
        cardCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllDispatches.checked;
        });
    });
    
    // Select all transfers
    const selectAllTransfers = document.getElementById("selectAllTransfers");
    
    if (selectAllTransfers) {
        selectAllTransfers.addEventListener("change", () => {
            const checkboxes = document.querySelectorAll(".transfer-checkbox");
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAllTransfers.checked;
            });
        });
    }
    
    // Bulk actions dropdown
    const bulkActionBtn = document.getElementById("bulkActionBtn");
    const bulkActionMenu = document.getElementById("bulkActionMenu");
    
    bulkActionBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleDropdown(bulkActionMenu, !bulkActionMenu.classList.contains("show"));
    });
    
    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
        toggleDropdown(bulkActionMenu, false);
    });
    
    // Bulk print action
    const bulkPrintBtn = document.getElementById("bulkPrintBtn");
    
    bulkPrintBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Get selected dispatch IDs
        const selected = Array.from(document.querySelectorAll(".dispatch-checkbox:checked, .dispatch-card-checkbox:checked"))
            .map(checkbox => checkbox.getAttribute("data-id"));
        
        if (selected.length === 0) {
            showToast("error", "Error", "No dispatches selected for printing");
            return;
        }
        
        showToast("info", "Print", `Printing ${selected.length} dispatches`);
        
        // Close the dropdown
        toggleDropdown(bulkActionMenu, false);
    });
    
    // Bulk export action
    const bulkExportBtn = document.getElementById("bulkExportBtn");
    
    bulkExportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Get selected dispatch IDs
        const selected = Array.from(document.querySelectorAll(".dispatch-checkbox:checked, .dispatch-card-checkbox:checked"))
            .map(checkbox => checkbox.getAttribute("data-id"));
        
        if (selected.length === 0) {
            showToast("error", "Error", "No dispatches selected for export");
            return;
        }
        
        showToast("info", "Export", `Exporting ${selected.length} dispatches`);
        
        // Close the dropdown
        toggleDropdown(bulkActionMenu, false);
    });
    
    // Bulk delete action
    const bulkDeleteBtn = document.getElementById("bulkDeleteBtn");
    
    bulkDeleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Get selected dispatch IDs
        const selected = Array.from(document.querySelectorAll(".dispatch-checkbox:checked, .dispatch-card-checkbox:checked"))
            .map(checkbox => checkbox.getAttribute("data-id"));
        
        if (selected.length === 0) {
            showToast("error", "Error", "No dispatches selected for deletion");
            return;
        }
        
        // Confirm delete
        confirmDelete(selected);
        
        // Close the dropdown
        toggleDropdown(bulkActionMenu, false);
    });
    
    // ======================================
    // MODAL HANDLING
    // ======================================
    
    // New Dispatch Modal
    const newDispatchBtn = document.getElementById("newDispatchBtn");
    const dispatchModal = document.getElementById("dispatchModal");
    const closeDispatchModal = document.getElementById("closeDispatchModal");
    const cancelDispatch = document.getElementById("cancelDispatch");
    
    newDispatchBtn.addEventListener("click", () => {
        openModal(dispatchModal);
    });
    
    closeDispatchModal.addEventListener("click", () => {
        closeModal(dispatchModal);
    });
    
    cancelDispatch.addEventListener("click", () => {
        closeModal(dispatchModal);
    });
    
    // New Transfer Modal
    const newTransferBtn = document.getElementById("newTransferBtn");
    const transferModal = document.getElementById("transferModal");
    const closeTransferModal = document.getElementById("closeTransferModal");
    const cancelTransfer = document.getElementById("cancelTransfer");
    
    if (newTransferBtn) {
        newTransferBtn.addEventListener("click", () => {
            openModal(transferModal);
        });
    }
    
    if (closeTransferModal) {
        closeTransferModal.addEventListener("click", () => {
            closeModal(transferModal);
        });
    }
    
    if (cancelTransfer) {
        cancelTransfer.addEventListener("click", () => {
            closeModal(transferModal);
        });
    }
    
    // View Dispatch Modal
    const closeViewDispatchModal = document.getElementById("closeViewDispatchModal");
    const backToListBtn = document.getElementById("backToListBtn");
    const viewDispatchModal = document.getElementById("viewDispatchModal");
    
    // Attach event handler to all view buttons
    document.querySelectorAll(".view-btn, .view-card-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const dispatchId = button.getAttribute("data-id");
            if (dispatchId) {
                populateViewDispatchModal(dispatchId);
            }
        });
    });
    
    closeViewDispatchModal.addEventListener("click", () => {
        closeModal(viewDispatchModal);
    });
    
    backToListBtn.addEventListener("click", () => {
        closeModal(viewDispatchModal);
    });
    
    // Edit buttons
    document.querySelectorAll(".edit-btn, .edit-card-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const dispatchId = button.getAttribute("data-id");
            showToast("info", "Edit", `Editing dispatch ${dispatchId}`);
        });
    });
    
    // Delete buttons
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const dispatchId = button.getAttribute("data-id");
            confirmDelete([dispatchId]);
        });
    });
    
    // Confirm Delete Modal
    const confirmDeleteModal = document.getElementById("confirmDeleteModal");
    const closeConfirmModal = document.getElementById("closeConfirmModal");
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    
    closeConfirmModal.addEventListener("click", () => {
        closeModal(confirmDeleteModal);
    });
    
    cancelDeleteBtn.addEventListener("click", () => {
        closeModal(confirmDeleteModal);
    });
    
    confirmDeleteBtn.addEventListener("click", () => {
        // Get IDs to delete
        const ids = JSON.parse(confirmDeleteBtn.getAttribute("data-ids") || "[]");
        
        // Delete the dispatches
        deleteDispatches(ids);
        
        // Close the modal
        closeModal(confirmDeleteModal);
    });
    
    // Add Item Modal
    const addItemModal = document.getElementById("addItemModal");
    const closeAddItemModal = document.getElementById("closeAddItemModal");
    const cancelAddItem = document.getElementById("cancelAddItem");
    const addItemForm = document.getElementById("addItemForm");
    const addItemBtn = document.getElementById("addItemBtn");
    const productSelect = document.getElementById("productSelect");
    
    addItemBtn.addEventListener("click", () => {
        // Load product options
        loadProductOptions(productSelect);
        
        // Open the modal
        openModal(addItemModal);
    });
    
    closeAddItemModal.addEventListener("click", () => {
        closeModal(addItemModal);
    });
    
    cancelAddItem.addEventListener("click", () => {
        closeModal(addItemModal);
    });
    
    // Update available quantity when product is selected
    productSelect.addEventListener("change", updateAvailableQty);
    
    // Add item form submission
    addItemForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addItemToDispatchTable();
    });
    
    // Add transfer item
    const addTransferItemBtn = document.getElementById("addTransferItemBtn");
    
    if (addTransferItemBtn) {
        addTransferItemBtn.addEventListener("click", () => {
            addItemToTransferTable();
        });
    }
    
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
    
    // Form validation and submission
    const dispatchForm = document.getElementById("dispatchForm");
    dispatchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Reset error messages
        document.querySelectorAll(".form-error").forEach((el) => (el.textContent = ""));
        
        // Validate required fields
        let isValid = true;
        
        const salesOrder = document.getElementById("salesOrder");
        if (!salesOrder.value) {
            document.getElementById("salesOrderError").textContent = "Please select a sales order";
            isValid = false;
        }
        
        const dispatchDate = document.getElementById("dispatchDate");
        if (!dispatchDate.value) {
            document.getElementById("dispatchDateError").textContent = "Please select a dispatch date";
            isValid = false;
        }
        
        const warehouse = document.getElementById("warehouse");
        if (!warehouse.value) {
            document.getElementById("warehouseError").textContent = "Please select a warehouse";
            isValid = false;
        }
        
        const deliveryDate = document.getElementById("deliveryDate");
        if (!deliveryDate.value) {
            document.getElementById("deliveryDateError").textContent = "Please select a delivery date";
            isValid = false;
        }
        
        const shippingAddress = document.getElementById("shippingAddress");
        if (!shippingAddress.value) {
            document.getElementById("shippingAddressError").textContent = "Please enter a shipping address";
            isValid = false;
        }
        
        // Check if any items are added
        const itemRows = document.querySelectorAll('#dispatchItemsTable tbody tr:not(#addItemRow)');
        if (itemRows.length === 0) {
            showToast("error", "Validation Error", "Please add at least one item to dispatch.");
            isValid = false;
        }
        
        if (!isValid) {
            // Show error toast
            showToast("error", "Validation Error", "Please fill in all required fields.");
            return;
        }
        
        // Collect form data
        const formData = {
            salesOrder: salesOrder.value,
            dispatchDate: dispatchDate.value,
            warehouse: warehouse.value,
            status: document.getElementById("dispatchStatus").value,
            reference: document.getElementById("dispatchReference").value,
            deliveryDate: deliveryDate.value,
            deliveryTime: document.getElementById("deliveryTime").value,
            shippingAddress: shippingAddress.value,
            contactPerson: document.getElementById("contactPerson").value,
            contactPhone: document.getElementById("contactPhone").value,
            deliveryInstructions: document.getElementById("deliveryInstructions").value,
            notes: document.getElementById("notes").value,
            items: [],
        };
        
        // Collect items data
        itemRows.forEach((row) => {
            const product = row.cells[0].textContent;
            const dispatchQty = row.querySelector(".dispatch-qty").value;
            
            formData.items.push({
                product,
                dispatchQty,
            });
        });
        
        // Show loader
        loader.classList.add("show");
        
        // Simulate API call
        setTimeout(() => {
            // Here you would typically send this data to your backend
            console.log("Dispatch form submitted:", formData);
            
            // Hide loader
            loader.classList.remove("show");
            
            // Close the modal
            closeModal(dispatchModal);
            
            // Show success message
            showToast("success", "Success!", "Dispatch created successfully.");
            
            // Add new row to the table (for demo purposes)
            addNewDispatchRow(formData);
        }, 1000);
    });
    
    // Transfer form submission
    const transferForm = document.getElementById("transferForm");
    
    if (transferForm) {
        transferForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Reset error messages
            document.querySelectorAll(".form-error").forEach((el) => (el.textContent = ""));
            
            // Validate required fields
            let isValid = true;
            
            const fromWarehouse = document.getElementById("fromWarehouse");
            if (!fromWarehouse.value) {
                document.getElementById("fromWarehouseError").textContent = "Please select a source warehouse";
                isValid = false;
            }
            
            const toWarehouse = document.getElementById("toWarehouse");
            if (!toWarehouse.value) {
                document.getElementById("toWarehouseError").textContent = "Please select a destination warehouse";
                isValid = false;
            }
            
            const transferDate = document.getElementById("transferDate");
            if (!transferDate.value) {
                document.getElementById("transferDateError").textContent = "Please select a transfer date";
                isValid = false;
            }
            
            if (fromWarehouse.value === toWarehouse.value && fromWarehouse.value !== "") {
                document.getElementById("toWarehouseError").textContent = "Source and destination warehouses cannot be the same";
                isValid = false;
            }
            
            // Check if any items are added
            const itemRows = document.querySelectorAll('#transferItemsTable tbody tr:not(#addTransferItemRow)');
            if (itemRows.length === 0) {
                showToast("error", "Validation Error", "Please add at least one item to transfer.");
                isValid = false;
            }
            
            if (!isValid) {
                // Show error toast
                showToast("error", "Validation Error", "Please correct the errors in the form.");
                return;
            }
            
            // Collect form data
            const formData = {
                fromWarehouse: fromWarehouse.value,
                toWarehouse: toWarehouse.value,
                transferDate: transferDate.value,
                status: document.getElementById("transferStatus").value,
                notes: document.getElementById("transferNotes").value,
                items: [],
            };
            
            // Collect items data
            itemRows.forEach((row) => {
                if (row.cells.length > 1) {
                    const productSelect = row.querySelector(".product-select");
                    const product = productSelect.options[productSelect.selectedIndex].text;
                    const transferQty = row.querySelector(".transfer-qty").value;
                    
                    formData.items.push({
                        product,
                        transferQty,
                    });
                }
            });
            
            // Show loader
            loader.classList.add("show");
            
            // Simulate API call
            setTimeout(() => {
                // Here you would typically send this data to your backend
                console.log("Transfer form submitted:", formData);
                
                // Hide loader
                loader.classList.remove("show");
                
                // Close the modal
                closeModal(transferModal);
                
                // Show success message
                showToast("success", "Success!", "Stock transfer created successfully.");
            }, 1000);
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener("click", (e) => {
        if (e.target === dispatchModal) {
            closeModal(dispatchModal);
        }
        if (e.target === transferModal) {
            closeModal(transferModal);
        }
        if (e.target === viewDispatchModal) {
            closeModal(viewDispatchModal);
        }
        if (e.target === addItemModal) {
            closeModal(addItemModal);
        }
        if (e.target === confirmDeleteModal) {
            closeModal(confirmDeleteModal);
        }
    });
    
    // Initialize pagination display
    updatePagination();
    updatePagination('card');
});
