 document.getElementById('search-button').addEventListener('click', () => {
    const searchInput = document.getElementById('search-input').value;
    const apiUrl = 'https://numista-zoho.ictdevs.co.za/api';
    require('dotenv').config();
    const token = 'process.env.API_TOKEN'; 

    if (!searchInput) {
        alert('Please enter a name or ID to search.');
        return;
    }
    
    // Determine if it's an ID (numeric) or name (non-numeric)
    if (isNaN(searchInput)) {
        // POST request if searching by name
        fetch(`${apiUrl}/customers/search`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ lookup: searchInput }),
        })
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('search-results');
            if (data && data.length > 0) {
                searchResults.innerHTML = generateSearchResultsHTML(data);
            } else {
                searchResults.innerHTML = 'No matching customers found.';
            }
        })
        .catch(error => {
            console.error('Error performing customer search:', error);
            document.getElementById('search-results').innerHTML = 'Error performing customer search.';
        });
    } else {
        // GET request if searching by ID
        fetch(`${apiUrl}/customers/${searchInput}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('search-results');
            if (data && data.id) {
                searchResults.innerHTML = generateSearchResultsHTML([data]); // Use data in an array for consistency
            } else {
                searchResults.innerHTML = 'No customer found with this ID.';
            }
        })
        .catch(error => {
            console.error('Error performing customer search by ID:', error);
            document.getElementById('search-results').innerHTML = 'Error performing customer search by ID.';
        });
    }
    
    function generateSearchResultsHTML(data) {
        let html = '<h3>Search Results</h3><ul>';
        data.forEach(customer => {
            html += `
                <li>
                    <p><strong>ID:</strong> ${customer.id}</p>
                    <p><strong>Name:</strong> ${customer.name}</p>
                    <p><strong>Email:</strong> ${customer.email}</p>
                    <p><strong>Contact Number:</strong> ${customer.mobile}</p>
                    <p><strong>Company Name:</strong> ${customer.company_name}</p>
                    <p><strong>Parent ID:</strong> ${customer.parent_id || 'Not Available'}</p>
                    <p><strong>Type:</strong> ${customer.type || 'Not Available'}</p>
                    <p><strong>Supplier:</strong> ${customer.is_supplier || 'Not Available'}</p>
                    <p><strong>Billing Account:</strong> ${customer.billing_account_number || 'Not Available'}</p>
                    <p><strong>Registration Number:</strong> ${customer.registration_number || 'Not Available'}</p>
                    <p><strong>ID Number:</strong> ${customer.id_number || 'Not Available'}</p>
                    <p><strong>Telephone:</strong> ${customer.telephone || 'Not Available'}</p>
                    <p><strong>Billing Date:</strong> ${customer.billing_date || 'Not Available'}</p>
                    <p><strong>Subscriber ID:</strong> ${customer.subscriber_id || 'Not Available'}</p>
                    <p><strong>Sync in Progress:</strong> ${customer.sync_in_progress || 'Not Available'}</p>
                    <p><strong>Admin Fees:</strong> ${customer.admin_fees || 'Not Available'}</p>
                    <p><strong>Rebate Level:</strong> ${customer.rebate_level || 'Not Available'}</p>
                    <p><strong>3CX Partner ID:</strong> ${customer.three_cx_partner_id || 'Not Available'}</p>
                    <p><strong>Client Zone Active:</strong> ${customer.client_zone_active || 'Not Available'}</p>
                    <p><strong>Odoo Contact ID:</strong> ${customer.odoo_contact_id || 'Not Available'}</p>
                    <p><strong>Odoo Subscription ID:</strong> ${customer.odoo_subscription_id || 'Not Available'}</p>
                </li>
            `;
        });
        html += '</ul>';
        return html;
    }
    
    function fetchCustomerDetails(customerId) {
        if (!customerId) {
            alert('Please enter a Customer ID.');
            return;
        }
    
        // Fetch customer details
        fetch(`${apiUrl}/customers/${customerId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('search-results');
            if (data && data.id) {
                searchResults.innerHTML = `
                    <h3>Customer Details</h3>
                    <p>ID: ${data.id}</p>
                    <p>Team ID: ${data.team_id}</p>
                    <p>Parent ID: ${data.parent_id}</p>
                    <p>Type: ${data.type}</p>
                    <p>Supplier: ${data.is_supplier}</p>
                    <p>Billing Account: ${data.billing_account_number}</p>
                    <p>Company Name: ${data.company_name}</p>
                    <p>Name: ${data.name}</p>
                    <p>Email: ${data.email}</p>
                    <p>Contact Number: ${data.mobile}</p>
                    <p>Registration Number: ${data.registration_number}</p>
                    <p>ID Number: ${data.id_number}</p>
                    <p>Telephone: ${data.telephone}</p>
                    <p>Billing Date: ${data.billing_date}</p>
                    <p>Subscriber ID: ${data.subscriber_id || 'Not Available'}</p>
                    <p>Sync in Progress: ${data.sync_in_progress}</p>
                    <p>Admin Fees: ${data.admin_fees}</p>
                    <p>Rebate Level: ${data.rebate_level}</p>
                    <p>3CX Partner ID: ${data.three_cx_partner_id || 'Not Available'}</p>
                    <p>Client Zone Active: ${data.client_zone_active}</p>
                    <p>Odoo Contact ID: ${data.odoo_contact_id || 'Not Available'}</p>
                    <p>Odoo Subscription ID: ${data.odoo_subscription_id || 'Not Available'}</p>
    
                    <h3>Annuity Details</h3>
                    <div id="annuity-details"></div>
                `;
    
                // Fetch annuity and its items
                fetch(`${apiUrl}/${customerId}/annuities`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                .then(response => response.json())
                .then(annuityData => {
                    const annuityDetails = document.getElementById('annuity-details');
                    if (annuityData && annuityData.length > 0) {
                        let annuityContent = '<h4>Annuities:</h4><ul>';
                        annuityData.forEach(annuity => {
                            annuityContent += `
                                <li>
                                    <p><strong>Reference:</strong> ${annuity.reference}</p>
                                    <p><strong>Billing Start Date:</strong> ${new Date(annuity.billing_start_date).toLocaleDateString()}</p>
                                    <p><strong>Total Recurring:</strong> ${annuity.total_recurring}</p>
                                    <h5>Annuity Items:</h5>
                                    <ul>
                            `;
    
                            if (annuity.annuity_items && annuity.annuity_items.length > 0) {
                                annuity.annuity_items.forEach(item => {
                                    annuityContent += `
                                        <li>
                                            <p><strong>Item Code:</strong> ${item.code}</p>
                                            <p><strong>Item Name:</strong> ${item.name}</p>
                                            <p><strong>Price:</strong> ${item.price}</p>
                                            <p><strong>Quantity:</strong> ${item.quantity}</p>
                                        </li>
                                    `;
                                });
                            } else {
                                annuityContent += '<li>No items available</li>';
                            }
    
                            annuityContent += `</ul></li>`;
                        });
                        annuityContent += '</ul>';
                        annuityDetails.innerHTML = annuityContent;
                    } else {
                        annuityDetails.innerHTML = '<p>No annuity details found.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching annuity details:', error);
                    document.getElementById('annuity-details').innerHTML = 'Error fetching annuity details.';
                });
            } else {
                searchResults.innerHTML = 'No customer details found.';
            }
        })
        .catch(error => {
            console.error('Error fetching customer details:', error);
            document.getElementById('search-results').innerHTML = 'Error fetching customer details.';
        });
    }
})