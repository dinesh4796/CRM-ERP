// Get the URL parameters for customer details
const urlParams = new URLSearchParams(window.location.search);
const customerName = urlParams.get('customerName');
const customerEmail = urlParams.get('email');
const customerPhone = urlParams.get('phone');

// Fill in the customer details in the form
document.getElementById('proposalName').value = customerName || 'N/A';
document.getElementById('proposalEmail').value = customerEmail || 'N/A';
document.getElementById('proposalPhone').value = customerPhone || 'N/A';

// Initialize the item list and totals
let items = [];
let subtotal = 0;

// Add item to the proposal
function addItem() {
    const itemName = document.getElementById('itemName').value;
    const itemQuantity = parseInt(document.getElementById('itemQuantity').value);
    const itemPrice = parseFloat(document.getElementById('itemPrice').value);

    if (itemName && itemQuantity && itemPrice) {
        const total = itemQuantity * itemPrice;
        items.push({ name: itemName, quantity: itemQuantity, price: itemPrice, total: total });

        // Update item list in table
        const itemList = document.getElementById('itemList');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${itemName}</td>
            <td>${itemQuantity}</td>
            <td>₹${itemPrice.toFixed(2)}</td>
            <td>₹${total.toFixed(2)}</td>
            <td><button type="button" class="btn btn-danger" onclick="removeItem(this)">Remove</button></td>
        `;
        itemList.appendChild(row);

        // Update the subtotal
        subtotal += total;
        document.getElementById('subtotal').innerText = `₹${subtotal.toFixed(2)}`;

        // Clear item input fields
        document.getElementById('itemName').value = '';
        document.getElementById('itemQuantity').value = '';
        document.getElementById('itemPrice').value = '';

        updateSummary();
    } else {
        alert('Please fill in all item details.');
    }
}

// Update the proposal summary
function updateSummary() {
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const taxes = parseFloat(document.getElementById('taxes').value) || 0;

    const discountAmount = (subtotal * discount) / 100;
    const taxAmount = (subtotal * taxes) / 100;

    const totalAmount = subtotal - discountAmount + taxAmount;

    document.getElementById('discountAmount').innerText = `₹${discountAmount.toFixed(2)}`;
    document.getElementById('taxAmount').innerText = `₹${taxAmount.toFixed(2)}`;
    document.getElementById('totalAmount').innerText = `₹${totalAmount.toFixed(2)}`;
}

// Generate PDF for the proposal
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set the font style
    doc.setFont('helvetica');
    
    // Title
    doc.setFontSize(18);
    doc.text(`Proposal for ${customerName}`, 10, 10);
    
    // Customer Details
    doc.setFontSize(12);
    doc.text(`Email: ${customerEmail}`, 10, 20);
    doc.text(`Phone: ${customerPhone}`, 10, 30);
    
    // Proposal Details
    doc.setFontSize(14);
    doc.text("Proposal Details:", 10, 40);
    doc.setFontSize(12);
    doc.text(`${document.getElementById('proposalDetails').value}`, 10, 45);

    // Itemized Breakdown Table
    doc.setFontSize(14);
    doc.text("Itemized Breakdown:", 10, 60);

    let yPosition = 70;
    items.forEach(item => {
        doc.text(`${item.name} (x${item.quantity}) - ₹${item.total.toFixed(2)}`, 10, yPosition);
        yPosition += 10;
    });

    // Add Discount and Taxes
    doc.text(`Discount: ₹${document.getElementById('discountAmount').innerText}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Taxes: ₹${document.getElementById('taxAmount').innerText}`, 10, yPosition);
    yPosition += 10;

    // Total
    doc.setFontSize(14);
    doc.text(`Total Amount: ₹${document.getElementById('totalAmount').innerText}`, 10, yPosition);

    // Save the PDF file with the customer's name
    const pdfFileName = `${customerName}_Proposal.pdf`;
    doc.save(pdfFileName);
}

// Handle form submission for the proposal
document.getElementById('proposal-form').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Proposal saved!');
});