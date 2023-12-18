document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log("Processing payment...");

        // Retrieve cart data from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');

        // If cart is empty, prevent proceeding
        if (cartItems.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        // Prepare form data for submission
        const formData = new FormData(paymentForm);
        formData.append('cart', JSON.stringify(cartItems)); // Append cart items to form data

        console.log("Submitting the following data to process_payment.php:");
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }

        // Send the form data to process_payment.php
        fetch('process_payment.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Received response:", data);
            // Handle response data here
            if(data.status === 'success') {
                // On success, redirect to the confirmation page with order_id
                window.location.href = 'confirmation.html?order_id=' + data.order_id;
            } else {
                // On failure, display an error message
                alert('Payment processing failed: ' + data.message);
            }
        })
        .catch((error) => {
            // Handle any errors that occur during fetch
            console.error('Error:', error);
            alert('An error occurred while processing your payment.');
        });
    });
});
