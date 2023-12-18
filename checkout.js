// Event listener for DOM content load
document.addEventListener('DOMContentLoaded', function() {
    // Get the checkout form element
    const checkoutForm = document.getElementById('checkout-form');

    // Add event listener for form submission
    checkoutForm.addEventListener('submit', function(event) {
        console.log("Form submit event triggered");
        event.preventDefault(); // Prevent default form submission

        // Retrieve cart items from local storage
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cartItems.length === 0) {
            alert('Your cart is empty.'); // Alert if the cart is empty
            return;
        }

        // Collect form data
        const formData = new FormData(checkoutForm);
        formData.append('cart', JSON.stringify(cartItems)); // Append cart items to form data

        // Send form data to server
        fetch('process_checkout.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json()) // Parse JSON response from server
        .then(data => {
            if (data.status === 'success') {
                window.location.href = data.redirect; // Redirect on success
            } else {
                console.error('Error:', data.message); // Log and alert error
                alert('Error: ' + data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error); // Catch and alert fetch errors
            alert('An error occurred: ' + error);
        });
    });
});
