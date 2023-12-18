// Event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Extracting order ID from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');

    // Handling case where no order ID is found in URL
    if (!orderId) {
        document.getElementById('order-details').innerHTML = '<p>Order ID not found.</p>';
        return;
    }

    // Fetch order details from server using the order ID
    fetch('fetch_order_details.php?order_id=' + orderId)
    .then(response => {
        // Check if response is okay, throw error if not
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Handling successful data retrieval
        if(data.status === 'success') {
            const orderDetailsElement = document.getElementById('order-details');
            
            // Validating if total price is a valid number
            const totalPrice = parseFloat(data.order.total_price);
            if (isNaN(totalPrice)) {
                throw new Error('Total price is not a number.');
            }

            // Display basic order information
            orderDetailsElement.innerHTML = `
                <p>Thank you for your purchase!</p>
                <p>Your order ID is: <strong>${data.order.order_id}</strong></p>
                <p>Order Date: ${new Date(data.order.order_date).toLocaleString()}</p>
                <p>Total Price: $${totalPrice.toFixed(2)}</p>
            `;

            // Create and populate a list of order items
            let itemsList = document.createElement('ul');
            data.items.forEach(item => {
                let listItem = document.createElement('li');
                listItem.innerHTML = `${item.name} - $${parseFloat(item.price).toFixed(2)} x ${item.quantity}`;
                itemsList.appendChild(listItem);
            });

            // Append the list of items to the order details section
            orderDetailsElement.appendChild(itemsList);

            // Clear the cart in local storage and update cart count
            localStorage.setItem('cart', JSON.stringify([]));
            const cartCountElement = document.getElementById('cart-count');
            if (cartCountElement) {
                cartCountElement.textContent = '0';
            }
        } else {
            // Display error message if status is not 'success'
            document.getElementById('order-details').innerHTML = '<p>' + data.message + '</p>';
        }
    })
    .catch(error => {
        // Catch and display errors during the fetch process
        console.error('Error:', error);
        document.getElementById('order-details').innerHTML = '<p>An error occurred while fetching order details.</p>';
    });
});
