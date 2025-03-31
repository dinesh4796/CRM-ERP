document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    initTabs();
    
    // Initialize charts
    initCharts();
    
    // Populate sales table
    populateSalesTable();
    
    // Initialize analytics charts
    initAnalyticsCharts();
    
    // Initialize reports functionality
    initReports();
    
    // Initialize team functionality
    initTeam();
    
    // Initialize date range functionality
    initDateRange();
});

// Tab functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Format number in Indian currency format (lakhs and crores)
function formatIndianCurrency(num) {
    const value = num.toString();
    let lastThree = value.substring(value.length - 3);
    let otherNumbers = value.substring(0, value.length - 3);
    if (otherNumbers !== '') {
        lastThree = ',' + lastThree;
    }
    let result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return '₹' + result;
}

// Chart initialization
function initCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Revenue',
                    data: [1400000, 1700000, 1500000, 1850000, 2100000, 2500000, 2400000, 2800000, 3000000, 2900000, 3250000, 3500000],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Target',
                    data: [1500000, 1700000, 1900000, 2000000, 2200000, 2300000, 2500000, 2600000, 2800000, 3000000, 3100000, 3300000],
                    borderColor: 'rgba(107, 114, 128, 0.5)',
                    borderDash: [5, 5],
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                // Format in Indian currency
                                const value = context.parsed.y;
                                if (value >= 10000000) {
                                    label += '₹' + (value / 10000000).toFixed(2) + ' Cr';
                                } else if (value >= 100000) {
                                    label += '₹' + (value / 100000).toFixed(2) + ' Lakh';
                                } else {
                                    label += formatIndianCurrency(value);
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            if (value >= 10000000) {
                                return '₹' + (value / 10000000).toFixed(1) + ' Cr';
                            } else if (value >= 100000) {
                                return '₹' + (value / 100000).toFixed(1) + ' L';
                            } else if (value >= 1000) {
                                return '₹' + (value / 1000).toFixed(1) + ' K';
                            }
                            return '₹' + value;
                        }
                    }
                }
            }
        }
    });
    
    // Region Chart
    const regionCtx = document.getElementById('regionChart').getContext('2d');
    const regionChart = new Chart(regionCtx, {
        type: 'pie',
        data: {
            labels: ['North India', 'South India', 'West India', 'East India', 'Central India'],
            datasets: [
                {
                    data: [42, 23, 18, 12, 5],
                    backgroundColor: [
                        '#4f46e5',
                        '#6366f1',
                        '#818cf8',
                        '#a5b4fc',
                        '#c7d2fe'
                    ],
                    borderWidth: 1,
                    borderColor: '#ffffff'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw;
                            return `${label}: ${value}%`;
                        }
                    }
                }
            }
        }
    });
    
    // Funnel Chart
    const funnelCtx = document.getElementById('funnelChart').getContext('2d');
    const funnelChart = new Chart(funnelCtx, {
        type: 'bar',
        data: {
            labels: ['Leads', 'Qualified', 'Proposals', 'Negotiations', 'Closed'],
            datasets: [
                {
                    axis: 'y',
                    data: [1200, 850, 620, 420, 280],
                    backgroundColor: [
                        'rgba(79, 70, 229, 0.2)',
                        'rgba(79, 70, 229, 0.4)',
                        'rgba(79, 70, 229, 0.6)',
                        'rgba(79, 70, 229, 0.8)',
                        'rgba(79, 70, 229, 1)'
                    ],
                    borderWidth: 1,
                    borderColor: '#ffffff'
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            return `Count: ${value}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Populate sales table
function populateSalesTable() {
    const salesData = [
        {
            id: 'INV001',
            customer: 'Reliance Industries',
            amount: '₹9,75,000.00',
            date: '2023-10-15',
            status: 'completed'
        },
        {
            id: 'INV002',
            customer: 'Tata Consultancy',
            amount: '₹6,85,000.00',
            date: '2023-10-12',
            status: 'processing'
        },
        {
            id: 'INV003',
            customer: 'Infosys Limited',
            amount: '₹17,50,000.00',
            date: '2023-10-10',
            status: 'completed'
        },
        {
            id: 'INV004',
            customer: 'Wipro Technologies',
            amount: '₹11,25,000.00',
            date: '2023-10-08',
            status: 'pending'
        },
        {
            id: 'INV005',
            customer: 'Mahindra Group',
            amount: '₹5,60,000.00',
            date: '2023-10-05',
            status: 'completed'
        }
    ];
    
    const tableBody = document.getElementById('salesTableBody');
    
    salesData.forEach(sale => {
        const row = document.createElement('tr');
        
        // Invoice
        const idCell = document.createElement('td');
        idCell.textContent = sale.id;
        idCell.style.fontWeight = '500';
        row.appendChild(idCell);
        
        // Customer
        const customerCell = document.createElement('td');
        customerCell.textContent = sale.customer;
        row.appendChild(customerCell);
        
        // Amount
        const amountCell = document.createElement('td');
        amountCell.textContent = sale.amount;
        row.appendChild(amountCell);
        
        // Date
        const dateCell = document.createElement('td');
        dateCell.textContent = sale.date;
        row.appendChild(dateCell);
        
        // Status
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.textContent = sale.status;
        statusBadge.classList.add('status-badge', `status-${sale.status}`);
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);
        
        tableBody.appendChild(row);
    });
}

// Initialize Analytics Charts
function initAnalyticsCharts() {
    // Product Category Chart
    const productCategoryCtx = document.getElementById('productCategoryChart')?.getContext('2d');
    if (productCategoryCtx) {
        const productCategoryChart = new Chart(productCategoryCtx, {
            type: 'bar',
            data: {
                labels: ['Software', 'Hardware', 'Services', 'Consulting', 'Training'],
                datasets: [
                    {
                        label: 'Revenue',
                        data: [8500000, 5200000, 7300000, 4100000, 2800000],
                        backgroundColor: '#4f46e5',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    const value = context.parsed.y;
                                    if (value >= 10000000) {
                                        label += '₹' + (value / 10000000).toFixed(2) + ' Cr';
                                    } else if (value >= 100000) {
                                        label += '₹' + (value / 100000).toFixed(2) + ' Lakh';
                                    } else {
                                        label += formatIndianCurrency(value);
                                    }
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                if (value >= 10000000) {
                                    return '₹' + (value / 10000000).toFixed(1) + ' Cr';
                                } else if (value >= 100000) {
                                    return '₹' + (value / 100000).toFixed(1) + ' L';
                                }
                                return '₹' + value;
                            }
                        }
                    }
                }
            }
        });
    }

    // Customer Acquisition Chart
    const acquisitionCtx = document.getElementById('acquisitionChart')?.getContext('2d');
    if (acquisitionCtx) {
        const acquisitionChart = new Chart(acquisitionCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'New Customers',
                        data: [120, 150, 180, 210, 250, 280, 310, 350, 390, 420, 450, 480],
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        yAxisID: 'y',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Acquisition Cost (₹)',
                        data: [15000, 14500, 14000, 13800, 13500, 13200, 13000, 12800, 12500, 12300, 12000, 11800],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        yAxisID: 'y1',
                        tension: 0.3,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'New Customers'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Acquisition Cost (₹)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }

    // Sales Cycle Chart
    const salesCycleCtx = document.getElementById('salesCycleChart')?.getContext('2d');
    if (salesCycleCtx) {
        const salesCycleChart = new Chart(salesCycleCtx, {
            type: 'bar',
            data: {
                labels: ['Small (<₹5L)', 'Medium (₹5L-₹20L)', 'Large (₹20L-₹50L)', 'Enterprise (>₹50L)'],
                datasets: [
                    {
                        label: 'Days to Close',
                        data: [15, 30, 45, 60],
                        backgroundColor: [
                            'rgba(79, 70, 229, 0.3)',
                            'rgba(79, 70, 229, 0.5)',
                            'rgba(79, 70, 229, 0.7)',
                            'rgba(79, 70, 229, 0.9)'
                        ],
                        borderColor: '#4f46e5',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Average Days to Close'
                        }
                    }
                }
            }
        });
    }

    // Retention Chart
    const retentionCtx = document.getElementById('retentionChart')?.getContext('2d');
    if (retentionCtx) {
        const retentionChart = new Chart(retentionCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Retention Rate (%)',
                        data: [92, 91, 93, 92, 94, 95, 94, 93, 95, 96, 95, 97],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Retention: ${context.parsed.y}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        min: 80,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Retention Rate (%)'
                        }
                    }
                }
            }
        });
    }

    // Team Performance Chart
    const teamPerformanceCtx = document.getElementById('teamPerformanceChart')?.getContext('2d');
    if (teamPerformanceCtx) {
        const teamPerformanceChart = new Chart(teamPerformanceCtx, {
            type: 'radar',
            data: {
                labels: ['Sales Volume', 'Deal Closure Rate', 'Customer Satisfaction', 'Upselling', 'Lead Generation', 'Retention'],
                datasets: [
                    {
                        label: 'Current Performance',
                        data: [85, 78, 90, 75, 82, 88],
                        backgroundColor: 'rgba(79, 70, 229, 0.2)',
                        borderColor: '#4f46e5',
                        pointBackgroundColor: '#4f46e5',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#4f46e5'
                    },
                    {
                        label: 'Target',
                        data: [90, 85, 95, 85, 90, 95],
                        backgroundColor: 'rgba(107, 114, 128, 0.2)',
                        borderColor: '#6b7280',
                        pointBackgroundColor: '#6b7280',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#6b7280',
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 50,
                        suggestedMax: 100
                    }
                }
            }
        });
    }
}

// Initialize Reports functionality
function initReports() {
    // Sample saved reports data
    const savedReports = [
        {
            name: 'Monthly Sales Report - October 2023',
            type: 'Sales Report',
            date: '2023-10-31',
            format: 'PDF'
        },
        {
            name: 'Q3 Revenue Analysis',
            type: 'Revenue Report',
            date: '2023-10-15',
            format: 'Excel'
        },
        {
            name: 'Product Performance - Software Category',
            type: 'Product Performance',
            date: '2023-10-10',
            format: 'PDF'
        },
        {
            name: 'Team Performance - Q3 2023',
            type: 'Team Performance',
            date: '2023-10-05',
            format: 'PDF'
        },
        {
            name: 'Customer Acquisition Analysis',
            type: 'Customer Analysis',
            date: '2023-09-30',
            format: 'CSV'
        }
    ];

    // Populate saved reports table
    const savedReportsTable = document.getElementById('savedReportsTable');
    if (savedReportsTable) {
        savedReports.forEach(report => {
            const row = document.createElement('tr');
            
            // Report Name
            const nameCell = document.createElement('td');
            nameCell.textContent = report.name;
            nameCell.style.fontWeight = '500';
            row.appendChild(nameCell);
            
            // Type
            const typeCell = document.createElement('td');
            typeCell.textContent = report.type;
            row.appendChild(typeCell);
            
            // Date
            const dateCell = document.createElement('td');
            dateCell.textContent = report.date;
            row.appendChild(dateCell);
            
            // Format
            const formatCell = document.createElement('td');
            formatCell.textContent = report.format;
            row.appendChild(formatCell);
            
            // Actions
            const actionsCell = document.createElement('td');
            const viewBtn = document.createElement('button');
            viewBtn.textContent = 'View';
            viewBtn.classList.add('action-btn');
            viewBtn.addEventListener('click', () => showReportPreview(report));
            
            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = 'Download';
            downloadBtn.classList.add('action-btn');
            downloadBtn.addEventListener('click', () => downloadReport(report));
            
            actionsCell.appendChild(viewBtn);
            actionsCell.appendChild(downloadBtn);
            row.appendChild(actionsCell);
            
            savedReportsTable.appendChild(row);
        });
    }

    // Generate report button functionality
    const generateReportBtn = document.getElementById('generate-report');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }
}

// Show report preview
function showReportPreview(report) {
    const previewElement = document.getElementById('report-preview');
    const subtitleElement = document.getElementById('report-preview-subtitle');
    
    if (previewElement && subtitleElement) {
        subtitleElement.textContent = `Preview of ${report.name}`;
        
        // Create a sample report preview based on the report type
        let previewContent = '';
        
        switch(report.type) {
            case 'Sales Report':
                previewContent = `
                    <h3>Monthly Sales Report - October 2023</h3>
                    <p>Generated on: ${report.date}</p>
                    <div class="report-section">
                        <h4>Executive Summary</h4>
                        <p>Total Sales: ₹35,18,542.50</p>
                        <p>Growth: +20.1% from previous month</p>
                        <p>Top Performing Region: North India (42%)</p>
                    </div>
                    <div class="report-section">
                        <h4>Sales Breakdown</h4>
                        <table class="report-table">
                            <tr>
                                <th>Product Category</th>
                                <th>Revenue</th>
                                <th>% of Total</th>
                            </tr>
                            <tr>
                                <td>Software</td>
                                <td>₹8,50,000</td>
                                <td>24.2%</td>
                            </tr>
                            <tr>
                                <td>Hardware</td>
                                <td>₹5,20,000</td>
                                <td>14.8%</td>
                            </tr>
                            <tr>
                                <td>Services</td>
                                <td>₹7,30,000</td>
                                <td>20.7%</td>
                            </tr>
                            <tr>
                                <td>Consulting</td>
                                <td>₹4,10,000</td>
                                <td>11.7%</td>
                            </tr>
                            <tr>
                                <td>Training</td>
                                <td>₹2,80,000</td>
                                <td>8.0%</td>
                            </tr>
                        </table>
                    </div>
                `;
                break;
                
            case 'Revenue Report':
                previewContent = `
                    <h3>Q3 Revenue Analysis</h3>
                    <p>Generated on: ${report.date}</p>
                    <div class="report-section">
                        <h4>Quarterly Overview</h4>
                        <p>Q3 Total Revenue: ₹98,75,000</p>
                        <p>Q2 Total Revenue: ₹85,20,000</p>
                        <p>Growth: +15.9%</p>
                    </div>
                    <div class="report-section">
                        <h4>Monthly Breakdown</h4>
                        <table class="report-table">
                            <tr>
                                <th>Month</th>
                                <th>Revenue</th>
                                <th>Target</th>
                                <th>Variance</th>
                            </tr>
                            
                            <tr>
                                <td>July</td>
                                <td>₹30,25,000</td>
                                <td>₹28,00,000</td>
                                <td>+8.0%</td>
                            </tr>

                            <tr>
                                <td>August</td>
                                <td>₹32,50,000</td>
                                <td>₹30,00,000</td>
                                <td>+8.3%</td>
                            </tr>

                            <tr>
                                <td>September</td>
                                <td>₹36,00,000</td>
                                <td>₹35,00,000</td>
                                <td>+2.9%</td>
                            </tr>
                        </table>
                    </div>
                `;
                break;
                
            default:
                previewContent = `<p>Preview for ${report.name} is not available.</p>`;
        }
        
        previewElement.innerHTML = previewContent;
    }
}

// Download report (simulated)
function downloadReport(report) {
    alert(`Downloading ${report.name} in ${report.format} format...`);
    // In a real application, this would trigger a download of the actual report file
}

// Generate new report (simulated)
function generateReport() {
    const reportType = document.getElementById('report-type').value;
    const reportPeriod = document.getElementById('report-period').value;
    const reportFormat = document.getElementById('report-format').value;
    
    // Show a confirmation message
    alert(`Generating ${reportPeriod} ${reportType} in ${reportFormat.toUpperCase()} format...`);
    
    // In a real application, this would trigger the report generation process
    // and either show the report or provide a download link
    
    // For demo purposes, show a sample report preview
    const sampleReport = {
        name: `${reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)} ${reportType} - Generated`,
        type: reportType,
        date: new Date().toISOString().split('T')[0],
        format: reportFormat.toUpperCase()
    };
    
    showReportPreview(sampleReport);
}

// Initialize Team functionality
function initTeam() {
    // Sample team members data
    const teamMembers = [
        {
            name: 'Rahul Sharma',
            role: 'Sales Director',
            avatar: 'RS',
            sales: '₹1.2 Cr',
            deals: 45,
            quota: '115%'
        },
        {
            name: 'Priya Patel',
            role: 'Senior Account Executive',
            avatar: 'PP',
            sales: '₹95.5 L',
            deals: 38,
            quota: '105%'
        },
        {
            name: 'Amit Kumar',
            role: 'Account Executive',
            avatar: 'AK',
            sales: '₹82.3 L',
            deals: 35,
            quota: '98%'
        },
        {
            name: 'Neha Singh',
            role: 'Account Executive',
            avatar: 'NS',
            sales: '₹78.6 L',
            deals: 32,
            quota: '95%'
        },
        {
            name: 'Vikram Reddy',
            role: 'Account Executive',
            avatar: 'VR',
            sales: '₹75.2 L',
            deals: 30,
            quota: '92%'
        },
        {
            name: 'Deepa Gupta',
            role: 'Sales Development Rep',
            avatar: 'DG',
            sales: '₹45.8 L',
            deals: 25,
            quota: '88%'
        }
    ];

    // Populate team members
    const teamMembersContainer = document.getElementById('teamMembersContainer');
    if (teamMembersContainer) {
        teamMembers.forEach(member => {
            const memberElement = document.createElement('div');
            memberElement.classList.add('team-member');
            
            const avatar = document.createElement('div');
            avatar.classList.add('member-avatar');
            avatar.textContent = member.avatar;
            
            const info = document.createElement('div');
            info.classList.add('member-info');
            
            const name = document.createElement('div');
            name.classList.add('member-name');
            name.textContent = member.name;
            
            const role = document.createElement('div');
            role.classList.add('member-role');
            role.textContent = member.role;
            
            const stats = document.createElement('div');
            stats.classList.add('member-stats');
            
            const salesStat = document.createElement('div');
            salesStat.classList.add('member-stat');
            salesStat.innerHTML = `<span class="member-stat-value">${member.sales}</span> Sales`;
            
            const dealsStat = document.createElement('div');
            dealsStat.classList.add('member-stat');
            dealsStat.innerHTML = `<span class="member-stat-value">${member.deals}</span> Deals`;
            
            const quotaStat = document.createElement('div');
            quotaStat.classList.add('member-stat');
            quotaStat.innerHTML = `<span class="member-stat-value">${member.quota}</span> Quota`;
            
            stats.appendChild(salesStat);
            stats.appendChild(dealsStat);
            stats.appendChild(quotaStat);
            
            info.appendChild(name);
            info.appendChild(role);
            info.appendChild(stats);
            
            memberElement.appendChild(avatar);
            memberElement.appendChild(info);
            
            teamMembersContainer.appendChild(memberElement);
        });
    }

    // Populate leaderboard
    const leaderboardTableBody = document.getElementById('leaderboardTableBody');
    if (leaderboardTableBody) {
        teamMembers.sort((a, b) => {
            // Extract numeric values from sales strings for comparison
            const aValue = parseFloat(a.sales.replace('₹', '').replace(' Cr', '00').replace(' L', ''));
            const bValue = parseFloat(b.sales.replace('₹', '').replace(' Cr', '00').replace(' L', ''));
            return bValue - aValue; // Sort in descending order
        });
        
        teamMembers.forEach((member, index) => {
            const row = document.createElement('tr');
            
            // Rank
            const rankCell = document.createElement('td');
            rankCell.textContent = index + 1;
            row.appendChild(rankCell);
            
            // Representative
            const repCell = document.createElement('td');
            repCell.textContent = member.name;
            row.appendChild(repCell);
            
            // Sales
            const salesCell = document.createElement('td');
            salesCell.textContent = member.sales;
            row.appendChild(salesCell);
            
            // Deals Closed
            const dealsCell = document.createElement('td');
            dealsCell.textContent = member.deals;
            row.appendChild(dealsCell);
            
            // Quota Attainment
            const quotaCell = document.createElement('td');
            quotaCell.textContent = member.quota;
            row.appendChild(quotaCell);
            
            leaderboardTableBody.appendChild(row);
        });
    }
}

// // Date range functionality
// function initDateRange() {
//     document.getElementById('apply-date').addEventListener('click', function() {
//         const startDate = document.getElementById('start-date').value;
//         const endDate = document.getElementById('end-date').value;
        
//         // In a real application, you would fetch new data based on these dates
//         alert(`Date range applied: ${startDate} to ${endDate}`);
        
//         // Here you would typically refresh your charts and tables with new data
//     });
// }
// // Listen for click event to generate the report
// document.getElementById('generate-report').addEventListener('click', function() {
//     const reportType = document.getElementById('report-type').value;
//     const reportPeriod = document.getElementById('report-period').value;
//     const reportFormat = document.getElementById('report-format').value;

//     const reportName = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report for ${reportPeriod}`;

//     // Get today's date in a readable format
//     const today = new Date().toLocaleDateString();

//     // Save the report (you can replace this with an API call to save the report data on the server)
//     const report = {
//         name: reportName,
//         type: reportType,
//         generatedOn: today,
//         format: reportFormat,
//     };

//     // Add the report to the saved reports table
//     addReportToTable(report);
// });

// // Function to add the report to the table
// function addReportToTable(report) {
//     const tableBody = document.getElementById('savedReportsTable');
    
//     const row = document.createElement('tr');
    
//     row.innerHTML = `
//         <td>${report.name}</td>
//         <td>${report.type}</td>
//         <td>${report.generatedOn}</td>
//         <td>${report.format}</td>
//         <td>
//             <button class="btn btn-info btn-sm" onclick="viewReportPreview('${report.name}')">View</button>
//             <button class="btn btn-danger btn-sm" onclick="deleteReport(this)">Delete</button>
//             <button class="btn btn-success btn-sm" onclick="downloadReport('${report.name}', '${report.format}')">Download</button>
//         </td>
//     `;
    
//     tableBody.appendChild(row);
// }

// // Function to view report preview
// function viewReportPreview(reportName) {
//     // Display the report preview content for the selected report
//     document.getElementById('report-preview-subtitle').innerText = `Previewing: ${reportName}`;
//     document.getElementById('report-preview').innerHTML = `<p>Content of the ${reportName} goes here...</p>`;
// }

// // Function to delete a report from the table
// function deleteReport(button) {
//     const row = button.closest('tr');
//     row.remove();
// }

// // Function to download the report (stub implementation)
// function downloadReport(reportName, format) {
//     alert(`Downloading the ${reportName} in ${format} format.`);
//     // Here you can implement actual download logic depending on your backend
// }
