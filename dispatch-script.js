document.addEventListener("DOMContentLoaded", () => {
    // Show loader
    const loader = document.getElementById("loader")
    loader.classList.add("show")
  
    // Simulate loading time
    setTimeout(() => {
      loader.classList.remove("show")
      showToast("success", "Welcome!", "Dispatch Management System loaded successfully.")
    }, 800)
  
    // Tab switching
    const tabButtons = document.querySelectorAll(".tab-btn")
    const tabContents = document.querySelectorAll(".tab-content")
  
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabId = button.getAttribute("data-tab")
  
        // Remove active class from all buttons and contents
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        tabContents.forEach((content) => content.classList.remove("active"))
  
        // Add active class to clicked button and corresponding content
        button.classList.add("active")
        document.getElementById(`${tabId}-tab`).classList.add("active")
      })
    })
  
    // Toggle view (Table/Card)
    const tableViewBtn = document.getElementById("tableViewBtn")
    const cardViewBtn = document.getElementById("cardViewBtn")
    const tableView = document.getElementById("tableView")
    const cardView = document.getElementById("cardView")
  
    tableViewBtn.addEventListener("click", () => {
      tableView.classList.add("active")
      cardView.classList.remove("active")
      tableViewBtn.classList.add("active")
      cardViewBtn.classList.remove("active")
    })
  
    cardViewBtn.addEventListener("click", () => {
      cardView.classList.add("active")
      tableView.classList.remove("active")
      cardViewBtn.classList.add("active")
      tableViewBtn.classList.remove("active")
    })
  
    // Toggle filters
    const toggleFiltersBtn = document.getElementById("toggleFilters")
    const filterBody = document.querySelector(".filter-body")
  
    toggleFiltersBtn.addEventListener("click", () => {
      filterBody.classList.toggle("hidden")
      toggleFiltersBtn.querySelector("i").classList.toggle("fa-chevron-up")
      toggleFiltersBtn.querySelector("i").classList.toggle("fa-chevron-down")
    })
  
    // Modal handling
    const newDispatchBtn = document.getElementById("newDispatchBtn")
    const dispatchModal = document.getElementById("dispatchModal")
    const closeDispatchModal = document.getElementById("closeDispatchModal")
    const cancelDispatch = document.getElementById("cancelDispatch")
  
    const newTransferBtn = document.getElementById("newTransferBtn")
    const transferModal = document.getElementById("transferModal")
    const closeTransferModal = document.getElementById("closeTransferModal")
    const cancelTransfer = document.getElementById("cancelTransfer")
  
    const viewDispatchModal = document.getElementById("viewDispatchModal")
    const closeViewDispatchModal = document.getElementById("closeViewDispatchModal")
    const backToListBtn = document.getElementById("backToListBtn")
  
    // Open dispatch modal
    newDispatchBtn.addEventListener("click", () => {
      openModal(dispatchModal)
    })
  
    // Close dispatch modal
    closeDispatchModal.addEventListener("click", () => {
      closeModal(dispatchModal)
    })
  
    cancelDispatch.addEventListener("click", () => {
      closeModal(dispatchModal)
    })
  
    // Open transfer modal
    newTransferBtn.addEventListener("click", () => {
      openModal(transferModal)
    })
  
    // Close transfer modal
    closeTransferModal.addEventListener("click", () => {
      closeModal(transferModal)
    })
  
    cancelTransfer.addEventListener("click", () => {
      closeModal(transferModal)
    })
  
    // View dispatch details
    const viewButtons = document.querySelectorAll(".view-btn")
    viewButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        const dispatchId = button.getAttribute("data-id")
        if (dispatchId) {
          // In a real app, you would fetch the dispatch details here
          console.log(`Viewing dispatch: ${dispatchId}`)
          openModal(viewDispatchModal)
        }
      })
    })
  
    // Close view dispatch modal
    closeViewDispatchModal.addEventListener("click", () => {
      closeModal(viewDispatchModal)
    })
  
    backToListBtn.addEventListener("click", () => {
      closeModal(viewDispatchModal)
    })
  
    // Helper functions for modals
    function openModal(modal) {
      modal.classList.add("show")
      document.body.style.overflow = "hidden"
    }
  
    function closeModal(modal) {
      modal.classList.remove("show")
      document.body.style.overflow = "auto"
    }
  
    // Close modals when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === dispatchModal) {
        closeModal(dispatchModal)
      }
      if (e.target === transferModal) {
        closeModal(transferModal)
      }
      if (e.target === viewDispatchModal) {
        closeModal(viewDispatchModal)
      }
    })
  
    // Form tab switching
    const formTabs = document.querySelectorAll(".form-tab")
    const formTabContents = document.querySelectorAll(".form-tab-content")
  
    formTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const tabId = tab.getAttribute("data-tab")
  
        // Remove active class from all tabs and contents
        formTabs.forEach((t) => t.classList.remove("active"))
        formTabContents.forEach((content) => content.classList.remove("active"))
  
        // Add active class to clicked tab and corresponding content
        tab.classList.add("active")
        document.getElementById(`${tabId}-tab`).classList.add("active")
      })
    })
  
    // Form validation
    const dispatchForm = document.getElementById("dispatchForm")
    dispatchForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // Reset error messages
      document.querySelectorAll(".form-error").forEach((el) => (el.textContent = ""))
  
      // Validate required fields
      let isValid = true
  
      const salesOrder = document.getElementById("salesOrder")
      if (!salesOrder.value) {
        document.getElementById("salesOrderError").textContent = "Please select a sales order"
        isValid = false
      }
  
      const dispatchDate = document.getElementById("dispatchDate")
      if (!dispatchDate.value) {
        document.getElementById("dispatchDateError").textContent = "Please select a dispatch date"
        isValid = false
      }
  
      const warehouse = document.getElementById("warehouse")
      if (!warehouse.value) {
        document.getElementById("warehouseError").textContent = "Please select a warehouse"
        isValid = false
      }
  
      const deliveryDate = document.getElementById("deliveryDate")
      if (!deliveryDate.value) {
        document.getElementById("deliveryDateError").textContent = "Please select a delivery date"
        isValid = false
      }
  
      const shippingAddress = document.getElementById("shippingAddress")
      if (!shippingAddress.value) {
        document.getElementById("shippingAddressError").textContent = "Please enter a shipping address"
        isValid = false
      }
  
      if (!isValid) {
        // Show error toast
        showToast("error", "Validation Error", "Please fill in all required fields.")
        return
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
      }
  
      // Collect items data
      const itemRows = document.querySelectorAll("#dispatchItemsTable tbody tr:not(#addItemRow)")
      itemRows.forEach((row) => {
        const product = row.cells[0].textContent
        const dispatchQty = row.querySelector(".dispatch-qty").value
  
        formData.items.push({
          product,
          dispatchQty,
        })
      })
  
      // Show loader
      loader.classList.add("show")
  
      // Simulate API call
      setTimeout(() => {
        // Here you would typically send this data to your backend
        console.log("Dispatch form submitted:", formData)
  
        // Hide loader
        loader.classList.remove("show")
  
        // Close the modal
        closeModal(dispatchModal)
  
        // Show success message
        showToast("success", "Success!", "Dispatch created successfully.")
  
        // Add new row to the table (for demo purposes)
        addNewDispatchRow(formData)
      }, 1500)
    })
  
    const transferForm = document.getElementById("transferForm")
    transferForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // Reset error messages
      document.querySelectorAll(".form-error").forEach((el) => (el.textContent = ""))
  
      // Validate required fields
      let isValid = true
  
      const fromWarehouse = document.getElementById("fromWarehouse")
      if (!fromWarehouse.value) {
        document.getElementById("fromWarehouseError").textContent = "Please select a source warehouse"
        isValid = false
      }
  
      const toWarehouse = document.getElementById("toWarehouse")
      if (!toWarehouse.value) {
        document.getElementById("toWarehouseError").textContent = "Please select a destination warehouse"
        isValid = false
      }
  
      const transferDate = document.getElementById("transferDate")
      if (!transferDate.value) {
        document.getElementById("transferDateError").textContent = "Please select a transfer date"
        isValid = false
      }
  
      if (fromWarehouse.value === toWarehouse.value && fromWarehouse.value !== "") {
        document.getElementById("toWarehouseError").textContent = "Source and destination warehouses cannot be the same"
        isValid = false
      }
  
      // Check if any items are added
      const itemRows = document.querySelectorAll("#transferItemsTable tbody tr:not(#addItemRow)")
      if (itemRows.length === 0) {
        showToast("error", "Validation Error", "Please add at least one item to transfer.")
        isValid = false
      }
  
      if (!isValid) {
        // Show error toast
        showToast("error", "Validation Error", "Please correct the errors in the form.")
        return
      }
  
      // Collect form data
      const formData = {
        fromWarehouse: fromWarehouse.value,
        toWarehouse: toWarehouse.value,
        transferDate: transferDate.value,
        status: document.getElementById("transferStatus").value,
        notes: document.getElementById("transferNotes").value,
        items: [],
      }
  
      // Collect items data
      itemRows.forEach((row) => {
        if (row.cells.length > 1) {
          const product = row.querySelector(".product-select")
            ? row.querySelector(".product-select").options[row.querySelector(".product-select").selectedIndex].text
            : row.cells[0].textContent
          const transferQty = row.querySelector(".transfer-qty").value
  
          formData.items.push({
            product,
            transferQty,
          })
        }
      })
  
      // Show loader
      loader.classList.add("show")
  
      // Simulate API call
      setTimeout(() => {
        // Here you would typically send this data to your backend
        console.log("Transfer form submitted:", formData)
  
        // Hide loader
        loader.classList.remove("show")
  
        // Close the modal
        closeModal(transferModal)
  
        // Show success message
        showToast("success", "Success!", "Stock transfer created successfully.")
      }, 1500)
    })
  
    // Add item to transfer table
    const addItemBtn = document.getElementById("addItemBtn")
    const transferItemsTable = document.getElementById("transferItemsTable")
    const addItemRow = document.getElementById("addItemRow")
  
    addItemBtn.addEventListener("click", () => {
      const newRow = document.createElement("tr")
      newRow.innerHTML = `
              <td>
                  <select class="form-control product-select" required>
                      <option value="">Select Product</option>
                      <option value="PRD-001">Premium Widget (PRD-001)</option>
                      <option value="PRD-002">Deluxe Gadget (PRD-002)</option>
                      <option value="PRD-003">Standard Component (PRD-003)</option>
                      <option value="PRD-004">Basic Module (PRD-004)</option>
                      <option value="PRD-005">Advanced System (PRD-005)</option>
                  </select>
              </td>
              <td class="available-qty">0</td>
              <td><input type="number" class="form-control transfer-qty" min="1" value="1"></td>
              <td>
                  <button type="button" class="action-btn remove-btn" title="Remove"><i class="fas fa-trash"></i></button>
              </td>
          `
  
      // Insert before the "Add Item" row
      transferItemsTable.querySelector("tbody").insertBefore(newRow, addItemRow)
  
      // Add event listener to product select
      const productSelect = newRow.querySelector(".product-select")
      productSelect.addEventListener("change", function () {
        const availableQty = getAvailableQuantity(this.value)
        newRow.querySelector(".available-qty").textContent = availableQty
  
        const transferQtyInput = newRow.querySelector(".transfer-qty")
        transferQtyInput.max = availableQty
        if (Number.parseInt(transferQtyInput.value) > availableQty) {
          transferQtyInput.value = availableQty
        }
      })
  
      // Add event listener to remove button
      newRow.querySelector(".remove-btn").addEventListener("click", () => {
        newRow.remove()
      })
    })
  
    // Add more items to dispatch
    const addMoreItemsBtn = document.getElementById("addMoreItemsBtn")
    const dispatchItemsTable = document.getElementById("dispatchItemsTable")
  
    addMoreItemsBtn.addEventListener("click", () => {
      const newRow = document.createElement("tr")
      newRow.innerHTML = `
              <td>
                  <select class="form-control product-select" required>
                      <option value="">Select Product</option>
                      <option value="PRD-001">Premium Widget (PRD-001)</option>
                      <option value="PRD-002">Deluxe Gadget (PRD-002)</option>
                      <option value="PRD-003">Standard Component (PRD-003)</option>
                      <option value="PRD-004">Basic Module (PRD-004)</option>
                      <option value="PRD-005">Advanced System (PRD-005)</option>
                  </select>
              </td>
              <td class="available-qty">0</td>
              <td class="order-qty">0</td>
              <td><input type="number" class="form-control dispatch-qty" min="1" value="1"></td>
              <td>
                  <button type="button" class="action-btn remove-btn" title="Remove"><i class="fas fa-trash"></i></button>
              </td>
          `
  
      // Add to the table
      dispatchItemsTable.querySelector("tbody").appendChild(newRow)
  
      // Add event listener to product select
      const productSelect = newRow.querySelector(".product-select")
      productSelect.addEventListener("change", function () {
        const availableQty = getAvailableQuantity(this.value)
        const orderQty = getOrderQuantity(this.value)
  
        newRow.querySelector(".available-qty").textContent = availableQty
        newRow.querySelector(".order-qty").textContent = orderQty
  
        const dispatchQtyInput = newRow.querySelector(".dispatch-qty")
        dispatchQtyInput.max = Math.min(availableQty, orderQty)
        dispatchQtyInput.value = Math.min(availableQty, orderQty)
      })
  
      // Add event listener to remove button
      newRow.querySelector(".remove-btn").addEventListener("click", () => {
        newRow.remove()
      })
    })
  
    // Check availability button
    const checkAvailabilityBtn = document.getElementById("checkAvailabilityBtn")
    checkAvailabilityBtn.addEventListener("click", () => {
      // Show loader
      loader.classList.add("show")
  
      // Simulate API call
      setTimeout(() => {
        // Hide loader
        loader.classList.remove("show")
  
        // Show success message
        showToast("info", "Stock Check", "All items are available in the selected warehouse.")
      }, 1000)
    })
  
    // Helper function to get available quantity (mock data)
    function getAvailableQuantity(productId) {
      const quantities = {
        "PRD-001": 250,
        "PRD-002": 120,
        "PRD-003": 0,
        "PRD-004": 15,
        "PRD-005": 75,
      }
  
      return quantities[productId] || 0
    }
  
    // Helper function to get order quantity (mock data)
    function getOrderQuantity(productId) {
      const quantities = {
        "PRD-001": 100,
        "PRD-002": 50,
        "PRD-003": 25,
        "PRD-004": 10,
        "PRD-005": 30,
      }
  
      return quantities[productId] || 0
    }
  
    // Helper function to add a new dispatch row (for demo purposes)
    function addNewDispatchRow(formData) {
      const dispatchTableBody = document.getElementById("dispatchTableBody")
      const newRow = document.createElement("tr")
  
      // Generate a new dispatch ID
      const dispatchId = "DSP-2023-" + (Math.floor(Math.random() * 1000) + 1).toString().padStart(3, "0")
  
      // Get customer name from sales order
      const salesOrderOption = document.querySelector(`#salesOrder option[value="${formData.salesOrder}"]`)
      const customerName = salesOrderOption ? salesOrderOption.textContent.split("-")[1].trim() : "Unknown Customer"
      const customerInitials = customerName
        .split(" ")
        .map((word) => word[0])
        .join("")
  
      newRow.innerHTML = `
              <td class="checkbox-cell">
                  <label class="checkbox">
                      <input type="checkbox" class="dispatch-checkbox">
                      <span class="checkmark"></span>
                  </label>
              </td>
              <td>${dispatchId}</td>
              <td>${formData.salesOrder}</td>
              <td>
                  <div class="customer-info">
                      <div class="customer-avatar">${customerInitials}</div>
                      <div class="customer-name">${customerName}</div>
                  </div>
              </td>
              <td>${formData.dispatchDate}</td>
              <td><span class="status-badge ${formData.status}">${capitalizeFirstLetter(formData.status)}</span></td>
              <td>
                  <div class="action-buttons">
                      <button class="action-btn view-btn" title="View Details" data-id="${dispatchId}">
                          <i class="fas fa-eye"></i>
                      </button>
                      <button class="action-btn edit-btn" title="Edit" data-id="${dispatchId}">
                          <i class="fas fa-edit"></i>
                      </button>
                      <button class="action-btn print-btn" title="Print Dispatch Advice" data-id="${dispatchId}">
                          <i class="fas fa-print"></i>
                      </button>
                      <div class="action-dropdown">
                          <button class="action-btn dropdown-btn" title="More Actions">
                              <i class="fas fa-ellipsis-v"></i>
                          </button>
                          <div class="dropdown-menu">
                              <a href="#" class="dropdown-item"><i class="fas fa-file-pdf"></i> Export as PDF</a>
                              <a href="#" class="dropdown-item"><i class="fas fa-file-excel"></i> Export as Excel</a>
                              <a href="#" class="dropdown-item"><i class="fas fa-copy"></i> Duplicate</a>
                              <a href="#" class="dropdown-item danger"><i class="fas fa-trash"></i> Delete</a>
                          </div>
                      </div>
                  </div>
              </td>
          `
  
      // Add to the top of the table
      dispatchTableBody.insertBefore(newRow, dispatchTableBody.firstChild)
  
      // Add event listeners to the new row
      const viewBtn = newRow.querySelector(".view-btn")
      viewBtn.addEventListener("click", () => {
        openModal(viewDispatchModal)
      })
  
      const dropdownBtn = newRow.querySelector(".dropdown-btn")
      dropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        const dropdown = dropdownBtn.nextElementSibling
        dropdown.classList.toggle("show")
      })
  
      // Also add to card view
      addNewDispatchCard(dispatchId, formData, customerName, customerInitials)
    }
  
    // Helper function to add a new dispatch card (for demo purposes)
    function addNewDispatchCard(dispatchId, formData, customerName, customerInitials) {
      const cardGrid = document.querySelector(".card-grid")
      const newCard = document.createElement("div")
      newCard.className = "dispatch-card"
  
      newCard.innerHTML = `
              <div class="card-header">
                  <div class="dispatch-id">${dispatchId}</div>
                  <span class="status-badge ${formData.status}">${capitalizeFirstLetter(formData.status)}</span>
              </div>
              <div class="card-body">
                  <div class="card-row">
                      <span class="card-label">Sales Order:</span>
                      <span class="card-value">${formData.salesOrder}</span>
                  </div>
                  <div class="card-row">
                      <span class="card-label">Customer:</span>
                      <span class="card-value">${customerName}</span>
                  </div>
                  <div class="card-row">
                      <span class="card-label">Dispatch Date:</span>
                      <span class="card-value">${formData.dispatchDate}</span>
                  </div>
                  <div class="card-row">
                      <span class="card-label">Items:</span>
                      <span class="card-value">${formData.items.length} items</span>
                  </div>
              </div>
              <div class="card-footer">
                  <button class="btn btn-sm btn-outline view-btn" data-id="${dispatchId}">
                      <i class="fas fa-eye"></i> View
                  </button>
                  <button class="btn btn-sm btn-outline edit-btn" data-id="${dispatchId}">
                      <i class="fas fa-edit"></i> Edit
                  </button>
                  <button class="btn btn-sm btn-outline print-btn" data-id="${dispatchId}">
                      <i class="fas fa-print"></i> Print
                  </button>
              </div>
          `
  
      // Add to the beginning of the grid
      cardGrid.insertBefore(newCard, cardGrid.firstChild)
  
      // Add event listeners to the new card
      const viewBtn = newCard.querySelector(".view-btn")
      viewBtn.addEventListener("click", () => {
        openModal(viewDispatchModal)
      })
    }
  
    // Filter functionality
    const applyFiltersBtn = document.getElementById("applyFiltersBtn")
    const resetFiltersBtn = document.getElementById("resetFiltersBtn")
  
    applyFiltersBtn.addEventListener("click", () => {
      const statusFilter = document.getElementById("statusFilter").value
      const startDate = document.getElementById("startDate").value
      const endDate = document.getElementById("endDate").value
      const warehouseFilter = document.getElementById("warehouseFilter").value
      const customerFilter = document.getElementById("customerFilter").value
  
      // Show loader
      loader.classList.add("show")
  
      // Simulate API call
      setTimeout(() => {
        // Here you would typically filter the data based on these values
        console.log("Filters applied:", { statusFilter, startDate, endDate, warehouseFilter, customerFilter })
  
        // Hide loader
        loader.classList.remove("show")
  
        // Show success message
        showToast("success", "Filters Applied", "The dispatch list has been filtered according to your criteria.")
      }, 800)
    })
  
    resetFiltersBtn.addEventListener("click", () => {
      document.getElementById("statusFilter").value = "all"
      document.getElementById("startDate").value = ""
      document.getElementById("endDate").value = ""
      document.getElementById("warehouseFilter").value = "all"
      document.getElementById("customerFilter").value = "all"
  
      // Show loader
      loader.classList.add("show")
  
      // Simulate API call
      setTimeout(() => {
        // Here you would typically reset the data display
        console.log("Filters reset")
  
        // Hide loader
        loader.classList.remove("show")
  
        // Show success message
        showToast("info", "Filters Reset", "All filters have been cleared.")
      }, 500)
    })
  
    // Search functionality
    const searchInput = document.getElementById("searchInput")
    searchInput.addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        const searchTerm = this.value.toLowerCase()
  
        if (searchTerm) {
          // Show loader
          loader.classList.add("show")
  
          // Simulate API call
          setTimeout(() => {
            // Here you would typically search the data based on this term
            console.log("Searching for:", searchTerm)
  
            // Hide loader
            loader.classList.remove("show")
  
            // Show success message
            showToast("info", "Search Results", `Showing results for: "${searchTerm}"`)
          }, 800)
        }
      }
    })
  
    // Pagination (mock functionality)
    const prevPageBtn = document.getElementById("prevPage")
    const nextPageBtn = document.getElementById("nextPage")
    const firstPageBtn = document.getElementById("firstPage")
    const lastPageBtn = document.getElementById("lastPage")
    const pageNumbers = document.querySelectorAll(".page-number")
  
    let currentPage = 1
    const totalPages = 5
  
    pageNumbers.forEach((pageBtn) => {
      pageBtn.addEventListener("click", function () {
        currentPage = Number.parseInt(this.textContent)
        updatePagination()
      })
    })
  
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--
        updatePagination()
      }
    })
  
    nextPageBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++
        updatePagination()
      }
    })
  
    firstPageBtn.addEventListener("click", () => {
      currentPage = 1
      updatePagination()
    })
  
    lastPageBtn.addEventListener("click", () => {
      currentPage = totalPages
      updatePagination()
    })
  
    function updatePagination() {
      // Update active page number
      pageNumbers.forEach((pageBtn) => {
        if (Number.parseInt(pageBtn.textContent) === currentPage) {
          pageBtn.classList.add("active")
        } else {
          pageBtn.classList.remove("active")
        }
      })
  
      // Disable/enable navigation buttons
      prevPageBtn.disabled = currentPage === 1
      firstPageBtn.disabled = currentPage === 1
      nextPageBtn.disabled = currentPage === totalPages
      lastPageBtn.disabled = currentPage === totalPages
  
      // Show loader
      loader.classList.add("show")
  
      // Simulate API call to get page data
      setTimeout(() => {
        // Here you would typically fetch the data for the current page
        console.log("Loading page:", currentPage)
  
        // Hide loader
        loader.classList.remove("show")
      }, 500)
    }
  
    // Dropdown menus
    document.addEventListener("click", (e) => {
      const dropdowns = document.querySelectorAll(".dropdown-menu")
      dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(e.target) && !dropdown.previousElementSibling.contains(e.target)) {
          dropdown.classList.remove("show")
        }
      })
    })
  
    const dropdownBtns = document.querySelectorAll(".dropdown-btn")
    dropdownBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation()
        const dropdown = this.nextElementSibling
  
        // Close all other dropdowns
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          if (menu !== dropdown) {
            menu.classList.remove("show")
          }
        })
  
        dropdown.classList.toggle("show")
      })
    })
  
    // Bulk actions
    const bulkActionBtn = document.getElementById("bulkActionBtn")
    const bulkActionMenu = document.getElementById("bulkActionMenu")
  
    bulkActionBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      bulkActionMenu.classList.toggle("show")
    })
  
    const selectAllCheckbox = document.getElementById("selectAllDispatches")
    const dispatchCheckboxes = document.querySelectorAll(".dispatch-checkbox")
  
    selectAllCheckbox.addEventListener("change", function () {
      dispatchCheckboxes.forEach((checkbox) => {
        checkbox.checked = this.checked
      })
    })
  
    // Bulk action handlers
    document.getElementById("bulkPrintBtn").addEventListener("click", (e) => {
      e.preventDefault()
      const selectedCount = document.querySelectorAll(".dispatch-checkbox:checked").length
  
      if (selectedCount === 0) {
        showToast("warning", "No Selection", "Please select at least one dispatch to print.")
        return
      }
  
      showToast("info", "Print Initiated", `Printing ${selectedCount} dispatch documents.`)
    })
  
    document.getElementById("bulkExportBtn").addEventListener("click", (e) => {
      e.preventDefault()
      const selectedCount = document.querySelectorAll(".dispatch-checkbox:checked").length
  
      if (selectedCount === 0) {
        showToast("warning", "No Selection", "Please select at least one dispatch to export.")
        return
      }
  
      showToast("info", "Export Initiated", `Exporting ${selectedCount} dispatch records.`)
    })
  
    document.getElementById("bulkDeleteBtn").addEventListener("click", (e) => {
      e.preventDefault()
      const selectedCount = document.querySelectorAll(".dispatch-checkbox:checked").length
  
      if (selectedCount === 0) {
        showToast("warning", "No Selection", "Please select at least one dispatch to delete.")
        return
      }
  
      if (confirm(`Are you sure you want to delete ${selectedCount} dispatch records? This action cannot be undone.`)) {
        showToast("success", "Deleted", `${selectedCount} dispatch records have been deleted.`)
  
        // In a real app, you would remove the selected rows here
      }
    })
  
    // Schedule navigation
    const prevWeekBtn = document.getElementById("prevWeekBtn")
    const nextWeekBtn = document.getElementById("nextWeekBtn")
    const currentWeekDisplay = document.getElementById("currentWeekDisplay")
  
    prevWeekBtn.addEventListener("click", () => {
      // In a real app, you would update the schedule data here
      currentWeekDisplay.textContent = "June 12 - June 18, 2023"
      showToast("info", "Schedule Updated", "Showing schedule for previous week.")
    })
  
    nextWeekBtn.addEventListener("click", () => {
      // In a real app, you would update the schedule data here
      currentWeekDisplay.textContent = "June 26 - July 2, 2023"
      showToast("info", "Schedule Updated", "Showing schedule for next week.")
    })
  
    // Schedule events
    const scheduleEvents = document.querySelectorAll(".schedule-event")
    scheduleEvents.forEach((event) => {
      event.addEventListener("click", function () {
        const dispatchId = this.getAttribute("data-id")
        console.log(`Viewing scheduled dispatch: ${dispatchId}`)
        openModal(viewDispatchModal)
      })
    })
  
    // File upload handling
    const fileInput = document.getElementById("attachments")
    const fileList = document.getElementById("fileList")
  
    fileInput.addEventListener("change", function () {
      fileList.innerHTML = ""
  
      if (this.files.length > 0) {
        for (let i = 0; i < this.files.length; i++) {
          const file = this.files[i]
          const fileItem = document.createElement("div")
          fileItem.className = "attachment-item"
  
          // Determine icon based on file type
          let icon = "fa-file"
          if (file.type.startsWith("image/")) {
            icon = "fa-file-image"
          } else if (file.type === "application/pdf") {
            icon = "fa-file-pdf"
          } else if (file.type.includes("spreadsheet") || file.type.includes("excel")) {
            icon = "fa-file-excel"
          } else if (file.type.includes("word")) {
            icon = "fa-file-word"
          }
  
          fileItem.innerHTML = `
                      <i class="fas ${icon}"></i>
                      <span>${file.name}</span>
                      <button type="button" class="attachment-remove"><i class="fas fa-times"></i></button>
                  `
  
          fileList.appendChild(fileItem)
  
          // Add remove button functionality
          fileItem.querySelector(".attachment-remove").addEventListener("click", () => {
            fileItem.remove()
            // Note: This doesn't actually remove the file from the input
            // In a real app, you would need to handle this properly
          })
        }
      }
    })
  
    // Save as draft functionality
    const saveAsDraftBtn = document.getElementById("saveAsDraft")
    saveAsDraftBtn.addEventListener("click", () => {
      document.getElementById("dispatchStatus").value = "pending"
  
      // Show loader
      loader.classList.add("show")
  
      // Simulate API call
      setTimeout(() => {
        // Hide loader
        loader.classList.remove("show")
  
        // Close the modal
        closeModal(dispatchModal)
  
        // Show success message
        showToast("success", "Draft Saved", "Dispatch has been saved as a draft.")
      }, 800)
    })
  
    // Table sorting
    const sortableHeaders = document.querySelectorAll("th.sortable")
    sortableHeaders.forEach((header) => {
      header.addEventListener("click", function () {
        const sortField = this.getAttribute("data-sort")
        const currentDirection = this.getAttribute("data-direction") || "asc"
        const newDirection = currentDirection === "asc" ? "desc" : "asc"
  
        // Reset all headers
        sortableHeaders.forEach((h) => {
          h.removeAttribute("data-direction")
          h.querySelector("i").className = "fas fa-sort"
        })
  
        // Set new direction
        this.setAttribute("data-direction", newDirection)
        this.querySelector("i").className = newDirection === "asc" ? "fas fa-sort-up" : "fas fa-sort-down"
  
        // Show loader
        loader.classList.add("show")
  
        // Simulate API call
        setTimeout(() => {
          // Here you would typically sort the data based on the field and direction
          console.log(`Sorting by ${sortField} in ${newDirection} order`)
  
          // Hide loader
          loader.classList.remove("show")
  
          // Show success message
          showToast(
            "info",
            "Table Sorted",
            `Sorted by ${formatSortField(sortField)} in ${newDirection === "asc" ? "ascending" : "descending"} order.`,
          )
        }, 500)
      })
    })
  
    // Toast notifications
    function showToast(type, title, message) {
      const toastContainer = document.getElementById("toastContainer")
      const toast = document.createElement("div")
      toast.className = `toast ${type}`
  
      let icon = "fa-info-circle"
      if (type === "success") icon = "fa-check-circle"
      if (type === "error") icon = "fa-exclamation-circle"
      if (type === "warning") icon = "fa-exclamation-triangle"
  
      toast.innerHTML = `
              <div class="toast-icon">
                  <i class="fas ${icon}"></i>
              </div>
              <div class="toast-content">
                  <div class="toast-title">${title}</div>
                  <div class="toast-message">${message}</div>
              </div>
              <button class="toast-close"><i class="fas fa-times"></i></button>
          `
  
      toastContainer.appendChild(toast)
  
      // Auto-remove after 5 seconds
      const timeout = setTimeout(() => {
        removeToast(toast)
      }, 5000)
  
      // Close button
      toast.querySelector(".toast-close").addEventListener("click", () => {
        clearTimeout(timeout)
        removeToast(toast)
      })
    }
  
    function removeToast(toast) {
      toast.classList.add("hide")
      setTimeout(() => {
        toast.remove()
      }, 300)
    }
  
    // Helper functions
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  
    function formatSortField(field) {
      const fieldMap = {
        id: "ID",
        so: "Sales Order",
        customer: "Customer",
        date: "Date",
        status: "Status",
        from: "From Warehouse",
        to: "To Warehouse",
        items: "Items",
        name: "Name",
        category: "Category",
        available: "Available Quantity",
        reserved: "Reserved Quantity",
        warehouse: "Warehouse",
      }
  
      return fieldMap[field] || field
    }
  })
  
  