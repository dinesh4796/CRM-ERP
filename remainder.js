// Global variables
let currentEditLeadId = null;
let notificationCheckInterval = null;

// Function to toggle sidebar dropdown
function toggleDropdown(event) {
    event.preventDefault();
    const parent = event.currentTarget.parentElement;
    const submenu = parent.querySelector(".submenu");
    if (submenu) {
        submenu.classList.toggle("show");
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initApp);



// Function to get lead list from localStorage
function getLeadList() {
    return JSON.parse(localStorage.getItem("leads")) || [];
}

// Function to get notifications from localStorage
function getNotifications() {
    return JSON.parse(localStorage.getItem("notifications")) || [];
}

// Function to save notifications to localStorage
function saveNotifications(notifications) {
    localStorage.setItem("notifications", JSON.stringify(notifications));
}

// Function to save lead including reminder data
function saveLead(name, email, phone, address, source, nextFollowUp, status, reminderDate, reminderNotes, id = null) {
    const leadList = getLeadList();

    const newLead = {
        id: id || Date.now(), // If id is provided, use it, else create a new one
        name: name,
        email: email,
        phone: phone,
        address: address,
        source: source,
        nextFollowUp: nextFollowUp,
        status: status,
        reminder: {
            date: reminderDate,
            notes: reminderNotes,
        },
    };

    if (id) {
        // Update the existing lead
        const index = leadList.findIndex((lead) => lead.id === id);
        if (index !== -1) {
            leadList[index] = newLead; // Replace the lead with the updated data
        }
    } else {
        // Add new lead
        leadList.push(newLead);
    }

    localStorage.setItem("leads", JSON.stringify(leadList));

    // Refresh the lead list on the page
    loadLeadList();
    cancelForm();
    
    // Show toast notification
    showToast("Success", "Lead information saved successfully");
    
    // Check for reminders immediately after saving
    checkReminders();
}

// Function to format date and time for display
function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
}

// Function to load the lead list and include reminders
function loadLeadList() {
    const leadList = getLeadList();
    const leadListBody = document.getElementById("lead-list-body");
    leadListBody.innerHTML = ""; // Clear existing table rows

    // Populate the table with leads
    leadList.forEach((lead) => {
        const leadRow = document.createElement("tr");
        
        // Add classes for reminder styling
        if (lead.reminder && lead.reminder.date) {
            const reminderDate = new Date(lead.reminder.date);
            const now = new Date();
            
            if (reminderDate <= now) {
                leadRow.classList.add("reminder-due");
            } else {
                leadRow.classList.add("has-reminder");
            }
        }
        
        leadRow.innerHTML = `
            <td><input type="checkbox" class="lead-checkbox" onclick="toggleCreateProposalButton()" data-id="${lead.id}" /></td>
            <td>${lead.name}</td>
            <td>${lead.email}</td>
            <td>${lead.phone}</td>
            <td>${lead.source}</td>
            <td>${lead.nextFollowUp}</td>
            <td>${lead.status}</td>
            <td>${lead.reminder.date ? formatDateTime(lead.reminder.date) : "No reminder set"}</td>
            <td>
                <i class="fas fa-edit btn btn-warning btn-sm" onclick="editLead(${lead.id})" style="cursor: pointer;"></i>
                <i class="fas fa-trash-alt btn btn-danger btn-sm" onclick="deleteLead(${lead.id})" style="cursor: pointer;"></i>
            </td>
        `;
        leadListBody.appendChild(leadRow);
    });
}

// Function to show the form to add a new lead
function showForm() {
    document.getElementById("lead-form-container").style.display = "block";
    document.getElementById("customer-list-container").style.display = "none";
}

// Function to cancel the form and go back to the lead list
function cancelForm() {
    document.getElementById("lead-form-container").style.display = "none";
    document.getElementById("customer-list-container").style.display = "block";
    document.getElementById("lead-form").reset();
    currentEditLeadId = null;
}

// Function to edit a lead, including reminder information
function editLead(id) {
    const leadList = getLeadList();
    const lead = leadList.find((lead) => lead.id === id);

    if (lead) {
        // Populate the form with the existing lead's data
        document.getElementById("leadName").value = lead.name;
        document.getElementById("leadEmail").value = lead.email;
        document.getElementById("leadPhone").value = lead.phone;
        document.getElementById("leadAddress").value = lead.address;
        document.getElementById("leadSource").value = lead.source;
        document.getElementById("nextFollowUp").value = lead.nextFollowUp;
        document.getElementById("leadStatus").value = lead.status;
        document.getElementById("reminderDate").value = lead.reminder.date;
        document.getElementById("reminderNotes").value = lead.reminder.notes;

        // Show the form and hide the customer list
        document.getElementById("lead-form-container").style.display = "block";
        document.getElementById("customer-list-container").style.display = "none";

        // Set the ID of the lead being edited
        currentEditLeadId = id;
    }
}

// Function to delete a lead, including the reminder data
function deleteLead(id) {
    if (confirm("Are you sure you want to delete this lead?")) {
        let leadList = getLeadList();
        leadList = leadList.filter((lead) => lead.id !== id);
        localStorage.setItem("leads", JSON.stringify(leadList));
        
        // Also remove any notifications for this lead
        let notifications = getNotifications();
        notifications = notifications.filter(notification => notification.leadId !== id);
        saveNotifications(notifications);
        
        loadLeadList();
        updateNotificationUI();
        showToast("Success", "Lead deleted successfully");
    }
}

// Handle form submission
document.getElementById("lead-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("leadName").value;
    const email = document.getElementById("leadEmail").value;
    const phone = document.getElementById("leadPhone").value;
    const address = document.getElementById("leadAddress").value;
    const source = document.getElementById("leadSource").value;
    const nextFollowUp = document.getElementById("nextFollowUp").value;
    const status = document.getElementById("leadStatus").value;
    const reminderDate = document.getElementById("reminderDate").value;
    const reminderNotes = document.getElementById("reminderNotes").value;

    saveLead(name, email, phone, address, source, nextFollowUp, status, reminderDate, reminderNotes, currentEditLeadId);
});

// Function to select/deselect all checkboxes
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById("select-all");
    const checkboxes = document.querySelectorAll(".lead-checkbox");
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    toggleCreateProposalButton();
}

// Function to toggle "Create Proposal" button
function toggleCreateProposalButton() {
    const selectedLeads = document.querySelectorAll(".lead-checkbox:checked");
    const createProposalBtn = document.getElementById("createProposalBtn");
    createProposalBtn.disabled = selectedLeads.length === 0;
}

// Function to create a proposal
function createProposal() {
    const selectedLeads = document.querySelectorAll(".lead-checkbox:checked");

    if (selectedLeads.length > 1) {
        // If more than one lead is selected, show an alert
        showToast("Warning", "Please select only one lead to create a proposal", "warning");
    } else if (selectedLeads.length === 1) {
        const leadId = selectedLeads[0].getAttribute("data-id");
        const leadList = getLeadList();
        const selectedLeadDetails = leadList.find((lead) => lead.id == leadId);

        // Redirect to the proposal page with the lead's details, including email and phone number
        if (selectedLeadDetails) {
            const leadName = selectedLeadDetails.name;
            const leadEmail = selectedLeadDetails.email;
            const leadPhone = selectedLeadDetails.phone;

            showToast("Info", `Creating proposal for ${leadName}...`);
            // Uncomment the line below when proposal.html is ready
            window.location.href = `proposal.html?customerName=${encodeURIComponent(leadName)}&email=${encodeURIComponent(leadEmail)}&phone=${encodeURIComponent(leadPhone)}`;
        }
    } else {
        // If no lead is selected, disable the button
        showToast("Warning", "Please select a lead to create a proposal", "warning");
    }
}

// Function to check for due reminders
function checkReminders() {
    const leadList = getLeadList();
    const now = new Date();
    const notifications = getNotifications();
    let newNotificationsCount = 0;

    leadList.forEach((lead) => {
        if (lead.reminder && lead.reminder.date) {
            const reminderDate = new Date(lead.reminder.date);

            // Check if the reminder is due (current time is past the reminder time)
            if (reminderDate <= now) {
                // Check if this reminder has already been added to notifications
                const existingNotification = notifications.find(
                    (notification) => notification.leadId === lead.id && notification.reminderDate === lead.reminder.date
                );

                if (!existingNotification) {
                    // Add a new notification
                    notifications.push({
                        id: Date.now() + Math.random(),
                        leadId: lead.id,
                        leadName: lead.name,
                        reminderDate: lead.reminder.date,
                        notes: lead.reminder.notes,
                        timestamp: new Date().toISOString(),
                        read: false,
                    });
                    newNotificationsCount++;
                }
            }
        }
    });

    if (newNotificationsCount > 0) {
        // Save updated notifications
        saveNotifications(notifications);
        // Update the notification UI
        updateNotificationUI();
        // Play notification sound if available
        playNotificationSound();
        // Show toast notification
        showToast("Reminder", `${newNotificationsCount} new reminder${newNotificationsCount > 1 ? 's' : ''} available`, "info");
    }
}

// Function to play notification sound
function playNotificationSound() {
    // Use the audio element from the HTML
    const audio = document.getElementById("notification-sound");
    if (audio) {
        audio.play().catch((error) => {
            console.log("Audio playback failed:", error);
        });
    }
}

// Function to update the notification UI
function updateNotificationUI() {
    const notifications = getNotifications();
    const notificationList = document.getElementById("notificationList");
    const notificationBadge = document.getElementById("notification-badge");

    // Count unread notifications
    const unreadCount = notifications.filter((notification) => !notification.read).length;

    // Update badge
    if (unreadCount > 0) {
        notificationBadge.textContent = unreadCount;
        notificationBadge.classList.remove("d-none");
    } else {
        notificationBadge.classList.add("d-none");
    }

    // Clear existing notifications except the header
    while (notificationList.children.length > 2) {
        notificationList.removeChild(notificationList.lastChild);
    }

    // Remove the "no notifications" message if there are notifications
    if (notifications.length > 0) {
        const noNotificationsElement = notificationList.querySelector(".no-notifications");
        if (noNotificationsElement) {
            notificationList.removeChild(noNotificationsElement);
        }
    }

    // Add "Mark all as read" button if there are unread notifications
    if (unreadCount > 0) {
        const markAllReadItem = document.createElement("li");
        markAllReadItem.className = "mark-all-read";
        markAllReadItem.textContent = "Mark all as read";
        markAllReadItem.onclick = markAllNotificationsAsRead;
        notificationList.appendChild(markAllReadItem);
    }

    // Add notifications to the dropdown
    if (notifications.length > 0) {
        notifications
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .forEach((notification) => {
                const notificationItem = document.createElement("li");
                notificationItem.className = `notification-item ${notification.read ? "" : "unread"}`;
                notificationItem.dataset.id = notification.id;

                const reminderDate = new Date(notification.reminderDate);
                const formattedDate = reminderDate.toLocaleString();

                notificationItem.innerHTML = `
                    <div class="notification-title">Reminder for ${notification.leadName}</div>
                    <div class="notification-time">${formattedDate}</div>
                    <div class="notification-message">${notification.notes || "No notes provided"}</div>
                `;

                notificationItem.onclick = () => {
                    markNotificationAsRead(notification.id);
                    // Optionally, navigate to the lead details or highlight the lead in the table
                    highlightLeadInTable(notification.leadId);
                };

                notificationList.appendChild(notificationItem);
            });
    } else {
        // Show "no notifications" message
        const noNotificationsItem = document.createElement("li");
        noNotificationsItem.className = "no-notifications";
        noNotificationsItem.textContent = "No reminders to display";
        notificationList.appendChild(noNotificationsItem);
    }
}

// Function to mark a notification as read
function markNotificationAsRead(notificationId) {
    const notifications = getNotifications();
    const notificationIndex = notifications.findIndex((notification) => notification.id == notificationId);

    if (notificationIndex !== -1) {
        notifications[notificationIndex].read = true;
        saveNotifications(notifications);
        updateNotificationUI();
    }
}

// Function to mark all notifications as read
function markAllNotificationsAsRead() {
    const notifications = getNotifications();

    notifications.forEach((notification) => {
        notification.read = true;
    });

    saveNotifications(notifications);
    updateNotificationUI();
    showToast("Success", "All reminders marked as read");
}

// Function to highlight a lead in the table
function highlightLeadInTable(leadId) {
    // First, remove any existing highlights
    const allRows = document.querySelectorAll("#lead-list-body tr");
    allRows.forEach((row) => {
        row.classList.remove("table-primary");
    });

    // Find the checkbox with the matching lead ID
    const checkbox = document.querySelector(`.lead-checkbox[data-id="${leadId}"]`);
    if (checkbox) {
        // Highlight the parent row
        const row = checkbox.closest("tr");
        row.classList.add("table-primary");

        // Scroll to the row
        row.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

// Function to create and show toast notifications
function showToast(title, message, type = "success") {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Set icon based on type
    let iconClass = 'fa-check-circle';
    let iconColor = '#007bff';
    
    if (type === 'warning') {
        iconClass = 'fa-exclamation-triangle';
        iconColor = '#ffc107';
    } else if (type === 'error') {
        iconClass = 'fa-times-circle';
        iconColor = '#dc3545';
    } else if (type === 'info') {
        iconClass = 'fa-info-circle';
        iconColor = '#17a2b8';
    }
    
    // Create toast content
    toast.innerHTML = `
        <div class="toast-icon" style="background-color: ${iconColor}">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <div class="toast-close" onclick="this.parentElement.classList.add('hide')">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
        }, 300); // Wait for animation to complete
    }, 5000);
}

// Initialize the application
function initApp() {
    // Load leads on page load
    loadLeadList();

    // Update notification UI
    updateNotificationUI();

    // Start checking for reminders every minute
    if (notificationCheckInterval) {
        clearInterval(notificationCheckInterval);
    }
    notificationCheckInterval = setInterval(checkReminders, 60000); // Check every minute

    // Also check immediately on page load
    checkReminders();
}
