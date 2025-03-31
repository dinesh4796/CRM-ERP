// Initialize the contracts module
document.addEventListener("DOMContentLoaded", () => {
  // Load sample data if no data exists
  if (!localStorage.getItem("contracts")) {
    loadSampleData()
  }

  // Display contracts
  displayContracts()

  // Set up event listeners
  setupEventListeners()
})

// Sample data for initial load
function loadSampleData() {
  const sampleContracts = [
    {
      id: 1,
      name: "Website Development Agreement",
      client: "Acme Corporation",
      value: 5000,
      startDate: "2025-01-15",
      endDate: "2025-06-30",
      status: "active",
      description: "Development of a new corporate website with e-commerce functionality.",
      terms:
        "This agreement outlines the terms for website development services including design, development, testing, and deployment phases. Payment schedule: 30% upfront, 30% at design approval, 40% upon completion.",
    },
    {
      id: 2,
      name: "Monthly Maintenance Contract",
      client: "TechStart Inc.",
      value: 1200,
      startDate: "2025-02-01",
      endDate: "2026-01-31",
      status: "active",
      description: "Ongoing website maintenance and support services.",
      terms:
        "Monthly maintenance includes security updates, content updates (up to 5 hours per month), performance monitoring, and 24/7 emergency support. Billing occurs on the 1st of each month.",
    },
    {
      id: 3,
      name: "Digital Marketing Campaign",
      client: "Green Valley Foods",
      value: 3500,
      startDate: "2025-03-10",
      endDate: "2025-06-10",
      status: "pending",
      description: "Three-month social media marketing campaign for product launch.",
      terms:
        "This contract covers social media management, content creation, and paid advertising management for a 3-month period. Client will approve all content before publishing. Performance reports will be delivered weekly.",
    },
    {
      id: 4,
      name: "Mobile App Development",
      client: "HealthTrack",
      value: 15000,
      startDate: "2024-11-01",
      endDate: "2025-02-28",
      status: "expired",
      description: "Development of iOS and Android fitness tracking application.",
      terms:
        "This agreement covers the full development lifecycle of native mobile applications for iOS and Android platforms. Includes requirements gathering, design, development, testing, and deployment to app stores.",
    },
    {
      id: 5,
      name: "SEO Optimization Package",
      client: "Bright Furniture",
      value: 2400,
      startDate: "2025-04-01",
      endDate: "2025-09-30",
      status: "draft",
      description: "Six-month SEO optimization to improve search rankings.",
      terms:
        "This contract includes keyword research, on-page optimization, content strategy, link building, and monthly reporting. The goal is to improve organic search rankings for agreed-upon keywords.",
    },
  ]

  localStorage.setItem("contracts", JSON.stringify(sampleContracts))
}

// Set up all event listeners
function setupEventListeners() {
  // New contract button
  document.getElementById("new-contract-btn").addEventListener("click", openNewContractModal)

  // Close modal buttons
  document.getElementById("close-modal").addEventListener("click", closeContractModal)
  document.getElementById("cancel-contract").addEventListener("click", closeContractModal)

  // Close details modal
  document.getElementById("close-details").addEventListener("click", closeDetailsModal)
  document.getElementById("back-to-list").addEventListener("click", closeDetailsModal)

  // Close confirmation modal
  document.getElementById("close-confirm").addEventListener("click", closeConfirmModal)
  document.getElementById("cancel-confirm").addEventListener("click", closeConfirmModal)

  // Save contract form
  document.getElementById("contract-form").addEventListener("submit", saveContract)

  // Edit contract button
  document.getElementById("edit-contract").addEventListener("click", editCurrentContract)

  // Delete contract button
  document.getElementById("delete-contract").addEventListener("click", confirmDeleteContract)

  // Confirm action button
  document.getElementById("confirm-action").addEventListener("click", executeConfirmedAction)

  // Search functionality
  document.getElementById("search-btn").addEventListener("click", searchContracts)
  document.getElementById("search-input").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      searchContracts()
    }
  })

  // Filter functionality
  document.getElementById("apply-filters").addEventListener("click", applyFilters)
  document.getElementById("reset-filters").addEventListener("click", resetFilters)
}

// Display all contracts or filtered contracts
function displayContracts(filteredContracts = null) {
  const contractsList = document.getElementById("contracts-list")
  contractsList.innerHTML = ""

  const contracts = filteredContracts || getContracts()

  if (contracts.length === 0) {
    contractsList.innerHTML = `
              <div class="no-contracts">
                  <p>No contracts found. Create a new contract to get started.</p>
              </div>
          `
    return
  }

  contracts.forEach((contract) => {
    const contractCard = document.createElement("div")
    contractCard.className = "contract-card"
    contractCard.dataset.id = contract.id

    // Format the contract value as currency
    const formattedValue = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(contract.value)

    // Format dates for display
    const startDate = new Date(contract.startDate).toLocaleDateString()
    const endDate = new Date(contract.endDate).toLocaleDateString()

    contractCard.innerHTML = `
              <div class="contract-header">
                  <div>
                      <h3 class="contract-title">${contract.name}</h3>
                      <p class="contract-client">${contract.client}</p>
                  </div>
                  <span class="contract-status status-${contract.status}">${contract.status}</span>
              </div>
              <div class="contract-details">
                  <div class="detail-item">
                      <span class="detail-label">Value</span>
                      <span class="detail-value">${formattedValue}</span>
                  </div>
                  <div class="detail-item">
                      <span class="detail-label">Duration</span>
                      <span class="detail-value">${startDate} - ${endDate}</span>
                  </div>
              </div>
              <div class="contract-actions">
                  <button class="action-btn view-btn" title="View Details">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                  <button class="action-btn edit-btn" title="Edit Contract">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button class="action-btn delete-btn" title="Delete Contract">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
              </div>
          `

    contractsList.appendChild(contractCard)

    // Add event listeners to the buttons
    contractCard.querySelector(".view-btn").addEventListener("click", () => viewContract(contract.id))
    contractCard.querySelector(".edit-btn").addEventListener("click", () => editContract(contract.id))
    contractCard.querySelector(".delete-btn").addEventListener("click", () => confirmDeleteContract(contract.id))

    // Make the whole card clickable to view details
    contractCard.addEventListener("click", (e) => {
      // Only trigger if the click wasn't on a button
      if (!e.target.closest(".action-btn")) {
        viewContract(contract.id)
      }
    })
  })
}

// Get contracts from localStorage
function getContracts() {
  const contracts = localStorage.getItem("contracts")
  return contracts ? JSON.parse(contracts) : []
}

// Save contracts to localStorage
function saveContracts(contracts) {
  localStorage.setItem("contracts", JSON.stringify(contracts))
}

// Open the new contract modal
function openNewContractModal() {
  document.getElementById("modal-title").textContent = "New Contract"
  document.getElementById("contract-form").reset()
  document.getElementById("contract-id").value = ""

  // Set default dates
  const today = new Date().toISOString().split("T")[0]
  document.getElementById("start-date").value = today

  const nextYear = new Date()
  nextYear.setFullYear(nextYear.getFullYear() + 1)
  document.getElementById("end-date").value = nextYear.toISOString().split("T")[0]

  // Show the modal
  document.getElementById("contract-modal").style.display = "block"
}

// Close the contract modal
function closeContractModal() {
  document.getElementById("contract-modal").style.display = "none"
}

// Save a new or edited contract
function saveContract(e) {
  e.preventDefault()

  // Get form values
  const contractId = document.getElementById("contract-id").value
  const name = document.getElementById("contract-name").value
  const client = document.getElementById("client-name").value
  const value = Number.parseFloat(document.getElementById("contract-value").value)
  const startDate = document.getElementById("start-date").value
  const endDate = document.getElementById("end-date").value
  const status = document.getElementById("contract-status").value
  const description = document.getElementById("contract-description").value
  const terms = document.getElementById("contract-terms").value

  // Validate dates
  if (new Date(startDate) > new Date(endDate)) {
    alert("End date must be after start date")
    return
  }

  // Get existing contracts
  const contracts = getContracts()

  if (contractId) {
    // Edit existing contract
    const index = contracts.findIndex((c) => c.id == contractId)
    if (index !== -1) {
      contracts[index] = {
        ...contracts[index],
        name,
        client,
        value,
        startDate,
        endDate,
        status,
        description,
        terms,
      }
    }
  } else {
    // Create new contract
    const newId = contracts.length > 0 ? Math.max(...contracts.map((c) => c.id)) + 1 : 1
    contracts.push({
      id: newId,
      name,
      client,
      value,
      startDate,
      endDate,
      status,
      description,
      terms,
    })
  }

  // Save and refresh
  saveContracts(contracts)
  displayContracts()
  closeContractModal()
}

// View contract details
function viewContract(id) {
  const contracts = getContracts()
  const contract = contracts.find((c) => c.id == id)

  if (!contract) return

  // Store the current contract ID for edit/delete operations
  document.getElementById("details-modal").dataset.contractId = contract.id

  // Format the contract value as currency
  const formattedValue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(contract.value)

  // Format dates for display
  const startDate = new Date(contract.startDate).toLocaleDateString()
  const endDate = new Date(contract.endDate).toLocaleDateString()

  // Calculate contract duration in days
  const start = new Date(contract.startDate)
  const end = new Date(contract.endDate)
  const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))

  // Set the modal title
  document.getElementById("details-title").textContent = contract.name

  // Populate the details
  const detailsContainer = document.getElementById("contract-details")
  detailsContainer.innerHTML = `
          <div class="contract-view">
              <div class="contract-view-header">
                  <div>
                      <h3 class="contract-view-title">${contract.name}</h3>
                      <p class="contract-view-client">${contract.client}</p>
                  </div>
                  <span class="contract-status status-${contract.status}">${contract.status}</span>
              </div>
              
              <div class="contract-view-info">
                  <div class="info-item">
                      <span class="info-label">Contract Value</span>
                      <span class="info-value">${formattedValue}</span>
                  </div>
                  <div class="info-item">
                      <span class="info-label">Start Date</span>
                      <span class="info-value">${startDate}</span>
                  </div>
                  <div class="info-item">
                      <span class="info-label">End Date</span>
                      <span class="info-value">${endDate}</span>
                  </div>
                  <div class="info-item">
                      <span class="info-label">Duration</span>
                      <span class="info-value">${durationDays} days</span>
                  </div>
              </div>
              
              <div class="contract-view-section">
                  <h4 class="section-title">Description</h4>
                  <div class="section-content">
                      ${contract.description || "No description provided."}
                  </div>
              </div>
              
              <div class="contract-view-section">
                  <h4 class="section-title">Terms & Conditions</h4>
                  <div class="section-content">
                      ${contract.terms.replace(/\n/g, "<br>")}
                  </div>
              </div>
          </div>
      `

  // Show the modal
  document.getElementById("details-modal").style.display = "block"
}

// Close the details modal
function closeDetailsModal() {
  document.getElementById("details-modal").style.display = "none"
}

// Edit a contract
function editContract(id) {
  const contracts = getContracts()
  const contract = contracts.find((c) => c.id == id)

  if (!contract) return

  // Set form values
  document.getElementById("modal-title").textContent = "Edit Contract"
  document.getElementById("contract-id").value = contract.id
  document.getElementById("contract-name").value = contract.name
  document.getElementById("client-name").value = contract.client
  document.getElementById("contract-value").value = contract.value
  document.getElementById("start-date").value = contract.startDate
  document.getElementById("end-date").value = contract.endDate
  document.getElementById("contract-status").value = contract.status
  document.getElementById("contract-description").value = contract.description || ""
  document.getElementById("contract-terms").value = contract.terms || ""

  // Show the modal
  document.getElementById("contract-modal").style.display = "block"
}

// Edit the currently viewed contract
function editCurrentContract() {
  const contractId = document.getElementById("details-modal").dataset.contractId
  closeDetailsModal()
  editContract(contractId)
}

// Confirm delete contract
function confirmDeleteContract(id) {
  // If called from the details modal, get the ID from the modal
  if (!id) {
    id = document.getElementById("details-modal").dataset.contractId
  }

  // Store the ID for the confirmation action
  document.getElementById("confirm-modal").dataset.contractId = id
  document.getElementById("confirm-modal").dataset.action = "delete"

  // Show the confirmation modal
  document.getElementById("confirm-modal").style.display = "block"

  // If called from the details modal, close it
  if (document.getElementById("details-modal").style.display === "block") {
    closeDetailsModal()
  }
}

// Close the confirmation modal
function closeConfirmModal() {
  document.getElementById("confirm-modal").style.display = "none"
}

// Execute the confirmed action
function executeConfirmedAction() {
  const modal = document.getElementById("confirm-modal")
  const action = modal.dataset.action
  const id = modal.dataset.contractId

  if (action === "delete") {
    deleteContract(id)
  }

  closeConfirmModal()
}

// Delete a contract
function deleteContract(id) {
  let contracts = getContracts()
  contracts = contracts.filter((c) => c.id != id)
  saveContracts(contracts)
  displayContracts()
}

// Search contracts
function searchContracts() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase()

  if (!searchTerm.trim()) {
    displayContracts()
    return
  }

  const contracts = getContracts()
  const filteredContracts = contracts.filter(
    (contract) =>
      contract.name.toLowerCase().includes(searchTerm) ||
      contract.client.toLowerCase().includes(searchTerm) ||
      contract.description.toLowerCase().includes(searchTerm),
  )

  displayContracts(filteredContracts)
}

// Apply filters
function applyFilters() {
  const statusCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]')
  const dateFrom = document.getElementById("date-from").value
  const dateTo = document.getElementById("date-to").value

  // Get selected statuses
  const selectedStatuses = []
  statusCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedStatuses.push(checkbox.value)
    }
  })

  const contracts = getContracts()

  // Filter by status and date
  const filteredContracts = contracts.filter((contract) => {
    // Status filter
    const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(contract.status)

    // Date filter
    let dateMatch = true
    if (dateFrom) {
      dateMatch = dateMatch && new Date(contract.endDate) >= new Date(dateFrom)
    }
    if (dateTo) {
      dateMatch = dateMatch && new Date(contract.startDate) <= new Date(dateTo)
    }

    return statusMatch && dateMatch
  })

  displayContracts(filteredContracts)
}

// Reset filters
function resetFilters() {
  // Reset status checkboxes
  const statusCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]')
  statusCheckboxes.forEach((checkbox) => {
    checkbox.checked = true
  })

  // Reset date inputs
  document.getElementById("date-from").value = ""
  document.getElementById("date-to").value = ""

  // Reset search
  document.getElementById("search-input").value = ""

  // Display all contracts
  displayContracts()
}

