/**
 * ERP System - Reports Module
 * JavaScript for Reports functionality
 */

document.addEventListener("DOMContentLoaded", () => {
    // ======================================
    // GLOBAL VARIABLES
    // ======================================
    let sortDirection = {};
    
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
     * Apply sorting to a table
     * @param {string} tableId - ID of the table
     * @param {string} column - Column to sort by
     * @param {boolean} isAscending - Sort direction
     */
    function sortTable(tableId, column, isAscending) {
        const table = document.querySelector(tableId);
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
                
                // Handle numeric columns
                if (column === 'sales' || column === 'revenue' || column === 'profit' || column === 'growth' || 
                    column === 'deals' || column === 'quota' || column === 'achievement') {
                    aVal = parseFloat(aVal.replace(/[^0-9.-]+/g, ''));
                    bVal = parseFloat(bVal.replace(/[^0-9.-]+/g, ''));
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
     * Generate a sample report (simulated)
     * @param {Object} reportConfig - Report configuration
     */
    function generateReport(reportConfig) {
        // In a real app, this would send a request to the server to generate the report
        // For this demo, we'll just simulate a successful report generation
        
        // Show loader
        const loader = document.getElementById("loader");
        loader.classList.add("show");
        
        // Simulate API call
        setTimeout(() => {
            // Log report configuration
            console.log("Generating report with config:", reportConfig);
            
            // Hide loader
            loader.classList.remove("show");
            
            // Show success message
            showToast("success", "Report Generated", "Your report has been generated successfully. It is now available for download or viewing.");
            
            // In a real app, you might redirect to a report viewer or provide a download link
        }, 2000);
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
        showToast("success", "Welcome!", "Reports & Analytics module loaded successfully.");
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
  
    // Generate Report Modal
    const generateReportBtn = document.getElementById("generateReportBtn");
    const generateReportModal = document.getElementById("generateReportModal");
    const closeGenerateReportModal = document.getElementById("closeGenerateReportModal");
    const cancelGenerateReport = document.getElementById("cancelGenerateReport");
  
    // Open generate report modal
    if (generateReportBtn && generateReportModal) {
        generateReportBtn.addEventListener("click", () => {
            // Set default dates for the report
            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            
            document.getElementById("genStartDate").valueAsDate = firstDayOfMonth;
            document.getElementById("genEndDate").valueAsDate = today;
            
            openModal(generateReportModal);
        });
    }
  
    // Close generate report modal
    if (closeGenerateReportModal && generateReportModal) {
        closeGenerateReportModal.addEventListener("click", () => {
            closeModal(generateReportModal);
        });
    }
  
    if (cancelGenerateReport && generateReportModal) {
        cancelGenerateReport.addEventListener("click", () => {
            closeModal(generateReportModal);
        });
    }
  
    // Close modals when clicking outside
    window.addEventListener("click", (e) => {
        if (e.target === generateReportModal) {
            closeModal(generateReportModal);
        }
    });
  
    // Generate Report Form
    const generateReportForm = document.getElementById("generateReportForm");
    if (generateReportForm) {
        generateReportForm.addEventListener("submit", (e) => {
            e.preventDefault();
    
            // Reset error messages
            document.querySelectorAll(".form-error").forEach((el) => (el.textContent = ""));
    
            // Validate required fields
            let isValid = true;
    
            const reportType = document.getElementById("genReportType");
            if (!reportType.value) {
                document.getElementById("genReportTypeError").textContent = "Please select a report type";
                isValid = false;
            }
    
            const startDate = document.getElementById("genStartDate");
            const endDate = document.getElementById("genEndDate");
            
            if (!startDate.value || !endDate.value) {
                document.getElementById("genDateRangeError").textContent = "Please select a date range";
                isValid = false;
            } else if (new Date(startDate.value) > new Date(endDate.value)) {
                document.getElementById("genDateRangeError").textContent = "Start date cannot be after end date";
                isValid = false;
            }
    
            const reportName = document.getElementById("genReportName");
            if (!reportName.value) {
                document.getElementById("genReportNameError").textContent = "Please enter a report name";
                isValid = false;
            }
    
            if (!isValid) {
                // Show error toast
                showToast("error", "Validation Error", "Please fill in all required fields correctly.");
                return;
            }
    
            // Collect form data
            const includeOptions = Array.from(document.querySelectorAll('input[name="include"]:checked')).map(el => el.value);
            
            const formData = {
                reportType: reportType.value,
                reportFormat: document.getElementById("genReportFormat").value,
                startDate: startDate.value,
                endDate: endDate.value,
                include: includeOptions,
                reportName: reportName.value
            };
    
            // Generate the report
            generateReport(formData);
    
            // Close the modal
            closeModal(generateReportModal);
        });
    }
  
    // Filter application
    const applyFiltersBtn = document.getElementById("applyFiltersBtn");
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener("click", () => {
            const reportType = document.getElementById("reportType").value;
            const startDate = document.getElementById("startDate").value;
            const endDate = document.getElementById("endDate").value;
            const comparisonPeriod = document.getElementById("comparisonPeriod").value;
            
            // In a real app, this would apply filters to the reports
            console.log("Applying filters:", { reportType, startDate, endDate, comparisonPeriod });
            
            showToast("info", "Filters Applied", "Report filters have been applied successfully.");
        });
    }
  
    // Reset filters
    const resetFiltersBtn = document.getElementById("resetFiltersBtn");
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener("click", () => {
            // Reset form elements
            document.getElementById("reportType").value = 'all';
            document.getElementById("startDate").value = '';
            document.getElementById("endDate").value = '';
            document.getElementById("comparisonPeriod").value = 'none';
            
            showToast("info", "Filters Reset", "All filters have been cleared.");
        });
    }
  
    // Search functionality
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener("click", () => {
            const searchText = searchInput.value.trim();
            
            if (searchText) {
                // In a real app, this would search for reports
                console.log("Searching for:", searchText);
                
                showToast("info", "Search Results", `Found reports matching "${searchText}"`);
            }
        });
        
        searchInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                searchBtn.click();
            }
        });
    }
  
    // Saved Report Buttons
    const viewReportBtns = document.querySelectorAll(".view-report-btn");
    viewReportBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const reportId = btn.getAttribute("data-id");
            console.log("Viewing saved report:", reportId);
            
            // In a real app, this would load the saved report
            showToast("info", "Loading Report", "Opening the saved report...");
        });
    });
  
    // Sales Report Actions
    const generateSalesReportBtn = document.getElementById("generateSalesReportBtn");
    if (generateSalesReportBtn) {
        generateSalesReportBtn.addEventListener("click", () => {
            const reportType = document.getElementById("salesReportType").value;
            const timeframe = document.getElementById("salesTimeframe").value;
            
            // In a real app, this would generate a sales report
            console.log("Generating sales report:", { reportType, timeframe });
            
            // Show loader
            loader.classList.add("show");
            
            // Simulate API call
            setTimeout(() => {
                // Hide loader
                loader.classList.remove("show");
                
                showToast("success", "Report Updated", "Sales report has been updated successfully.");
            }, 1500);
        });
    }
  
    // Customer Report Actions
    const generateCustomerReportBtn = document.getElementById("generateCustomerReportBtn");
    if (generateCustomerReportBtn) {
        generateCustomerReportBtn.addEventListener("click", () => {
            const reportType = document.getElementById("customerReportType").value;
            const timeframe = document.getElementById("customerTimeframe").value;
            
            // In a real app, this would generate a customer report
            console.log("Generating customer report:", { reportType, timeframe });
            
            // Show loader
            loader.classList.add("show");
            
            // Simulate API call
            setTimeout(() => {
                // Hide loader
                loader.classList.remove("show");
                
                showToast("success", "Report Updated", "Customer report has been updated successfully.");
            }, 1500);
        });
    }
  
    // Inventory Report Actions
    const generateInventoryReportBtn = document.getElementById("generateInventoryReportBtn");
    if (generateInventoryReportBtn) {
        generateInventoryReportBtn.addEventListener("click", () => {
            const reportType = document.getElementById("inventoryReportType").value;
            const warehouse = document.getElementById("inventoryWarehouse").value;
            
            // In a real app, this would generate an inventory report
            console.log("Generating inventory report:", { reportType, warehouse });
            
            // Show loader
            loader.classList.add("show");
            
            // Simulate API call
            setTimeout(() => {
                // Hide loader
                loader.classList.remove("show");
                
                showToast("success", "Report Updated", "Inventory report has been updated successfully.");
            }, 1500);
        });
    }
  
    // Custom Report Builder
    const previewReportBtn = document.getElementById("previewReportBtn");
    const createReportBtn = document.getElementById("createReportBtn");
    
    if (previewReportBtn) {
        previewReportBtn.addEventListener("click", () => {
            // In a real app, this would preview the custom report
            console.log("Previewing custom report");
            
            showToast("info", "Report Preview", "A preview of your custom report is being generated...");
        });
    }
    
    if (createReportBtn) {
        createReportBtn.addEventListener("click", () => {
            const reportName = document.getElementById("reportName").value;
            
            if (!reportName) {
                showToast("error", "Validation Error", "Please enter a name for your report.");
                return;
            }
            
            // In a real app, this would create a custom report
            console.log("Creating custom report:", reportName);
            
            // Show loader
            loader.classList.add("show");
            
            // Simulate API call
            setTimeout(() => {
                // Hide loader
                loader.classList.remove("show");
                
                showToast("success", "Report Created", "Your custom report has been created and saved successfully.");
            }, 2000);
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
            const table = header.closest("table");
            sortTable(`#${table.id}`, column, sortDirection[column]);
        });
    });
  
    // Simulate generating placeholder charts
    // In a real app, this would use a charting library like Chart.js
    function createPlaceholderCharts() {
        const chartElements = document.querySelectorAll(".placeholder-chart");
        chartElements.forEach(chart => {
            const chartId = chart.id;
            const chartType = chartId.toLowerCase().includes('pie') ? 'pie' : 
                             chartId.toLowerCase().includes('bar') ? 'bar' : 'line';
            
            chart.innerHTML = `<div class="chart-placeholder-content">
                <i class="fas fa-chart-${chartType}"></i>
                <span>${chart.textContent.trim()}</span>
                <p class="chart-placeholder-note">Charts would be rendered using a library like Chart.js in a production environment</p>
            </div>`;
        });
    }
  
    // Initialize the application
    function init() {
        // Generate placeholder charts
        createPlaceholderCharts();
        
        // Set default dates for filters
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        const startDateFilter = document.getElementById("startDate");
        const endDateFilter = document.getElementById("endDate");
        
        if (startDateFilter && endDateFilter) {
            startDateFilter.valueAsDate = thirtyDaysAgo;
            endDateFilter.valueAsDate = today;
        }
    }
  
    // Run initialization
    init();
});