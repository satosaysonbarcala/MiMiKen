document.addEventListener('DOMContentLoaded', () => {
    // Shared elements across pages
    const headerNavLinks = document.querySelectorAll('header nav ul li a');
    headerNavLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active'); // Optional: Add active class for current page
        }
    });

    // --- Books Page Logic ---
    const bookSelect = document.getElementById('book-select');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const bookDetailsDiv = document.getElementById('book-details');
    const selectedBookTitleSpan = document.getElementById('selected-book-title');
    const selectedBookPriceSpan = document.getElementById('selected-book-price');

    if (bookSelect && addToCartBtn) {
        bookSelect.addEventListener('change', () => {
            const selectedValue = bookSelect.value;
            if (selectedValue) {
                const [titlePart, pricePart] = selectedValue.split('|');
                const title = titlePart.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
                const price = parseFloat(pricePart).toFixed(2);

                selectedBookTitleSpan.textContent = title;
                selectedBookPriceSpan.textContent = `$${price}`;
                bookDetailsDiv.classList.remove('hidden');
            } else {
                bookDetailsDiv.classList.add('hidden');
            }
        });

        addToCartBtn.addEventListener('click', () => {
            const selectedValue = bookSelect.value;
            if (selectedValue) {
                const [titlePart, pricePart] = selectedValue.split('|');
                const title = titlePart.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
                const price = parseFloat(pricePart);

                let cart = JSON.parse(localStorage.getItem('bookCart')) || [];
                cart.push({ title, price });
                localStorage.setItem('bookCart', JSON.stringify(cart));

                alert(`${title} has been added to your cart!`);
                bookSelect.value = ""; // Reset select box
                bookDetailsDiv.classList.add('hidden'); // Hide details
            } else {
                alert('Please select a book to add to your cart.');
            }
        });
    }

    // --- Cart Page Logic ---
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const buyNowBtn = document.getElementById('buy-now-btn');
    const orderConfirmationDiv = document.getElementById('order-confirmation');
    const orderedBooksList = document.getElementById('ordered-books-list');
    const orderedTotalSpan = document.getElementById('ordered-total');

    function displayCart() {
        const cart = JSON.parse(localStorage.getItem('bookCart')) || [];
        cartItemsDiv.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p>Your cart is currently empty.</p>';
            buyNowBtn.disabled = true;
        } else {
            cart.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('cart-item');
                itemDiv.innerHTML = `
                    <span>${item.title}</span>
                    <span>$${item.price.toFixed(2)}</span>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                `;
                cartItemsDiv.appendChild(itemDiv);
                total += item.price;
            });
            buyNowBtn.disabled = false;
        }
        cartTotalSpan.textContent = `$${total.toFixed(2)}`;

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const indexToRemove = parseInt(event.target.dataset.index);
                let currentCart = JSON.parse(localStorage.getItem('bookCart')) || [];
                currentCart.splice(indexToRemove, 1); // Remove item at index
                localStorage.setItem('bookCart', JSON.stringify(currentCart));
                displayCart(); // Re-render the cart
            });
        });
    }

    if (cartItemsDiv && cartTotalSpan && buyNowBtn) {
        displayCart(); // Load cart when the page loads

        buyNowBtn.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('bookCart')) || [];
            if (cart.length > 0) {
                // Display order confirmation
                orderConfirmationDiv.classList.remove('hidden');
                orderedBooksList.innerHTML = '';
                let finalTotal = 0;
                cart.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${item.title} - $${item.price.toFixed(2)}`;
                    orderedBooksList.appendChild(listItem);
                    finalTotal += item.price;
                });
                orderedTotalSpan.textContent = `$${finalTotal.toFixed(2)}`;

                // Optionally, clear the cart after purchase
                localStorage.removeItem('bookCart');
                cartItemsDiv.innerHTML = '<p>Your order has been placed. Your cart is now empty.</p>';
                cartTotalSpan.textContent = '$0.00';
                buyNowBtn.disabled = true; // Disable buy button
            } else {
                alert('Your cart is empty. Please add books before buying.');
            }
        });
    }
});