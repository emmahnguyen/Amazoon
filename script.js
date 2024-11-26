// Cart Data
const cart = [];
let totalCost = 0;

// User Data
let users = JSON.parse(localStorage.getItem('users')) || [];
let loggedInUser = localStorage.getItem('loggedInUser');

// Show the login screen if no user is logged in
if (!loggedInUser) {
    showSection('login');
} else {
    showSection('home');
}

// Function to switch between sections
function showSection(sectionId) {
    document.querySelectorAll('main > section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

// Handle Sign-Up
function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (users.find(user => user.email === email)) {
        alert('An account with this email already exists.');
        return;
    }

    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Account created successfully. Please log in.');
    showSection('login');
}

// Handle Log-In
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        loggedInUser = email;
        localStorage.setItem('loggedInUser', email);
        alert('Log in successful!');
        showSection('home');
    } else {
        alert('Invalid email or password.');
    }
}

// Function to log out
function logout() {
    loggedInUser = null;
    localStorage.removeItem('loggedInUser');
    showSection('login');
}

// Function to add items to the cart
function addToCart(productName, productPrice) {
    cart.push({ name: productName, price: productPrice });
    totalCost += productPrice;
    updateCartUI();
}

// Function to remove items from the cart
function removeFromCart(index) {
    totalCost -= cart[index].price;
    cart.splice(index, 1); // Remove item from the cart
    updateCartUI();
}

// Function to update the Cart UI
function updateCartUI() {
    const cartItemsDiv = document.getElementById('cart-items');
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `<p>No items in the cart.</p>`;
    } else {
        cartItemsDiv.innerHTML = cart
            .map((item, index) => `
                <div class="cart-item">
                    <span>${item.name} - $${item.price}</span>
                    <button onclick="removeFromCart(${index})">Remove</button>
                </div>
            `)
            .join('');
    }
    document.getElementById('total-cost').textContent = `Total: $${totalCost}`;
}

// Function to log out the user
function logout() {
    loggedInUser = null;
    localStorage.removeItem('loggedInUser');
    alert('You have been logged out.');
    showSection('login');
}

// Function to navigate to the payment section
function proceedToPayment() {
    if (cart.length === 0) {
        alert('Your cart is empty. Add items to proceed.');
        return;
    }
    showSection('payment');
}

// Handle Payment Method Selection
document.getElementById('payment-method').addEventListener('change', function () {
    const method = this.value;
    const paymentDetailsDiv = document.getElementById('payment-details');

    paymentDetailsDiv.classList.remove('hidden');
    if (method === 'credit-card') {
        paymentDetailsDiv.innerHTML = `
            <label for="card-number">Card Number:</label>
            <input type="text" id="card-number" required>
            <label for="expiry-date">Expiry Date:</label>
            <input type="month" id="expiry-date" required>
            <label for="cvv">CVV:</label>
            <input type="text" id="cvv" required>
        `;
    } else if (method === 'paypal') {
        paymentDetailsDiv.innerHTML = `
            <label for="paypal-email">PayPal Email:</label>
            <input type="email" id="paypal-email" required>
        `;

    }
});

// Process Payment
function processPayment(event) {
    event.preventDefault();

    const paymentMethod = document.getElementById('payment-method').value;
    let paymentDetails = '';

    if (paymentMethod === 'credit-card') {
        const cardNumber = document.getElementById('card-number').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;
        paymentDetails = `Card Number: ${cardNumber}, Expiry Date: ${expiryDate}, CVV: ${cvv}`;
    } else if (paymentMethod === 'paypal') {
        const paypalEmail = document.getElementById('paypal-email').value;
        paymentDetails = `PayPal Email: ${paypalEmail}`;
    }

    alert(`Payment Successful!\nPayment Method: ${paymentMethod}\nDetails: ${paymentDetails}`);
    cart.length = 0; // Clear the cart
    totalCost = 0; // Reset the total cost
    updateCartUI();
    showSection('home'); // Navigate back to home
}
