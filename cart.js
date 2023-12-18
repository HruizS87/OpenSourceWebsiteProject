// Event listener for DOM content load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-items')) {
        // Display cart items if on the cart page
        displayCartItems();
    } else {
        // Initialize cart and attach event listeners on product pages
        initializeCart();
        attachAddToCartEventListeners();
    }
    // Update cart display (e.g., cart item count)
    updateCartDisplay();

    // Setup event listener for checkout process
	const checkoutButton = document.getElementById('proceed-to-checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', proceedToCheckout);
    }
});

// Initialize cart in local storage if not present
function initializeCart() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
}

// Attach event listeners to 'Add to Cart' buttons
function attachAddToCartEventListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCartClick);
    });
}

// Handle adding items to the cart
function handleAddToCartClick(event) {
    // Extract product details from DOM and create cart item object
    const product = event.target.closest('.product');
    const productId = product.dataset.id;
    const productName = product.querySelector('h3').innerText;
    const priceText = product.querySelector('.price').innerText;
    const price = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
    const imageSrc = product.querySelector('img').src;

    const cartItem = { id: productId, name: productName, price, image: imageSrc, quantity: 1 };
    addCartItem(cartItem);
}

// Add a new item to the cart or increase its quantity
function addCartItem(newItem) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    const existingItemIndex = cart.findIndex(item => item.id === newItem.id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity++;
    } else {
        cart.push(newItem);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Update the cart display (e.g., cart item count)
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const cartCountElement = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Display cart items on the cart page
function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart'));
    const cartItemsContainer = document.getElementById('cart-items');
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    // Create and append each cart item element
    cartItems.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        const itemElement = createCartItemElement(item, index);
        cartItemsContainer.appendChild(itemElement);
    });

    totalItemsElement.textContent = cartItems.length;
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// Create a DOM element for a cart item
function createCartItemElement(item, index) {
    // Construct cart item HTML structure
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-info">
            <h3 class="cart-item-name">${item.name}</h3>
            <p class="cart-item-price">Price: $${item.price.toFixed(2)}</p>
            <div class="cart-item-quantity">
                <label for="quantity_${index}">Quantity:</label>
                <input type="number" id="quantity_${index}" value="${item.quantity}" min="1" data-index="${index}" class="quantity-input">
            </div>
            <button class="remove-item" data-index="${index}">Remove</button>
        </div>
    `;

    // Attach event listeners for quantity change and item removal
    itemElement.querySelector('.quantity-input').addEventListener('change', (event) => updateItemQuantity(event, index));
    itemElement.querySelector('.remove-item').addEventListener('click', () => removeItemFromCart(index));

    return itemElement;
}

// Update item quantity in the cart
function updateItemQuantity(event, index) {
    const newQuantity = parseInt(event.target.value);
    let cart = JSON.parse(localStorage.getItem('cart'));
    if (newQuantity > 0) {
        cart[index].quantity = newQuantity;
    } else {
        // Remove item if quantity is set to 0
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// Remove an item from the cart
function removeItemFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// Handle checkout process
function proceedToCheckout(event) {
    // Prevent default action if event is present
    if(event) event.preventDefault();

    // Log and handle checkout process
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (cart.length === 0) {
        alert('Your cart is empty.');
    } else {
        window.location.href = 'checkout.html';
    }
}
