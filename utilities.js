// // Sample Data
// let events = [
//     {
//         id: 1,
//         title: "Client Meeting - ABC Corp",
//         type: "meeting",
//         date: "2025-03-15",
//         startTime: "10:00",
//         endTime: "11:30",
//         description: "Discuss new project requirements",
//         participants: ["john.doe", "jane.smith"]
//     },
//     {
//         id: 2,
//         title: "Follow-up with XYZ Inc",
//         type: "followup",
//         date: "2025-03-16",
//         startTime: "14:00",
//         endTime: "14:30",
//         description: "Check on proposal status",
//         participants: ["mike.johnson"]
//     },
//     {
//         id: 3,
//         title: "Project Alpha Deadline",
//         type: "deadline",
//         date: "2025-03-20",
//         startTime: "17:00",
//         endTime: "17:00",
//         description: "Final deliverables due",
//         participants: ["john.doe", "jane.smith", "mike.johnson"]
//     },
//     {
//         id: 4,
//         title: "Team Meeting",
//         type: "meeting",
//         date: "2025-03-17",
//         startTime: "09:00",
//         endTime: "10:00",
//         description: "Weekly progress update",
//         participants: ["john.doe", "jane.smith", "mike.johnson", "sarah.williams"]
//     },
//     {
//         id: 5,
//         title: "Client Proposal Due",
//         type: "deadline",
//         date: "2025-03-22",
//         startTime: "12:00",
//         endTime: "12:00",
//         description: "Submit proposal to Global Industries",
//         participants: ["jane.smith"]
//     }
// ];

// let logs = [
//     {
//         id: 1,
//         timestamp: "2025-03-23T08:45:12",
//         user: "john.doe",
//         type: "login",
//         action: "User login",
//         details: "Successful login from 192.168.1.105"
//     },
//     {
//         id: 2,
//         timestamp: "2025-03-23T09:12:34",
//         user: "jane.smith",
//         type: "data",
//         action: "Customer updated",
//         details: "Updated contact information for ABC Corp"
//     },
//     {
//         id: 3,
//         timestamp: "2025-03-23T10:05:22",
//         user: "admin",
//         type: "system",
//         action: "System backup",
//         details: "Automated daily backup completed successfully"
//     },
//     {
//         id: 4,
//         timestamp: "2025-03-23T11:30:45",
//         user: "mike.johnson",
//         type: "report",
//         action: "Report generated",
//         details: "Generated Q1 Sales Report"
//     },
//     {
//         id: 5,
//         timestamp: "2025-03-23T13:15:08",
//         user: "jane.smith",
//         type: "export",
//         action: "Data exported",
//         details: "Exported customer list to CSV"
//     },
//     {
//         id: 6,
//         timestamp: "2025-03-23T14:22:51",
//         user: "john.doe",
//         type: "data",
//         action: "Invoice created",
//         details: "Created invoice #INV-2025-103 for XYZ Inc"
//     },
//     {
//         id: 7,
//         timestamp: "2025-03-23T15:40:19",
//         user: "admin",
//         type: "system",
//         action: "User added",
//         details: "Added new user: david.brown@example.com"
//     },
//     {
//         id: 8,
//         timestamp: "2025-03-23T16:05:33",
//         user: "mike.johnson",
//         type: "login",
//         action: "User logout",
//         details: "User session ended"
//     }
// ];

// let announcements = [
//     {
//         id: 1,
//         title: "Company Meeting Next Week",
//         content: "Please be informed that we will have our quarterly company meeting next Friday at 3:00 PM in the main conference room. Attendance is mandatory for all employees.",
//         author: "John Smith",
//         date: "2025-03-20",
//         priority: "normal"
//     },
//     {
//         id: 2,
//         title: "New CRM Features Released",
//         content: "We're excited to announce that we've released several new features to our CRM system, including improved calendar integration, enhanced reporting capabilities, and a streamlined user interface. Check out the 'What's New' section for more details.",
//         author: "Development Team",
//         date: "2025-03-18",
//         priority: "important"
//     },
//     {
//         id: 3,
//         title: "System Maintenance Notice",
//         content: "The CRM system will be undergoing scheduled maintenance this Saturday from 10:00 PM to 2:00 AM. During this time, the system may be unavailable or experience intermittent issues. Please plan your work accordingly.",
//         author: "IT Department",
//         date: "2025-03-15",
//         priority: "urgent"
//     }
// ];

// let roles = [
//     {
//         id: 1,
//         name: "Administrator",
//         description: "Full system access with all permissions"
//     },
//     {
//         id: 2,
//         name: "Manager",
//         description: "Access to manage teams, customers, and reports"
//     },
//     {
//         id: 3,
//         name: "Sales Representative",
//         description: "Access to customer data and sales tools"
//     },
//     {
//         id: 4,
//         name: "Support Agent",
//         description: "Access to customer support features"
//     },
//     {
//         id: 5,
//         name: "Read-Only User",
//         description: "View-only access to system data"
//     }
// ];

// // Initialize the application
// document.addEventListener('DOMContentLoaded', function() {
//     setupEventListeners();
//     renderCalendar();
//     renderLogs();
//     renderAnnouncements();
//     renderRoles();
//     setupExportFields();
// });

// // Current date for calendar
// let currentDate = new Date();
// let currentView = 'month';

// // Setup Event Listeners
// function setupEventListeners() {
//     // Navigation Tabs
//     const navTabs = document.querySelectorAll('.crm-nav-tab');
//     const sections = document.querySelectorAll('.crm-section');
    
//     navTabs.forEach(tab => {
//         tab.addEventListener('click', () => {
//             // Update active tab
//             navTabs.forEach(t => t.classList.remove('active'));
//             tab.classList.add('active');
            
//             // Show corresponding section
//             const tabId = tab.getAttribute('data-tab');
//             sections.forEach(section => {
//                 section.classList.add('crm-hidden');
//                 if (section.id === tabId + '-section') {
//                     section.classList.remove('crm-hidden');
//                 }
//             });
//         });
//     });

//     // Calendar Navigation
//     const prevBtn = document.getElementById('prevBtn');
//     const nextBtn = document.getElementById('nextBtn');
//     const todayBtn = document.getElementById('todayBtn');
    
//     prevBtn.addEventListener('click', () => {
//         if (currentView === 'month') {
//             currentDate.setMonth(currentDate.getMonth() - 1);
//         } else if (currentView === 'week') {
//             currentDate.setDate(currentDate.getDate() - 7);
//         } else if (currentView === 'day') {
//             currentDate.setDate(currentDate.getDate() - 1);
//         }
//         renderCalendar();
//     });

//     nextBtn.addEventListener('click', () => {
//         if (currentView === 'month') {
//             currentDate.setMonth(currentDate.getMonth() + 1);
//         } else if (currentView === 'week') {
//             currentDate.setDate(currentDate.getDate() + 7);
//         } else if (currentView === 'day') {
//             currentDate.setDate(currentDate.getDate() + 1);
//         }
//         renderCalendar();
//     });

//     todayBtn.addEventListener('click', () => {
//         currentDate = new Date();
//         renderCalendar();
//     });

//     // Calendar View Buttons
//     const viewButtons = document.querySelectorAll('[data-view]');
//     viewButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             const view = button.getAttribute('data-view');
//             currentView = view;
            
//             // Update active button
//             viewButtons.forEach(btn => {
//                 btn.classList.remove('crm-btn-primary');
//                 btn.classList.add('crm-btn-outline');
//             });
//             button.classList.remove('crm-btn-outline');
//             button.classList.add('crm-btn-primary');
            
//             // Show corresponding view
//             document.getElementById('monthView').classList.add('crm-hidden');
//             document.getElementById('weekView').classList.add('crm-hidden');
//             document.getElementById('dayView').classList.add('crm-hidden');
            
//             document.getElementById(view + 'View').classList.remove('crm-hidden');
            
//             renderCalendar();
//         });
//     });

//     // Modal Open Buttons
//     const addEventBtn = document.getElementById('addEventBtn');
//     const addAnnouncementBtn = document.getElementById('addAnnouncementBtn');
//     const addRoleBtn = document.getElementById('addRoleBtn');
    
//     addEventBtn.addEventListener('click', () => openModal('addEventModal'));
//     addAnnouncementBtn.addEventListener('click', () => openModal('addAnnouncementModal'));
//     addRoleBtn.addEventListener('click', () => openModal('addRoleModal'));

//     // Modal Close Buttons
//     const modalCloseButtons = document.querySelectorAll('[data-dismiss="modal"]');
//     modalCloseButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             const modal = button.closest('.crm-modal-backdrop');
//             closeModal(modal);
//         });
//     });

//     // Close modal when clicking outside
//     const modals = document.querySelectorAll('.crm-modal-backdrop');
//     modals.forEach(modal => {
//         modal.addEventListener('click', (e) => {
//             if (e.target === modal) {
//                 closeModal(modal);
//             }
//         });
//     });

//     // Form Submissions
//     const submitEventBtn = document.getElementById('submitEventBtn');
//     const submitAnnouncementBtn = document.getElementById('submitAnnouncementBtn');
//     const submitRoleBtn = document.getElementById('submitRoleBtn');
    
//     submitEventBtn.addEventListener('click', addEvent);
//     submitAnnouncementBtn.addEventListener('click', addAnnouncement);
//     submitRoleBtn.addEventListener('click', addRole);
    
//     // Logs Filtering
//     const logTypeFilter = document.getElementById('logTypeFilter');
//     const logUserFilter = document.getElementById('logUserFilter');
//     const logStartDate = document.getElementById('logStartDate');
//     const logEndDate = document.getElementById('logEndDate');
//     const logSearch = document.getElementById('logSearch');
//     const refreshLogsBtn = document.getElementById('refreshLogsBtn');
    
//     logTypeFilter.addEventListener('change', renderLogs);
//     logUserFilter.addEventListener('change', renderLogs);
//     logStartDate.addEventListener('change', renderLogs);
//     logEndDate.addEventListener('change', renderLogs);
//     logSearch.addEventListener('input', renderLogs);
//     refreshLogsBtn.addEventListener('click', renderLogs);
    
//     // Save Permissions
//     const savePermissionsBtn = document.getElementById('savePermissionsBtn');
//     savePermissionsBtn.addEventListener('click', savePermissions);
// }

// // Modal Functions
// function openModal(modalId) {
//     document.getElementById(modalId).classList.add('show');
//     document.body.style.overflow = 'hidden';
    
//     // Set current date as default for event date
//     if (modalId === 'addEventModal') {
//         const today = currentDate.toISOString().split('T')[0];
//         document.getElementById('eventDate').value = today;
//     }
// }

// function closeModal(modal) {
//     modal.classList.remove('show');
//     document.body.style.overflow = '';
    
//     // Reset forms
//     if (modal.id === 'addEventModal') {
//         document.getElementById('addEventForm').reset();
//     } else if (modal.id === 'addAnnouncementModal') {
//         document.getElementById('addAnnouncementForm').reset();
//     } else if (modal.id === 'addRoleModal') {
//         document.getElementById('addRoleForm').reset();
//     }
// }

// // Calendar Functions
// function renderCalendar() {
//     updateCalendarTitle();
    
//     if (currentView === 'month') {
//         renderMonthView();
//     } else if (currentView === 'week') {
//         renderWeekView();
//     } else if (currentView === 'day') {
//         renderDayView();
//     }
// }

// function updateCalendarTitle() {
//     const calendarTitle = document.getElementById('calendarTitle');
//     const options = { month: 'long', year: 'numeric' };
    
//     if (currentView === 'day') {
//         options.day = 'numeric';
//     } else if (currentView === 'week') {
//         const weekStart = new Date(currentDate);
//         weekStart.setDate(currentDate.getDate() - currentDate.getDay());
//         const weekEnd = new Date(weekStart);
//         weekEnd.setDate(weekStart.getDate() + 6);
        
//         const monthStart = weekStart.toLocaleDateString('en-US', { month: 'short' });
//         const monthEnd = weekEnd.toLocaleDateString('en-US', { month: 'short' });
//         const yearStart = weekStart.toLocaleDateString('en-US', { year: 'numeric' });
//         const yearEnd = weekEnd.toLocaleDateString('en-US', { year: 'numeric' });
        
//         if (monthStart === monthEnd && yearStart === yearEnd) {
//             calendarTitle.textContent = `${monthStart} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${yearStart}`;
//         } else if (yearStart === yearEnd) {
//             calendarTitle.textContent = `${monthStart} ${weekStart.getDate()} - ${monthEnd} ${weekEnd.getDate()}, ${yearStart}`;
//         } else {
//             calendarTitle.textContent = `${monthStart} ${weekStart.getDate()}, ${yearStart} - ${monthEnd} ${weekEnd.getDate()}, ${yearEnd}`;
//         }
        
//         return;
//     }
    
//     calendarTitle.textContent = currentDate.toLocaleDateString('en-US', options);
// }

// function renderMonthView() {
//     const calendarGrid = document.querySelector('.crm-calendar-grid');
    
//     // Clear previous days
//     const existingDays = calendarGrid.querySelectorAll('.crm-calendar-day');
//     existingDays.forEach(day => day.remove());
    
//     // Get first day of month
//     const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//     const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
//     // Get day of week for first day (0 = Sunday, 6 = Saturday)
//     const firstDayOfWeek = firstDay.getDay();
    
//     // Get days from previous month
//     const prevMonthDays = firstDayOfWeek;
//     const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    
//     // Add days from previous month
//     for (let i = prevMonthDays - 1; i >= 0; i--) {
//         const day = document.createElement('div');
//         day.className = 'crm-calendar-day crm-calendar-day-other-month';
        
//         const dayNumber = prevMonth.getDate() - i;
//         const dayDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), dayNumber);
        
//         day.innerHTML = `<div class="crm-calendar-day-number">${dayNumber}</div>`;
        
//         // Add events for this day
//         addEventsToDay(day, dayDate);
        
//         calendarGrid.appendChild(day);
//     }
    
//     // Add days for current month
//     for (let i = 1; i <= lastDay.getDate(); i++) {
//         const day = document.createElement('div');
//         day.className = 'crm-calendar-day';
        
//         const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        
//         // Check if this is today
//         const today = new Date();
//         if (dayDate.getDate() === today.getDate() && 
//             dayDate.getMonth() === today.getMonth() && 
//             dayDate.getFullYear() === today.getFullYear()) {
//             day.style.backgroundColor = '#f0f9ff';
//             day.style.borderColor = '#93c5fd';
//         }
        
//         day.innerHTML = `<div class="crm-calendar-day-number">${i}</div>`;
        
//         // Add events for this day
//         addEventsToDay(day, dayDate);
        
//         calendarGrid.appendChild(day);
//     }
    
//     // Add days from next month to fill the grid
//     const totalDaysShown = prevMonthDays + lastDay.getDate();
//     const nextMonthDays = 42 - totalDaysShown; // 6 rows of 7 days = 42
    
//     for (let i = 1; i <= nextMonthDays; i++) {
//         const day = document.createElement('div');
//         day.className = 'crm-calendar-day crm-calendar-day-other-month';
        
//         const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
        
//         day.innerHTML = `<div class="crm-calendar-day-number">${i}</div>`;
        
//         // Add events for this day
//         addEventsToDay(day, dayDate);
        
//         calendarGrid.appendChild(day);
//     }
// }

// function addEventsToDay(dayElement, date) {
//     // Format date as YYYY-MM-DD for comparison
//     const dateString = date.toISOString().split('T')[0];
    
//     // Filter events for this day
//     const dayEvents = events.filter(event => event.date === dateString);
    
//     // Add events to day
//     dayEvents.forEach(event => {
//         const eventElement = document.createElement('div');
//         eventElement.className = `crm-calendar-event crm-calendar-event-${event.type}`;
//         eventElement.textContent = event.title;
//         eventElement.title = `${event.startTime} - ${event.endTime}: ${event.title}`;
//         eventElement.setAttribute('data-event-id', event.id);
        
//         // Add click event to show event details
//         eventElement.addEventListener('click', () => {
//             alert(`Event: ${event.title}\nTime: ${event.startTime} - ${event.endTime}\nType: ${event.type}\nDescription: ${event.description}`);
//         });
        
//         dayElement.appendChild(eventElement);
//     });
// }

// function renderWeekView() {
//     // Get the start of the week (Sunday)
//     const weekStart = new Date(currentDate);
//     weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    
//     // Update week day headers
//     const dayHeaders = document.querySelectorAll('#weekView .crm-calendar-day-header');
//     for (let i = 1; i < dayHeaders.length; i++) {
//         const day = new Date(weekStart);
//         day.setDate(weekStart.getDate() + (i - 1));
//         dayHeaders[i].textContent = day.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
//     }
    
//     // Clear previous time slots
//     const weekContainer = document.querySelector('#weekView .crm-calendar-week');
//     const existingTimeSlots = weekContainer.querySelectorAll('.crm-calendar-time, .crm-calendar-week-day');
//     existingTimeSlots.forEach(slot => slot.remove());
    
//     // Add time slots
//     for (let hour = 8; hour <= 17; hour++) {
//         // Add time label
//         const timeLabel = document.createElement('div');
//         timeLabel.className = 'crm-calendar-time';
//         timeLabel.textContent = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
//         weekContainer.appendChild(timeLabel);
        
//         // Add day slots for this hour
//         for (let day = 0; day < 7; day++) {
//             const daySlot = document.createElement('div');
//             daySlot.className = 'crm-calendar-week-day';
//             daySlot.setAttribute('data-day', day);
//             daySlot.setAttribute('data-time', hour);
//             weekContainer.appendChild(daySlot);
//         }
//     }
    
//     // Add events to week view
//     events.forEach(event => {
//         const eventDate = new Date(event.date);
//         const dayOfWeek = eventDate.getDay(); // 0 = Sunday, 6 = Saturday
        
//         // Check if event is in current week
//         const weekEnd = new Date(weekStart);
//         weekEnd.setDate(weekStart.getDate() + 6);
        
//         if (eventDate >= weekStart && eventDate <= weekEnd) {
//             // Convert time to hour
//             const startHour = parseInt(event.startTime.split(':')[0]);
            
//             // Find the corresponding cell
//             const cell = document.querySelector(`#weekView .crm-calendar-week-day[data-day="${dayOfWeek}"][data-time="${startHour}"]`);
            
//             if (cell) {
//                 const eventElement = document.createElement('div');
//                 eventElement.className = `crm-calendar-event crm-calendar-event-${event.type}`;
//                 eventElement.textContent = event.title;
//                 eventElement.title = `${event.startTime} - ${event.endTime}: ${event.title}`;
//                 eventElement.setAttribute('data-event-id', event.id);
                
//                 // Add click event to show event details
//                 eventElement.addEventListener('click', () => {
//                     alert(`Event: ${event.title}\nTime: ${event.startTime} - ${event.endTime}\nType: ${event.type}\nDescription: ${event.description}`);
//                 });
                
//                 cell.appendChild(eventElement);
//             }
//         }
//     });
// }

// function renderDayView() {
//     // Clear previous time slots
//     const dayContainer = document.querySelector('#dayView .crm-calendar-daily');
//     dayContainer.innerHTML = '';
    
//     // Add time slots
//     for (let hour = 8; hour <= 17; hour++) {
//         // Add time label
//         const timeLabel = document.createElement('div');
//         timeLabel.className = 'crm-calendar-time';
//         timeLabel.textContent = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
//         dayContainer.appendChild(timeLabel);
        
//         // Add events container for this hour
//         const eventsContainer = document.createElement('div');
//         eventsContainer.className = 'crm-calendar-daily-events';
//         eventsContainer.setAttribute('data-time', hour);
//         dayContainer.appendChild(eventsContainer);
//     }
    
//     // Format date as YYYY-MM-DD for comparison
//     const dateString = currentDate.toISOString().split('T')[0];
    
//     // Filter events for this day
//     const dayEvents = events.filter(event => event.date === dateString);
    
//     // Add events to day view
//     dayEvents.forEach(event => {
//         // Convert time to hour
//         const startHour = parseInt(event.startTime.split(':')[0]);
        
//         // Find the corresponding time slot
//         const timeSlot = document.querySelector(`#dayView .crm-calendar-daily-events[data-time="${startHour}"]`);
        
//         if (timeSlot) {
//             const eventElement = document.createElement('div');
//             eventElement.className = `crm-calendar-event crm-calendar-event-${event.type}`;
//             eventElement.textContent = `${event.startTime} - ${event.endTime}: ${event.title}`;
//             eventElement.setAttribute('data-event-id', event.id);
            
//             // Add click event to show event details
//             eventElement.addEventListener('click', () => {
//                 alert(`Event: ${event.title}\nTime: ${event.startTime} - ${event.endTime}\nType: ${event.type}\nDescription: ${event.description}`);
//             });
            
//             timeSlot.appendChild(eventElement);
//         }
//     });
// }

// // Add Event Function
// function addEvent() {
//     const form = document.getElementById('addEventForm');
//     if (form.checkValidity()) {
//         const title = document.getElementById('eventTitle').value;
//         const type = document.getElementById('eventType').value;
//         const date = document.getElementById('eventDate').value;
//         const startTime = document.getElementById('eventStartTime').value;
//         const endTime = document.getElementById('eventEndTime').value;
//         const description = document.getElementById('eventDescription').value;
        
//         // Get selected participants
//         const participantsSelect = document.getElementById('eventParticipants');
//         const participants = Array.from(participantsSelect.selectedOptions).map(option => option.value);
        
//         // Generate event ID
//         const eventId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
        
//         // Create new event object
//         const newEvent = {
//             id: eventId,
//             title,
//             type,
//             date,
//             startTime,
//             endTime,
//             description,
//             participants
//         };
        
//         // Add to events array
//         events.push(newEvent);
        
//         // Render calendar
//         renderCalendar();
        
//         // Close modal
//         closeModal(document.getElementById('addEventModal'));
        
//         // Show notification
//         showNotification('Event added successfully!');
        
//         // Reset form
//         form.reset();
//     } else {
//         form.reportValidity();
//     }
// }

// // Export Functions
// function exportData(dataType, format) {
//     // In a real application, this would make an API call to generate the export
//     showNotification(`Exporting ${dataType} as ${format.toUpperCase()}...`);
    
//     // Simulate export delay
//     setTimeout(() => {
//         showNotification(`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} exported successfully!`);
        
//         // Log the export
//         addLog({
//             user: "current.user",
//             type: "export",
//             action: "Data exported",
//             details: `Exported ${dataType} to ${format.toUpperCase()}`
//         });
//     }, 1500);
// }

// function setupExportFields() {
//     const exportDataType = document.getElementById('exportDataType');
//     const exportFields = document.getElementById('exportFields');
    
//     // Define fields for each data type
//     const fields = {
//         customers: ['Name', 'Email', 'Phone', 'Company', 'Address', 'Created Date', 'Last Contact'],
//         proposals: ['Title', 'Client', 'Amount', 'Status', 'Created Date', 'Valid Until'],
//         reports: ['Report Name', 'Type', 'Period', 'Generated By', 'Generated Date'],
//         invoices: ['Invoice Number', 'Client', 'Amount', 'Status', 'Issue Date', 'Due Date'],
//         activities: ['Type', 'Description', 'Related To', 'Date', 'User'],
//         tasks: ['Title', 'Assigned To', 'Due Date', 'Priority', 'Status']
//     };
    
//     // Update fields when data type changes
//     exportDataType.addEventListener('change', () => {
//         const dataType = exportDataType.value;
//         const fieldsList = fields[dataType] || [];
        
//         exportFields.innerHTML = '';
        
//         fieldsList.forEach(field => {
//             const checkbox = document.createElement('div');
//             checkbox.className = 'crm-mb-1';
//             checkbox.innerHTML = `
//                 <label class="crm-d-flex crm-align-center crm-gap-2">
//                     <input type="checkbox" name="fields" value="${field.toLowerCase().replace(/\s+/g, '_')}" checked>
//                     ${field}
//                 </label>
//             `;
//             exportFields.appendChild(checkbox);
//         });
//     });
    
//     // Initialize fields for default data type
//     exportDataType.dispatchEvent(new Event('change'));
// }

// function customExport() {
//     const dataType = document.getElementById('exportDataType').value;
//     const format = document.getElementById('exportFormat').value;
//     const startDate = document.getElementById('exportStartDate').value;
//     const endDate = document.getElementById('exportEndDate').value;
    
//     // Get selected fields
//     const fieldCheckboxes = document.querySelectorAll('#exportFields input[type="checkbox"]:checked');
//     const fields = Array.from(fieldCheckboxes).map(checkbox => checkbox.value);
    
//     // In a real application, this would make an API call to generate the export
//     showNotification(`Generating custom ${dataType} export...`);
    
//     // Simulate export delay
//     setTimeout(() => {
//         showNotification(`Custom ${dataType} export completed!`);
        
//         // Log the export
//         addLog({
//             user: "current.user",
//             type: "export",
//             action: "Custom export generated",
//             details: `Exported ${dataType} (${fields.length} fields) to ${format.toUpperCase()}`
//         });
//     }, 2000);
// }

// // Logs Functions
// function renderLogs() {
//     // Get filter values
//     const typeFilter = document.getElementById('logTypeFilter').value;
//     const userFilter = document.getElementById('logUserFilter').value;
//     const startDateFilter = document.getElementById('logStartDate').value;
//     const endDateFilter = document.getElementById('logEndDate').value;
//     const searchFilter = document.getElementById('logSearch').value.toLowerCase();
    
//     // Filter logs
//     let filteredLogs = logs.filter(log => {
//         // Type filter
//         const matchesType = typeFilter === 'all' || log.type === typeFilter;
        
//         // User filter
//         const matchesUser = userFilter === 'all' || log.user === userFilter;
        
//                 // Date filter
//                 let matchesDate = true;
//                 if (startDateFilter) {
//                     const logDate = new Date(log.timestamp);
//                     const startDate = new Date(startDateFilter);
//                     matchesDate = logDate >= startDate;
//                 }
//                 if (endDateFilter && matchesDate) {
//                     const logDate = new Date(log.timestamp);
//                     const endDate = new Date(endDateFilter);
//                     endDate.setHours(23, 59, 59); // End of day
//                     matchesDate = logDate <= endDate;
//                 }
                
//                 // Search filter
//                 const matchesSearch = 
//                     log.user.toLowerCase().includes(searchFilter) ||
//                     log.action.toLowerCase().includes(searchFilter) ||
//                     log.details.toLowerCase().includes(searchFilter) ||
//                     log.type.toLowerCase().includes(searchFilter);
                
//                 return matchesType && matchesUser && matchesDate && matchesSearch;
//             });
            
//             // Sort logs by timestamp (newest first)
//             filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
//             // Render logs
//             const logsTableBody = document.getElementById('logsTableBody');
//             logsTableBody.innerHTML = '';
            
//             if (filteredLogs.length === 0) {
//                 logsTableBody.innerHTML = `
//                     <tr>
//                         <td colspan="5" style="text-align: center; padding: 2rem;">No logs found</td>
//                     </tr>
//                 `;
//             } else {
//                 filteredLogs.forEach(log => {
//                     const row = document.createElement('tr');
                    
//                     // Format date
//                     const logDate = new Date(log.timestamp);
//                     const formattedDate = logDate.toLocaleString('en-US', {
//                         year: 'numeric',
//                         month: 'short',
//                         day: 'numeric',
//                         hour: '2-digit',
//                         minute: '2-digit',
//                         second: '2-digit'
//                     });
                    
//                     // Determine badge class
//                     let badgeClass = 'crm-badge-primary';
//                     if (log.type === 'login') {
//                         badgeClass = 'crm-badge-success';
//                     } else if (log.type === 'system') {
//                         badgeClass = 'crm-badge-warning';
//                     } else if (log.type === 'export') {
//                         badgeClass = 'crm-badge-primary';
//                     }
                    
//                     row.innerHTML = `
//                         <td>${formattedDate}</td>
//                         <td>${log.user}</td>
//                         <td><span class="crm-badge ${badgeClass}">${log.type}</span></td>
//                         <td>${log.action}</td>
//                         <td class="crm-log-entry-details">${log.details}</td>
//                     `;
                    
//                     logsTableBody.appendChild(row);
//                 });
//             }
//         }
        
        // Sample Data
        let events = [
            {
                id: 1,
                title: "Client Meeting - ABC Corp",
                type: "meeting",
                date: "2025-03-15",
                startTime: "10:00",
                endTime: "11:30",
                description: "Discuss new project requirements",
                participants: ["john.doe", "jane.smith"]
            },
            {
                id: 2,
                title: "Follow-up with XYZ Inc",
                type: "followup",
                date: "2025-03-16",
                startTime: "14:00",
                endTime: "14:30",
                description: "Check on proposal status",
                participants: ["mike.johnson"]
            },
            {
                id: 3,
                title: "Project Alpha Deadline",
                type: "deadline",
                date: "2025-03-20",
                startTime: "17:00",
                endTime: "17:00",
                description: "Final deliverables due",
                participants: ["john.doe", "jane.smith", "mike.johnson"]
            },
            {
                id: 4,
                title: "Team Meeting",
                type: "meeting",
                date: "2025-03-17",
                startTime: "09:00",
                endTime: "10:00",
                description: "Weekly progress update",
                participants: ["john.doe", "jane.smith", "mike.johnson", "sarah.williams"]
            },
            {
                id: 5,
                title: "Client Proposal Due",
                type: "deadline",
                date: "2025-03-22",
                startTime: "12:00",
                endTime: "12:00",
                description: "Submit proposal to Global Industries",
                participants: ["jane.smith"]
            }
        ];

        let logs = [
            {
                id: 1,
                timestamp: "2025-03-23T08:45:12",
                user: "john.doe",
                type: "login",
                action: "User login",
                details: "Successful login from 192.168.1.105"
            },
            {
                id: 2,
                timestamp: "2025-03-23T09:12:34",
                user: "jane.smith",
                type: "data",
                action: "Customer updated",
                details: "Updated contact information for ABC Corp"
            },
            {
                id: 3,
                timestamp: "2025-03-23T10:05:22",
                user: "admin",
                type: "system",
                action: "System backup",
                details: "Automated daily backup completed successfully"
            },
            {
                id: 4,
                timestamp: "2025-03-23T11:30:45",
                user: "mike.johnson",
                type: "report",
                action: "Report generated",
                details: "Generated Q1 Sales Report"
            },
            {
                id: 5,
                timestamp: "2025-03-23T13:15:08",
                user: "jane.smith",
                type: "export",
                action: "Data exported",
                details: "Exported customer list to CSV"
            },
            {
                id: 6,
                timestamp: "2025-03-23T14:22:51",
                user: "john.doe",
                type: "data",
                action: "Invoice created",
                details: "Created invoice #INV-2025-103 for XYZ Inc"
            },
            {
                id: 7,
                timestamp: "2025-03-23T15:40:19",
                user: "admin",
                type: "system",
                action: "User added",
                details: "Added new user: david.brown@example.com"
            },
            {
                id: 8,
                timestamp: "2025-03-23T16:05:33",
                user: "mike.johnson",
                type: "login",
                action: "User logout",
                details: "User session ended"
            }
        ];

        let announcements = [
            {
                id: 1,
                title: "Company Meeting Next Week",
                content: "Please be informed that we will have our quarterly company meeting next Friday at 3:00 PM in the main conference room. Attendance is mandatory for all employees.",
                author: "John Smith",
                date: "2025-03-20",
                priority: "normal"
            },
            {
                id: 2,
                title: "New CRM Features Released",
                content: "We're excited to announce that we've released several new features to our CRM system, including improved calendar integration, enhanced reporting capabilities, and a streamlined user interface. Check out the 'What's New' section for more details.",
                author: "Development Team",
                date: "2025-03-18",
                priority: "important"
            },
            {
                id: 3,
                title: "System Maintenance Notice",
                content: "The CRM system will be undergoing scheduled maintenance this Saturday from 10:00 PM to 2:00 AM. During this time, the system may be unavailable or experience intermittent issues. Please plan your work accordingly.",
                author: "IT Department",
                date: "2025-03-15",
                priority: "urgent"
            }
        ];

        let roles = [
            {
                id: 1,
                name: "Administrator",
                description: "Full system access with all permissions"
            },
            {
                id: 2,
                name: "Manager",
                description: "Access to manage teams, customers, and reports"
            },
            {
                id: 3,
                name: "Sales Representative",
                description: "Access to customer data and sales tools"
            },
            {
                id: 4,
                name: "Support Agent",
                description: "Access to customer support features"
            },
            {
                id: 5,
                name: "Read-Only User",
                description: "View-only access to system data"
            }
        ];

        // DOM Elements
        const navTabs = document.querySelectorAll('.crm-nav-tab');
        const sections = document.querySelectorAll('.crm-section');
        const modals = document.querySelectorAll('.crm-modal-backdrop');
        const modalCloseButtons = document.querySelectorAll('[data-dismiss="modal"]');
        
        // Calendar Elements
        const calendarTitle = document.getElementById('calendarTitle');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const todayBtn = document.getElementById('todayBtn');
        const viewButtons = document.querySelectorAll('[data-view]');
        const monthView = document.getElementById('monthView');
        const weekView = document.getElementById('weekView');
        const dayView = document.getElementById('dayView');
        const addEventBtn = document.getElementById('addEventBtn');
        
        // Logs Elements
        const logsTableBody = document.getElementById('logsTableBody');
        const logTypeFilter = document.getElementById('logTypeFilter');
        const logUserFilter = document.getElementById('logUserFilter');
        const logStartDate = document.getElementById('logStartDate');
        const logEndDate = document.getElementById('logEndDate');
        const logSearch = document.getElementById('logSearch');
        const refreshLogsBtn = document.getElementById('refreshLogsBtn');
        
        // Announcements Elements
        const announcementsList = document.getElementById('announcementsList');
        const addAnnouncementBtn = document.getElementById('addAnnouncementBtn');
        
        // Settings Elements
        const userRolesList = document.getElementById('userRolesList');
        const addRoleBtn = document.getElementById('addRoleBtn');
        const savePermissionsBtn = document.getElementById('savePermissionsBtn');
        
        // Modal Buttons
        const submitEventBtn = document.getElementById('submitEventBtn');
        const submitAnnouncementBtn = document.getElementById('submitAnnouncementBtn');
        const submitRoleBtn = document.getElementById('submitRoleBtn');
        
        // Notification
        const notification = document.getElementById('crmNotification');

        // Current date for calendar
        let currentDate = new Date();
        let currentView = 'month';

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            setupEventListeners();
            renderCalendar();
            renderLogs();
            renderAnnouncements();
            renderRoles();
            setupExportFields();
        });

        // Setup Event Listeners
        function setupEventListeners() {
            // Navigation Tabs
            navTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Update active tab
                    navTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    // Show corresponding section
                    const tabId = tab.getAttribute('data-tab');
                    sections.forEach(section => {
                        section.classList.add('crm-hidden');
                        if (section.id === tabId + '-section') {
                            section.classList.remove('crm-hidden');
                        }
                    });
                });
            });

            // Calendar Navigation
            prevBtn.addEventListener('click', () => {
                if (currentView === 'month') {
                    currentDate.setMonth(currentDate.getMonth() - 1);
                } else if (currentView === 'week') {
                    currentDate.setDate(currentDate.getDate() - 7);
                } else if (currentView === 'day') {
                    currentDate.setDate(currentDate.getDate() - 1);
                }
                renderCalendar();
            });

            nextBtn.addEventListener('click', () => {
                if (currentView === 'month') {
                    currentDate.setMonth(currentDate.getMonth() + 1);
                } else if (currentView === 'week') {
                    currentDate.setDate(currentDate.getDate() + 7);
                } else if (currentView === 'day') {
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                renderCalendar();
            });

            todayBtn.addEventListener('click', () => {
                currentDate = new Date();
                renderCalendar();
            });

            // Calendar View Buttons
            viewButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const view = button.getAttribute('data-view');
                    currentView = view;
                    
                    // Update active button
                    viewButtons.forEach(btn => {
                        btn.classList.remove('crm-btn-primary');
                        btn.classList.add('crm-btn-outline');
                    });
                    button.classList.remove('crm-btn-outline');
                    button.classList.add('crm-btn-primary');
                    
                    // Show corresponding view
                    monthView.classList.add('crm-hidden');
                    weekView.classList.add('crm-hidden');
                    dayView.classList.add('crm-hidden');
                    
                    if (view === 'month') {
                        monthView.classList.remove('crm-hidden');
                    } else if (view === 'week') {
                        weekView.classList.remove('crm-hidden');
                    } else if (view === 'day') {
                        dayView.classList.remove('crm-hidden');
                    }
                    
                    renderCalendar();
                });
            });

            // Modal Open Buttons
            addEventBtn.addEventListener('click', () => openModal('addEventModal'));
            addAnnouncementBtn.addEventListener('click', () => openModal('addAnnouncementModal'));
            addRoleBtn.addEventListener('click', () => openModal('addRoleModal'));

            // Modal Close Buttons
            modalCloseButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const modal = button.closest('.crm-modal-backdrop');
                    closeModal(modal);
                });
            });

            // Close modal when clicking outside
            modals.forEach(modal => {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        closeModal(modal);
                    }
                });
            });

            // Form Submissions
            submitEventBtn.addEventListener('click', addEvent);
            submitAnnouncementBtn.addEventListener('click', addAnnouncement);
            submitRoleBtn.addEventListener('click', addRole);
            
            // Logs Filtering
            logTypeFilter.addEventListener('change', renderLogs);
            logUserFilter.addEventListener('change', renderLogs);
            logStartDate.addEventListener('change', renderLogs);
            logEndDate.addEventListener('change', renderLogs);
            logSearch.addEventListener('input', renderLogs);
            refreshLogsBtn.addEventListener('click', renderLogs);
            
            // Save Permissions
            savePermissionsBtn.addEventListener('click', savePermissions);
        }

        // Modal Functions
        function openModal(modalId) {
            document.getElementById(modalId).classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Set current date as default for event date
            if (modalId === 'addEventModal') {
                const today = currentDate.toISOString().split('T')[0];
                document.getElementById('eventDate').value = today;
            }
        }

        function closeModal(modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            
            // Reset forms
            if (modal.id === 'addEventModal') {
                document.getElementById('addEventForm').reset();
            } else if (modal.id === 'addAnnouncementModal') {
                document.getElementById('addAnnouncementForm').reset();
            } else if (modal.id === 'addRoleModal') {
                document.getElementById('addRoleForm').reset();
            }
        }

        // Calendar Functions
        function renderCalendar() {
            updateCalendarTitle();
            
            if (currentView === 'month') {
                renderMonthView();
            } else if (currentView === 'week') {
                renderWeekView();
            } else if (currentView === 'day') {
                renderDayView();
            }
        }

        function updateCalendarTitle() {
            const options = { month: 'long', year: 'numeric' };
            if (currentView === 'day') {
                options.day = 'numeric';
            } else if (currentView === 'week') {
                const weekStart = new Date(currentDate);
                weekStart.setDate(currentDate.getDate() - currentDate.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                
                const monthStart = weekStart.toLocaleDateString('en-US', { month: 'short' });
                const monthEnd = weekEnd.toLocaleDateString('en-US', { month: 'short' });
                const yearStart = weekStart.toLocaleDateString('en-US', { year: 'numeric' });
                const yearEnd = weekEnd.toLocaleDateString('en-US', { year: 'numeric' });
                
                if (monthStart === monthEnd && yearStart === yearEnd) {
                    calendarTitle.textContent = `${monthStart} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${yearStart}`;
                } else if (yearStart === yearEnd) {
                    calendarTitle.textContent = `${monthStart} ${weekStart.getDate()} - ${monthEnd} ${weekEnd.getDate()}, ${yearStart}`;
                } else {
                    calendarTitle.textContent = `${monthStart} ${weekStart.getDate()}, ${yearStart} - ${monthEnd} ${weekEnd.getDate()}, ${yearEnd}`;
                }
                
                return;
            }
            
            calendarTitle.textContent = currentDate.toLocaleDateString('en-US', options);
        }

        function renderMonthView() {
            const calendarGrid = monthView.querySelector('.crm-calendar-grid');
            const daysHeader = calendarGrid.querySelectorAll('.crm-calendar-day-header');
            
            // Clear previous days
            const existingDays = calendarGrid.querySelectorAll('.crm-calendar-day');
            existingDays.forEach(day => day.remove());
            
            // Get first day of month
            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            
            // Get day of week for first day (0 = Sunday, 6 = Saturday)
            const firstDayOfWeek = firstDay.getDay();
            
            // Get days from previous month
            const prevMonthDays = firstDayOfWeek;
            const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            
            // Add days from previous month
            for (let i = prevMonthDays - 1; i >= 0; i--) {
                const day = document.createElement('div');
                day.className = 'crm-calendar-day crm-calendar-day-other-month';
                
                const dayNumber = prevMonth.getDate() - i;
                const dayDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), dayNumber);
                
                day.innerHTML = `<div class="crm-calendar-day-number">${dayNumber}</div>`;
                
                // Add events for this day
                addEventsToDay(day, dayDate);
                
                calendarGrid.appendChild(day);
            }
            
            // Add days for current month
            for (let i = 1; i <= lastDay.getDate(); i++) {
                const day = document.createElement('div');
                day.className = 'crm-calendar-day';
                
                const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
                
                // Check if this is today
                const today = new Date();
                if (dayDate.getDate() === today.getDate() && 
                    dayDate.getMonth() === today.getMonth() && 
                    dayDate.getFullYear() === today.getFullYear()) {
                    day.style.backgroundColor = '#f0f9ff';
                    day.style.borderColor = '#93c5fd';
                }
                
                day.innerHTML = `<div class="crm-calendar-day-number">${i}</div>`;
                
                // Add events for this day
                addEventsToDay(day, dayDate);
                
                calendarGrid.appendChild(day);
            }
            
            // Add days from next month to fill the grid
            const totalDaysShown = prevMonthDays + lastDay.getDate();
            const nextMonthDays = 42 - totalDaysShown; // 6 rows of 7 days = 42
            
            for (let i = 1; i <= nextMonthDays; i++) {
                const day = document.createElement('div');
                day.className = 'crm-calendar-day crm-calendar-day-other-month';
                
                const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
                
                day.innerHTML = `<div class="crm-calendar-day-number">${i}</div>`;
                
                // Add events for this day
                addEventsToDay(day, dayDate);
                
                calendarGrid.appendChild(day);
            }
        }

        function addEventsToDay(dayElement, date) {
            // Format date as YYYY-MM-DD for comparison
            const dateString = date.toISOString().split('T')[0];
            
            // Filter events for this day
            const dayEvents = events.filter(event => event.date === dateString);
            
            // Add events to day
            dayEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = `crm-calendar-event crm-calendar-event-${event.type}`;
                eventElement.textContent = event.title;
                eventElement.title = `${event.startTime} - ${event.endTime}: ${event.title}`;
                eventElement.setAttribute('data-event-id', event.id);
                
                // Add click event to show event details
                eventElement.addEventListener('click', () => {
                    alert(`Event: ${event.title}\nTime: ${event.startTime} - ${event.endTime}\nType: ${event.type}\nDescription: ${event.description}`);
                });
                
                dayElement.appendChild(eventElement);
            });
        }

        function renderWeekView() {
            // Get the start of the week (Sunday)
            const weekStart = new Date(currentDate);
            weekStart.setDate(currentDate.getDate() - currentDate.getDay());
            
            // Update week day headers
            const dayHeaders = weekView.querySelectorAll('.crm-calendar-day-header');
            for (let i = 1; i < dayHeaders.length; i++) {
                const day = new Date(weekStart);
                day.setDate(weekStart.getDate() + (i - 1));
                dayHeaders[i].textContent = day.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
            }
            
            // Clear previous events
            const weekDays = weekView.querySelectorAll('.crm-calendar-week-day');
            weekDays.forEach(day => {
                day.innerHTML = '';
            });
            
            // Add events to week view
            events.forEach(event => {
                const eventDate = new Date(event.date);
                const dayOfWeek = eventDate.getDay(); // 0 = Sunday, 6 = Saturday
                
                // Check if event is in current week
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                
                if (eventDate >= weekStart && eventDate <= weekEnd) {
                    // Convert time to hour
                    const startHour = parseInt(event.startTime.split(':')[0]);
                    
                    // Find the corresponding cell
                    const cell = weekView.querySelector(`.crm-calendar-week-day[data-day="${dayOfWeek}"][data-time="${startHour}"]`);
                    
                    if (cell) {
                        const eventElement = document.createElement('div');
                        eventElement.className = `crm-calendar-event crm-calendar-event-${event.type}`;
                        eventElement.textContent = event.title;
                        eventElement.title = `${event.startTime} - ${event.endTime}: ${event.title}`;
                        eventElement.setAttribute('data-event-id', event.id);
                        
                        // Add click event to show event details
                        eventElement.addEventListener('click', () => {
                            alert(`Event: ${event.title}\nTime: ${event.startTime} - ${event.endTime}\nType: ${event.type}\nDescription: ${event.description}`);
                        });
                        
                        cell.appendChild(eventElement);
                    }
                }
            });
        }

        function renderDayView() {
            // Update day view title
            const dayTitle = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
            
            // Clear previous events
            const dayEvents = dayView.querySelectorAll('.crm-calendar-daily-events');
            dayEvents.forEach(timeSlot => {
                timeSlot.innerHTML = '';
            });
            
            // Format date as YYYY-MM-DD for comparison
            const dateString = currentDate.toISOString().split('T')[0];
            
            // Filter events for this day
            const dayEvents2 = events.filter(event => event.date === dateString);
            
            // Add events to day view
            dayEvents2.forEach(event => {
                // Convert time to hour
                const startHour = parseInt(event.startTime.split(':')[0]);
                
                // Find the corresponding time slot
                const timeSlot = dayView.querySelector(`.crm-calendar-daily-events[data-time="${startHour}"]`);
                
                if (timeSlot) {
                    const eventElement = document.createElement('div');
                    eventElement.className = `crm-calendar-event crm-calendar-event-${event.type}`;
                    eventElement.textContent = `${event.startTime} - ${event.endTime}: ${event.title}`;
                    eventElement.setAttribute('data-event-id', event.id);
                    
                    // Add click event to show event details
                    eventElement.addEventListener('click', () => {
                        alert(`Event: ${event.title}\nTime: ${event.startTime} - ${event.endTime}\nType: ${event.type}\nDescription: ${event.description}`);
                    });
                    
                    timeSlot.appendChild(eventElement);
                }
            });
        }

        // Add Event Function
        function addEvent() {
            const form = document.getElementById('addEventForm');
            if (form.checkValidity()) {
                const title = document.getElementById('eventTitle').value;
                const type = document.getElementById('eventType').value;
                const date = document.getElementById('eventDate').value;
                const startTime = document.getElementById('eventStartTime').value;
                const endTime = document.getElementById('eventEndTime').value;
                const description = document.getElementById('eventDescription').value;
                
                // Get selected participants
                const participantsSelect = document.getElementById('eventParticipants');
                const participants = Array.from(participantsSelect.selectedOptions).map(option => option.value);
                
                // Generate event ID
                const eventId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
                
                // Create new event object
                const newEvent = {
                    id: eventId,
                    title,
                    type,
                    date,
                    startTime,
                    endTime,
                    description,
                    participants
                };
                
                // Add to events array
                events.push(newEvent);
                
                // Render calendar
                renderCalendar();
                
                // Close modal
                closeModal(document.getElementById('addEventModal'));
                
                // Show notification
                showNotification('Event added successfully!');
                
                // Reset form
                form.reset();
            } else {
                form.reportValidity();
            }
        }

        // Export Functions
        function exportData(dataType, format) {
            // In a real application, this would make an API call to generate the export
            showNotification(`Exporting ${dataType} as ${format.toUpperCase()}...`);
            
            // Simulate export delay
            setTimeout(() => {
                showNotification(`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} exported successfully!`);
                
                // Log the export
                addLog({
                    user: "current.user",
                    type: "export",
                    action: "Data exported",
                    details: `Exported ${dataType} to ${format.toUpperCase()}`
                });
            }, 1500);
        }

        function setupExportFields() {
            const exportDataType = document.getElementById('exportDataType');
            const exportFields = document.getElementById('exportFields');
            
            // Define fields for each data type
            const fields = {
                customers: ['Name', 'Email', 'Phone', 'Company', 'Address', 'Created Date', 'Last Contact'],
                proposals: ['Title', 'Client', 'Amount', 'Status', 'Created Date', 'Valid Until'],
                reports: ['Report Name', 'Type', 'Period', 'Generated By', 'Generated Date'],
                invoices: ['Invoice Number', 'Client', 'Amount', 'Status', 'Issue Date', 'Due Date'],
                activities: ['Type', 'Description', 'Related To', 'Date', 'User'],
                tasks: ['Title', 'Assigned To', 'Due Date', 'Priority', 'Status']
            };
            
            // Update fields when data type changes
            exportDataType.addEventListener('change', () => {
                const dataType = exportDataType.value;
                const fieldsList = fields[dataType] || [];
                
                exportFields.innerHTML = '';
                
                fieldsList.forEach(field => {
                    const checkbox = document.createElement('div');
                    checkbox.className = 'crm-mb-1';
                    checkbox.innerHTML = `
                        <label class="crm-d-flex crm-align-center crm-gap-2">
                            <input type="checkbox" name="fields" value="${field.toLowerCase().replace(/\s+/g, '_')}" checked>
                            ${field}
                        </label>
                    `;
                    exportFields.appendChild(checkbox);
                });
            });
            
            // Initialize fields for default data type
            exportDataType.dispatchEvent(new Event('change'));
        }

        function customExport() {
            const dataType = document.getElementById('exportDataType').value;
            const format = document.getElementById('exportFormat').value;
            const startDate = document.getElementById('exportStartDate').value;
            const endDate = document.getElementById('exportEndDate').value;
            
            // Get selected fields
            const fieldCheckboxes = document.querySelectorAll('#exportFields input[type="checkbox"]:checked');
            const fields = Array.from(fieldCheckboxes).map(checkbox => checkbox.value);
            
            // In a real application, this would make an API call to generate the export
            showNotification(`Generating custom ${dataType} export...`);
            
            // Simulate export delay
            setTimeout(() => {
                showNotification(`Custom ${dataType} export completed!`);
                
                // Log the export
                addLog({
                    user: "current.user",
                    type: "export",
                    action: "Custom export generated",
                    details: `Exported ${dataType} (${fields.length} fields) to ${format.toUpperCase()}`
                });
            }, 2000);
        }

        // Logs Functions
        function renderLogs() {
            // Get filter values
            const typeFilter = logTypeFilter.value;
            const userFilter = logUserFilter.value;
            const startDateFilter = logStartDate.value;
            const endDateFilter = logEndDate.value;
            const searchFilter = logSearch.value.toLowerCase();
            
            // Filter logs
            let filteredLogs = logs.filter(log => {
                // Type filter
                const matchesType = typeFilter === 'all' || log.type === typeFilter;
                
                // User filter
                const matchesUser = userFilter === 'all' || log.user === userFilter;
                
                // Date filter
                let matchesDate = true;
                if (startDateFilter) {
                    const logDate = new Date(log.timestamp);
                    const startDate = new Date(startDateFilter);
                    matchesDate = matchesDate && logDate >= startDate;
                }
                if (endDateFilter) {
                    const logDate = new Date(log.timestamp);
                    const endDate = new Date(endDateFilter);
                    endDate.setHours(23, 59, 59, 999); // End of day
                    matchesDate = matchesDate && logDate <= endDate;
                }
                
                // Search filter
                const matchesSearch = 
                    log.user.toLowerCase().includes(searchFilter) ||
                    log.action.toLowerCase().includes(searchFilter) ||
                    log.details.toLowerCase().includes(searchFilter);
                
                return matchesType && matchesUser && matchesDate && matchesSearch;
            });
            
            // Sort logs by timestamp (newest first)
            filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            // Clear table
            logsTableBody.innerHTML = '';
            
            // Add logs to table
            if (filteredLogs.length === 0) {
                logsTableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem;">No logs found</td>
                    </tr>
                `;
            } else {
                filteredLogs.forEach(log => {
                    const row = document.createElement('tr');
                    
                    // Format date
                    const date = new Date(log.timestamp);
                    const formattedDate = date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                    
                    // Determine badge class
                    let typeBadgeClass = 'crm-badge-primary';
                    if (log.type === 'login') {
                        typeBadgeClass = 'crm-badge-success';
                    } else if (log.type === 'system') {
                        typeBadgeClass = 'crm-badge-warning';
                    } else if (log.type === 'export') {
                        typeBadgeClass = 'crm-badge-primary';
                    }
                    
                    row.innerHTML = `
                        <td>${formattedDate}</td>
                        <td>${log.user}</td>
                        <td><span class="crm-badge ${typeBadgeClass}">${log.type}</span></td>
                        <td>${log.action}</td>
                        <td class="crm-log-entry-details">${log.details}</td>
                    `;
                    
                    logsTableBody.appendChild(row);
                });
            }
        }

        function addLog(logData) {
            // Generate log ID
            const logId = logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1;
            
            // Create new log object
            const newLog = {
                id: logId,
                timestamp: new Date().toISOString(),
                user: logData.user,
                type: logData.type,
                action: logData.action,
                details: logData.details
            };
            
            // Add to logs array
            logs.unshift(newLog);
            
            // Render logs if on logs tab
            if (!document.getElementById('logs-section').classList.contains('crm-hidden')) {
                renderLogs();
            }
        }

        // Announcements Functions
        function renderAnnouncements() {
            // Sort announcements by date (newest first)
            const sortedAnnouncements = [...announcements].sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Clear list
            announcementsList.innerHTML = '';
            
            // Add announcements to list
            if (sortedAnnouncements.length === 0) {
                announcementsList.innerHTML = `
                    <div class="crm-card-content" style="text-align: center; padding: 2rem;">
                        No announcements found
                    </div>
                `;
            } else {
                sortedAnnouncements.forEach(announcement => {
                    const announcementElement = document.createElement('div');
                    announcementElement.className = 'crm-announcement';
                    
                    // Determine priority class
                    let priorityClass = '';
                    if (announcement.priority === 'important') {
                        priorityClass = 'crm-badge-warning';
                    } else if (announcement.priority === 'urgent') {
                        priorityClass = 'crm-badge-danger';
                    }
                    
                    // Format date
                    const date = new Date(announcement.date);
                    const formattedDate = date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });
                    
                    announcementElement.innerHTML = `
                        <div class="crm-announcement-header">
                            <div class="crm-d-flex crm-align-center crm-gap-2">
                                <span class="crm-announcement-title">${announcement.title}</span>
                                ${priorityClass ? `<span class="crm-badge ${priorityClass}">${announcement.priority}</span>` : ''}
                            </div>
                            <span class="crm-announcement-date">${formattedDate}</span>
                        </div>
                        <div class="crm-announcement-content">${announcement.content}</div>
                        <div class="crm-announcement-author">Posted by: ${announcement.author}</div>
                    `;
                    
                    announcementsList.appendChild(announcementElement);
                });
            }
        }

        function addAnnouncement() {
            const form = document.getElementById('addAnnouncementForm');
            if (form.checkValidity()) {
                const title = document.getElementById('announcementTitle').value;
                const content = document.getElementById('announcementContent').value;
                const priority = document.getElementById('announcementPriority').value;
                const expiry = document.getElementById('announcementExpiry').value;
                
                // Generate announcement ID
                const announcementId = announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1;
                
                // Create new announcement object
                const newAnnouncement = {
                    id: announcementId,
                    title,
                    content,
                    author: "Current User", // In a real app, this would be the current user
                    date: new Date().toISOString().split('T')[0],
                    priority,
                    expiry
                };
                
                // Add to announcements array
                announcements.push(newAnnouncement);
                
                // Render announcements
                renderAnnouncements();
                
                // Close modal
                closeModal(document.getElementById('addAnnouncementModal'));
                
                // Show notification
                showNotification('Announcement posted successfully!');
                
                // Reset form
                form.reset();
                
                // Log the action
                addLog({
                    user: "current.user",
                    type: "system",
                    action: "Announcement posted",
                    details: `Posted announcement: ${title}`
                });
            } else {
                form.reportValidity();
            }
        }

        // Settings & Permissions Functions
        function renderRoles() {
            // Clear list
            userRolesList.innerHTML = '';
            
            // Add roles to list
            roles.forEach(role => {
                const roleElement = document.createElement('div');
                roleElement.className = 'crm-user-role';
                roleElement.innerHTML = `
                    <div class="crm-user-role-name">${role.name}</div>
                    <div class="crm-text-sm crm-text-muted">${role.description}</div>
                    <div class="crm-user-role-actions">
                        <button class="crm-btn crm-btn-sm crm-btn-outline" onclick="editRole(${role.id})">Edit</button>
                        <button class="crm-btn crm-btn-sm crm-btn-outline" onclick="deleteRole(${role.id})">Delete</button>
                    </div>
                `;
                
                userRolesList.appendChild(roleElement);
            });
        }

        function addRole() {
            const form = document.getElementById('addRoleForm');
            if (form.checkValidity()) {
                const name = document.getElementById('roleName').value;
                const description = document.getElementById('roleDescription').value;
                const template = document.getElementById('roleTemplate').value;
                
                const modal = document.getElementById('addRoleModal');
                const isEdit = modal.hasAttribute('data-edit-role-id');
                
                if (isEdit) {
                    // Editing an existing role
                    const roleId = parseInt(modal.getAttribute('data-edit-role-id'));
                    const roleIndex = roles.findIndex(r => r.id === roleId);
                    
                    if (roleIndex !== -1) {
                        roles[roleIndex] = {
                            ...roles[roleIndex],
                            name,
                            description
                        };
                        
                        // Render roles
                        renderRoles();
                        
                        // Close modal
                        closeModal(modal);
                        
                        // Show notification
                        showNotification('Role updated successfully!');
                        
                        // Log the action
                        addLog({
                            user: "current.user",
                            type: "system",
                            action: "Role updated",
                            details: `Updated role: ${name}`
                        });
                    }
                } else {
                    // Adding a new role
                    // Generate role ID
                    const roleId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
                    
                    // Create new role object
                    const newRole = {
                        id: roleId,
                        name,
                        description
                    };
                    
                    // Add to roles array
                    roles.push(newRole);
                    
                    // Render roles
                    renderRoles();
                    
                    // Close modal
                    closeModal(modal);
                    
                    // Show notification
                    showNotification('Role created successfully!');
                    
                    // Log the action
                    addLog({
                        user: "current.user",
                        type: "system",
                        action: "Role created",
                        details: `Created role: ${name}`
                    });
                }
                
                // Reset form
                form.reset();
            } else {
                form.reportValidity();
            }
        }

        function editRole(roleId) {
            const role = roles.find(r => r.id === roleId);
            
            if (role) {
                // Open the add role modal (we'll repurpose it for editing)
                const modal = document.getElementById('addRoleModal');
                
                // Change the modal title
                modal.querySelector('.crm-modal-title').textContent = 'Edit Role';
                
                // Fill the form with existing role data
                document.getElementById('roleName').value = role.name;
                document.getElementById('roleDescription').value = role.description || '';
                
                // Change the submit button text
                document.getElementById('submitRoleBtn').textContent = 'Save Changes';
                
                // Store the role ID in a data attribute
                modal.setAttribute('data-edit-role-id', roleId);
                
                // Open the modal
                openModal('addRoleModal');
            } else {
                console.error('Role not found');
            }
        }

        function deleteRole(roleId) {
            // In a real application, this would show a confirmation dialog
            if (confirm('Are you sure you want to delete this role?')) {
                // Find role index
                const roleIndex = roles.findIndex(role => role.id === roleId);
                
                if (roleIndex !== -1) {
                    // Remove role from array
                    const roleName = roles[roleIndex].name;
                    roles.splice(roleIndex, 1);
                    
                    // Render roles
                    renderRoles();
                    
                    // Show notification
                    showNotification('Role deleted successfully!');
                    
                    // Log the action
                    addLog({
                        user: "current.user",
                        type: "system",
                        action: "Role deleted",
                        details: `Deleted role: ${roleName}`
                    });
                }
            }
        }
        function closeModal(modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            
            // Reset forms and edit state
            if (modal.id === 'addEventModal') {
                document.getElementById('addEventForm').reset();
            } else if (modal.id === 'addAnnouncementModal') {
                document.getElementById('addAnnouncementForm').reset();
            } else if (modal.id === 'addRoleModal') {
                document.getElementById('addRoleForm').reset();
                modal.querySelector('.crm-modal-title').textContent = 'Add New Role';
                document.getElementById('submitRoleBtn').textContent = 'Create Role';
                modal.removeAttribute('data-edit-role-id');
            }
        }
        function renderRoles() {
            // Clear list
            userRolesList.innerHTML = '';
            
            // Add roles to list
            roles.forEach(role => {
                const roleElement = document.createElement('div');
                roleElement.className = 'crm-user-role';
                roleElement.innerHTML = `
                    <div class="crm-user-role-name">${role.name}</div>
                    <div class="crm-text-sm crm-text-muted">${role.description}</div>
                    <div class="crm-user-role-actions">
                        <button class="crm-btn crm-btn-sm crm-btn-outline" onclick="editRole(${role.id})">Edit</button>
                        <button class="crm-btn crm-btn-sm crm-btn-outline" onclick="deleteRole(${role.id})">Delete</button>
                    </div>
                `;
                
                userRolesList.appendChild(roleElement);
            });
        }
        function savePermissions() {
            // In a real application, this would save the permissions to the server
            showNotification('Permissions saved successfully!');
            
            // Log the action
            addLog({
                user: "current.user",
                type: "system",
                action: "Permissions updated",
                details: "Updated user role permissions"
            });
        }

        // Show Notification Function
        function showNotification(message) {
            notification.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Make functions available globally for onclick handlers
        window.exportData = exportData;
        window.customExport = customExport;
        window.editRole = editRole;
        window.deleteRole = deleteRole;

       