document.addEventListener("DOMContentLoaded", () => {
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
  
    // Modal handling
    const newInvoiceBtn = document.getElementById("newInvoiceBtn")
    const invoiceModal = document.getElementById("invoiceModal")
    const closeInvoiceModal = document.getElementById("closeInvoiceModal")
    const cancelInvoice = document.getElementById("cancelInvoice")
  
    const newServiceInvoiceBtn = document.getElementById("newServiceInvoiceBtn")
    const serviceInvoiceModal = document.getElementById("serviceInvoiceModal")
    const closeServiceInvoiceModal = document.getElementById("closeServiceInvoiceModal")
    const cancelServiceInvoice = document.getElementById("cancelServiceInvoice")
  
    // Open invoice modal
    newInvoiceBtn.addEventListener("click", () => {
      invoiceModal.style.display = "block"
      document.body.style.overflow = "hidden"
    })
  
    // Close invoice modal
    closeInvoiceModal.addEventListener("click", () => {
      invoiceModal.style.display = "none"
      document.body.style.overflow = "auto"
    })
  
    cancelInvoice.addEventListener("click", () => {
      invoiceModal.style.display = "none"
      document.body.style.overflow = "auto"
    })
  
    // Open service invoice modal
    newServiceInvoiceBtn.addEventListener("click", () => {
      serviceInvoiceModal.style.display = "block"
      document.body.style.overflow = "hidden"
    })
  
    // Close service invoice modal
    closeServiceInvoiceModal.addEventListener("click", () => {
      serviceInvoiceModal.style.display = "none"
      document.body.style.overflow = "auto"
    })
  
    cancelServiceInvoice.addEventListener("click", () => {
      serviceInvoiceModal.style.display = "none"
      document.body.style.overflow = "auto"
    })
  
    // Close modals when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === invoiceModal) {
        invoiceModal.style.display = "none"
        document.body.style.overflow = "auto"
      }
      if (e.target === serviceInvoiceModal) {
        serviceInvoiceModal.style.display = "none"
        document.body.style.overflow = "auto"
      }
    })
  
    // Add item to invoice
    const addItemBtn = document.getElementById("addItemBtn")
    const invoiceItemsTable = document.getElementById("invoiceItemsTable")
    const addItemRow = document.getElementById("addItemRow")
  
    addItemBtn.addEventListener("click", () => {
      const newRow = document.createElement("tr")
      newRow.innerHTML = `
              <td>
                  <select class="product-select">
                      <option value="">Select Product</option>
                      <option value="PRD-001">Premium Widget (PRD-001)</option>
                      <option value="PRD-002">Deluxe Gadget (PRD-002)</option>
                      <option value="PRD-003">Standard Component (PRD-003)</option>
                      <option value="PRD-004">Basic Module (PRD-004)</option>
                      <option value="PRD-005">Advanced System (PRD-005)</option>
                  </select>
              </td>
              <td><input type="text" class="item-description" placeholder="Description"></td>
              <td><input type="number" class="item-quantity" min="1" value="1"></td>
              <td><input type="number" class="item-price" min="0" step="0.01" value="0.00"></td>
              <td><input type="number" class="item-discount" min="0" max="100" value="0"></td>
              <td class="item-total">$0.00</td>
              <td>
                  <button type="button" class="action-btn remove-btn" title="Remove"><i class="fas fa-trash"></i></button>
              </td>
          `
  
      // Insert before the "Add Item" row
      invoiceItemsTable.querySelector("tbody").insertBefore(newRow, addItemRow)
  
      // Add event listeners to calculate total
      const quantityInput = newRow.querySelector(".item-quantity")
      const priceInput = newRow.querySelector(".item-price")
      const discountInput = newRow.querySelector(".item-discount")
  
      const calculateRowTotal = () => {
        const quantity = Number.parseInt(quantityInput.value) || 0
        const price = Number.parseFloat(priceInput.value) || 0
        const discount = Number.parseFloat(discountInput.value) || 0
  
        const total = quantity * price * (1 - discount / 100)
        newRow.querySelector(".item-total").textContent = `$${total.toFixed(2)}`
  
        updateInvoiceTotals()
      }
  
      quantityInput.addEventListener("input", calculateRowTotal)
      priceInput.addEventListener("input", calculateRowTotal)
      discountInput.addEventListener("input", calculateRowTotal)
  
      // Add event listener to remove button
      newRow.querySelector(".remove-btn").addEventListener("click", () => {
        newRow.remove()
        updateInvoiceTotals()
      })
  
      // Add event listener to product select
      const productSelect = newRow.querySelector(".product-select")
      productSelect.addEventListener("change", function () {
        const productPrices = {
          "PRD-001": 99.99,
          "PRD-002": 149.99,
          "PRD-003": 49.99,
          "PRD-004": 29.99,
          "PRD-005": 199.99,
        }
  
        const productDescriptions = {
          "PRD-001": "High-quality premium widget",
          "PRD-002": "Deluxe gadget with advanced features",
          "PRD-003": "Standard component for general use",
          "PRD-004": "Basic module for simple applications",
          "PRD-005": "Advanced system with comprehensive functionality",
        }
  
        if (this.value) {
          priceInput.value = productPrices[this.value] || 0
          newRow.querySelector(".item-description").value = productDescriptions[this.value] || ""
          calculateRowTotal()
        }
      })
    })
  
    // Add service to service invoice
    const addServiceBtn = document.getElementById("addServiceBtn")
    const serviceItemsTable = document.getElementById("serviceItemsTable")
    const addServiceRow = document.getElementById("addServiceRow")
  
    addServiceBtn.addEventListener("click", () => {
      const newRow = document.createElement("tr")
      newRow.innerHTML = `
              <td><input type="text" class="service-description" placeholder="Service Description"></td>
              <td><input type="number" class="service-quantity" min="1" value="1"></td>
              <td><input type="number" class="service-rate" min="0" step="0.01" value="0.00"></td>
              <td class="service-total">$0.00</td>
              <td>
                  <button type="button" class="action-btn remove-btn" title="Remove"><i class="fas fa-trash"></i></button>
              </td>
          `
  
      // Insert before the "Add Service" row
      serviceItemsTable.querySelector("tbody").insertBefore(newRow, addServiceRow)
  
      // Add event listeners to calculate total
      const quantityInput = newRow.querySelector(".service-quantity")
      const rateInput = newRow.querySelector(".service-rate")
  
      const calculateRowTotal = () => {
        const quantity = Number.parseInt(quantityInput.value) || 0
        const rate = Number.parseFloat(rateInput.value) || 0
  
        const total = quantity * rate
        newRow.querySelector(".service-total").textContent = `$${total.toFixed(2)}`
  
        updateServiceInvoiceTotals()
      }
  
      quantityInput.addEventListener("input", calculateRowTotal)
      rateInput.addEventListener("input", calculateRowTotal)
  
      // Add event listener to remove button
      newRow.querySelector(".remove-btn").addEventListener("click", () => {
        newRow.remove()
        updateServiceInvoiceTotals()
      })
    })
  
    // Update invoice totals
    function updateInvoiceTotals() {
      const itemTotals = Array.from(
        document.querySelectorAll("#invoiceItemsTable tbody tr:not(#addItemRow) .item-total"),
      ).map((el) => Number.parseFloat(el.textContent.replace("$", "")) || 0)
  
      const subtotal = itemTotals.reduce((sum, total) => sum + total, 0)
      const tax = subtotal * 0.1 // 10% tax
      const total = subtotal + tax
  
      document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`
      document.getElementById("tax").textContent = `$${tax.toFixed(2)}`
      document.getElementById("total").textContent = `$${total.toFixed(2)}`
    }
  
    // Update service invoice totals
    function updateServiceInvoiceTotals() {
      const serviceTotals = Array.from(
        document.querySelectorAll("#serviceItemsTable tbody tr:not(#addServiceRow) .service-total"),
      ).map((el) => Number.parseFloat(el.textContent.replace("$", "")) || 0)
  
      const subtotal = serviceTotals.reduce((sum, total) => sum + total, 0)
      const tax = subtotal * 0.1 // 10% tax
      const total = subtotal + tax
  
      document.getElementById("serviceSubtotal").textContent = `$${subtotal.toFixed(2)}`
      document.getElementById("serviceTax").textContent = `$${tax.toFixed(2)}`
      document.getElementById("serviceTotal").textContent = `$${total.toFixed(2)}`
    }
  
    // Form submissions
    const invoiceForm = document.getElementById("invoiceForm")
    invoiceForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // Collect form data
      const formData = {
        customer: document.getElementById("customer").value,
        salesOrder: document.getElementById("salesOrder").value,
        issueDate: document.getElementById("issueDate").value,
        dueDate: document.getElementById("dueDate").value,
        paymentTerms: document.getElementById("paymentTerms").value,
        status: document.getElementById("invoiceStatus").value,
        notes: document.getElementById("notes").value,
        items: [],
        subtotal: document.getElementById("subtotal").textContent,
        tax: document.getElementById("tax").textContent,
        total: document.getElementById("total").textContent,
      }
  
      // Collect items data
      const itemRows = document.querySelectorAll("#invoiceItemsTable tbody tr:not(#addItemRow)")
      itemRows.forEach((row) => {
        const product = row.querySelector(".product-select") ? row.querySelector(".product-select").value : ""
        const description = row.querySelector(".item-description") ? row.querySelector(".item-description").value : ""
        const quantity = row.querySelector(".item-quantity") ? row.querySelector(".item-quantity").value : ""
        const price = row.querySelector(".item-price") ? row.querySelector(".item-price").value : ""
        const discount = row.querySelector(".item-discount") ? row.querySelector(".item-discount").value : ""
        const total = row.querySelector(".item-total") ? row.querySelector(".item-total").textContent : ""
  
        formData.items.push({
          product,
          description,
          quantity,
          price,
          discount,
          total,
        })
      })
  
      // Here you would typically send this data to your backend
      console.log("Invoice form submitted:", formData)
  
      // For demo purposes, add a new row to the invoices table
      addNewInvoiceRow(formData)
  
      // Close the modal
      invoiceModal.style.display = "none"
      document.body.style.overflow = "auto"
  
      // Show success message
      alert("Invoice created successfully!")
    })
  
    const serviceInvoiceForm = document.getElementById("serviceInvoiceForm")
    serviceInvoiceForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // Collect form data
      const formData = {
        customer: document.getElementById("serviceCustomer").value,
        serviceType: document.getElementById("serviceType").value,
        serviceDate: document.getElementById("serviceDate").value,
        dueDate: document.getElementById("serviceDueDate").value,
        notes: document.getElementById("serviceNotes").value,
        services: [],
        subtotal: document.getElementById("serviceSubtotal").textContent,
        tax: document.getElementById("serviceTax").textContent,
        total: document.getElementById("serviceTotal").textContent,
      }
  
      // Collect services data
      const serviceRows = document.querySelectorAll("#serviceItemsTable tbody tr:not(#addServiceRow)")
      serviceRows.forEach((row) => {
        const description = row.querySelector(".service-description")
          ? row.querySelector(".service-description").value
          : ""
        const quantity = row.querySelector(".service-quantity") ? row.querySelector(".service-quantity").value : ""
        const rate = row.querySelector(".service-rate") ? row.querySelector(".service-rate").value : ""
        const total = row.querySelector(".service-total") ? row.querySelector(".service-total").textContent : ""
  
        formData.services.push({
          description,
          quantity,
          rate,
          total,
        })
      })
  
      // Here you would typically send this data to your backend
      console.log("Service Invoice form submitted:", formData)
  
      // Close the modal
      serviceInvoiceModal.style.display = "none"
      document.body.style.overflow = "auto"
  
      // Show success message
      alert("Service Invoice created successfully!")
    })
  
    // Helper function to add a new invoice row (for demo purposes)
    function addNewInvoiceRow(formData) {
      const invoiceTableBody = document.getElementById("invoiceTableBody")
      const newRow = document.createElement("tr")
  
      // Generate a new invoice ID
      const invoiceId = "INV-2023-" + (Math.floor(Math.random() * 1000) + 1).toString().padStart(3, "0")
  
      // Get customer name
      const customerOption = document.querySelector(`#customer option[value="${formData.customer}"]`)
      const customerName = customerOption ? customerOption.textContent : "Unknown Customer"
  
      // Determine status class
      const statusClass = formData.status === "draft" ? "draft" : formData.status === "pending" ? "pending" : "paid"
  
      newRow.innerHTML = `
              <td>${invoiceId}</td>
              <td>${customerName}</td>
              <td>${formData.issueDate}</td>
              <td>${formData.dueDate}</td>
              <td>${formData.total}</td>
              <td><span class="status-badge ${statusClass}">${formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}</span></td>
              <td>
                  <div class="action-buttons">
                      <button class="action-btn view-btn" title="View"><i class="fas fa-eye"></i></button>
                      <button class="action-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                      <button class="action-btn print-btn" title="Print"><i class="fas fa-print"></i></button>
                      <button class="action-btn download-btn" title="Download"><i class="fas fa-download"></i></button>
                  </div>
              </td>
          `
  
      // Add to the top of the table
      invoiceTableBody.insertBefore(newRow, invoiceTableBody.firstChild)
    }
  
    // Filter functionality
    const applyFiltersBtn = document.getElementById("applyFiltersBtn")
    const resetFiltersBtn = document.getElementById("resetFiltersBtn")
  
    applyFiltersBtn.addEventListener("click", () => {
      const statusFilter = document.getElementById("statusFilter").value
      const startDate = document.getElementById("startDate").value
      const endDate = document.getElementById("endDate").value
      const customerFilter = document.getElementById("customerFilter").value
  
      // Here you would typically filter the data based on these values
      console.log("Filters applied:", { statusFilter, startDate, endDate, customerFilter })
  
      // For demo purposes, show a message
      alert("Filters applied successfully!")
    })
  
    resetFiltersBtn.addEventListener("click", () => {
      document.getElementById("statusFilter").value = "all"
      document.getElementById("startDate").value = ""
      document.getElementById("endDate").value = ""
      document.getElementById("customerFilter").value = "all"
  
      // Here you would typically reset the data display
      console.log("Filters reset")
  
      // For demo purposes, show a message
      alert("Filters reset successfully!")
    })
  
    // Search functionality
    const searchInput = document.getElementById("searchInput")
    searchInput.addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        const searchTerm = this.value.toLowerCase()
  
        // Here you would typically search the data based on this term
        console.log("Searching for:", searchTerm)
  
        // For demo purposes, show a message
        if (searchTerm) {
          alert(`Searching for: ${searchTerm}`)
        }
      }
    })
  
    // Pagination (mock functionality)
    const prevPageBtn = document.getElementById("prevPage")
    const nextPageBtn = document.getElementById("nextPage")
    const currentPageSpan = document.getElementById("currentPage")
  
    let currentPage = 1
    const totalPages = 5
  
    updatePagination()
  
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
  
    function updatePagination() {
      currentPageSpan.textContent = currentPage
      prevPageBtn.disabled = currentPage === 1
      nextPageBtn.disabled = currentPage === totalPages
    }
  
    // Save as draft functionality
    const saveAsDraftBtn = document.getElementById("saveAsDraft")
    saveAsDraftBtn.addEventListener("click", () => {
      document.getElementById("invoiceStatus").value = "draft"
      invoiceForm.dispatchEvent(new Event("submit"))
    })
  
    const saveServiceAsDraftBtn = document.getElementById("saveServiceAsDraft")
    saveServiceAsDraftBtn.addEventListener("click", () => {
      serviceInvoiceForm.dispatchEvent(new Event("submit"))
    })
  })
  
  
















