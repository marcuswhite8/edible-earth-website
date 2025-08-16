// Global variables
let cart = {
    cherry: 0,
    lavender: 0
};
const pricePerUnit = 8.99;
let canScrollToAddress = false;
let canScrollToPayment = false;
let currentPage = 'cherry'; // 'cherry' or 'lavender'
let cartExpanded = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollEffects();
    updateCart();
    initializeScrollTriggers();
    initializeScrollTriggersLavender();
    initializeCart();
    
    // Initialize with cherry page active
    document.getElementById('cherryPage').classList.add('active');
    updateArrowVisibility();
});

// Cart Management Functions
function initializeCart() {
    updateCartDisplay();
}

function addToCart(productType) {
    cart[productType]++;
    updateCart();
    
    // Animate cart appearance when item is added
    if (!cartExpanded) {
        animateCartPreview();
    }
}

function animateCartPreview() {
    const fixedCart = document.getElementById('fixedCart');
    
    // First ensure cart is visible
    fixedCart.classList.add('visible');
    
    // Brief delay then expand with beautiful animation
    setTimeout(() => {
        fixedCart.classList.add('preview-expand');
        
        // Hold expanded state for 2.5 seconds
        setTimeout(() => {
            fixedCart.classList.remove('preview-expand');
        }, 2500);
    }, 200);
}

function updateCart() {
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartItems = document.getElementById('cartItems');
    const fixedCart = document.getElementById('fixedCart');
    
    const totalItems = cart.cherry + cart.lavender;
    const totalPrice = (cart.cherry + cart.lavender) * pricePerUnit;
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = `£${totalPrice.toFixed(2)}`;
    
    // Show/hide cart based on items
    if (totalItems === 0) {
        fixedCart.classList.remove('visible');
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        document.getElementById('checkoutBtn').style.display = 'none';
        return;
    }
    
    // Show cart when items are added
    fixedCart.classList.add('visible');
    document.getElementById('checkoutBtn').style.display = 'block';
    
    // Update cart items display
    cartItems.innerHTML = '';
    
    if (cart.cherry > 0) {
        cartItems.appendChild(createCartItemElement('cherry', cart.cherry));
    }
    
    if (cart.lavender > 0) {
        cartItems.appendChild(createCartItemElement('lavender', cart.lavender));
    }
}

function createCartItemElement(productType, quantity) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item-row';
    
    const productName = productType === 'cherry' ? 'Cherry Blossom' : 'Lavender';
    const imageSrc = productType === 'cherry' ? 'cream-pot-white-bg.png' : 'cream-pot-lavender-white-bg.png';
    
    itemDiv.innerHTML = `
        <div class="cart-item-info">
            <img src="${imageSrc}" alt="Natural Deodorant - ${productName}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>Natural Deodorant - ${productName}</h4>
                <p>60g jar • 3 months supply</p>
            </div>
        </div>
        <div class="cart-item-controls">
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateCartQuantity('${productType}', -1)">-</button>
                <span>${quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity('${productType}', 1)">+</button>
            </div>
            <div class="cart-item-price">£${(quantity * pricePerUnit).toFixed(2)}</div>
        </div>
    `;
    
    return itemDiv;
}

function updateCartQuantity(productType, change) {
    const newQuantity = cart[productType] + change;
    if (newQuantity >= 0 && newQuantity <= 10) {
        cart[productType] = newQuantity;
        updateCart();
    }
}

function toggleCart() {
    const fixedCart = document.getElementById('fixedCart');
    const toggleIcon = document.getElementById('cartToggleIcon');
    
    cartExpanded = !cartExpanded;
    
    if (cartExpanded) {
        fixedCart.classList.add('expanded');
        toggleIcon.textContent = '▼';
    } else {
        fixedCart.classList.remove('expanded');
        toggleIcon.textContent = '▲';
    }
}

function proceedToCheckout() {
    // For now, just show an alert. In a real implementation, this would lead to checkout
    const totalItems = cart.cherry + cart.lavender;
    const totalPrice = (cart.cherry + cart.lavender) * pricePerUnit;
    
    let itemsList = [];
    if (cart.cherry > 0) itemsList.push(`${cart.cherry} Cherry Blossom`);
    if (cart.lavender > 0) itemsList.push(`${cart.lavender} Lavender`);
    
    alert(`Proceeding to checkout with:\n${itemsList.join(' and ')}\nTotal: £${totalPrice.toFixed(2)}`);
}

// Page fading functions
function slideToLavender() {
    if (currentPage === 'lavender') return; // Prevent double-clicking
    
    const cherryPage = document.getElementById('cherryPage');
    const lavenderPage = document.getElementById('lavenderPage');
    
    // Sync scroll positions and card states before transition
    syncPageStates('cherry', 'lavender');
    
    // Start the crossfade
    cherryPage.classList.add('fading-out');
    cherryPage.classList.remove('active');
    
    lavenderPage.classList.add('fading-in');
    
    currentPage = 'lavender';
    updateArrowVisibility();
    
    // Update background theme smoothly
    setTimeout(() => {
        updateBackgroundTheme();
    }, 400); // Halfway through transition
    
    // Complete the transition
    setTimeout(() => {
        lavenderPage.classList.remove('fading-in');
        lavenderPage.classList.add('active');
        cherryPage.classList.remove('fading-out');
    }, 800);
}

function slideToCherry() {
    if (currentPage === 'cherry') return; // Prevent double-clicking
    
    const cherryPage = document.getElementById('cherryPage');
    const lavenderPage = document.getElementById('lavenderPage');
    
    // Sync scroll positions and card states before transition
    syncPageStates('lavender', 'cherry');
    
    // Start the crossfade
    lavenderPage.classList.add('fading-out');
    lavenderPage.classList.remove('active');
    
    cherryPage.classList.add('fading-in');
    
    currentPage = 'cherry';
    updateArrowVisibility();
    
    // Update background theme smoothly
    setTimeout(() => {
        updateBackgroundTheme();
    }, 400); // Halfway through transition
    
    // Complete the transition
    setTimeout(() => {
        cherryPage.classList.remove('fading-in');
        cherryPage.classList.add('active');
        lavenderPage.classList.remove('fading-out');
    }, 800);
}

// Sync page states for perfect alignment during transition
function syncPageStates(fromPage, toPage) {
    // Get current scroll position and preserve it
    const currentScrollY = window.pageYOffset;
    
    // Map card states from current page to target page
    const cardStates = {
        learnMore: document.getElementById('learnMore').classList.contains('show'),
        checkout: document.getElementById('checkout').classList.contains('show'),
        address: document.getElementById('addressCard').classList.contains('show'),
        payment: document.getElementById('paymentCard').classList.contains('show')
    };
    
    // Also get lavender states for reverse sync
    const lavenderCardStates = {
        learnMore: document.getElementById('learnMoreLavender').classList.contains('show'),
        checkout: document.getElementById('checkoutLavender').classList.contains('show'),
        address: document.getElementById('addressCardLavender').classList.contains('show'),
        payment: document.getElementById('paymentCardLavender').classList.contains('show')
    };
    
    // Apply same states to target page cards
    if (toPage === 'lavender') {
        // Copy cherry states to lavender
        if (cardStates.learnMore) document.getElementById('learnMoreLavender').classList.add('show');
        else document.getElementById('learnMoreLavender').classList.remove('show');
        
        if (cardStates.checkout) document.getElementById('checkoutLavender').classList.add('show');
        else document.getElementById('checkoutLavender').classList.remove('show');
        
        if (cardStates.address) document.getElementById('addressCardLavender').classList.add('show');
        else document.getElementById('addressCardLavender').classList.remove('show');
        
        if (cardStates.payment) document.getElementById('paymentCardLavender').classList.add('show');
        else document.getElementById('paymentCardLavender').classList.remove('show');
    } else {
        // Copy lavender states to cherry
        if (lavenderCardStates.learnMore) document.getElementById('learnMore').classList.add('show');
        else document.getElementById('learnMore').classList.remove('show');
        
        if (lavenderCardStates.checkout) document.getElementById('checkout').classList.add('show');
        else document.getElementById('checkout').classList.remove('show');
        
        if (lavenderCardStates.address) document.getElementById('addressCard').classList.add('show');
        else document.getElementById('addressCard').classList.remove('show');
        
        if (lavenderCardStates.payment) document.getElementById('paymentCard').classList.add('show');
        else document.getElementById('paymentCard').classList.remove('show');
    }
    
    // Ensure scroll position remains the same
    window.scrollTo(0, currentScrollY);
}

function updateBackgroundTheme() {
    // Background images now fade with their respective containers
    // No need to toggle body classes anymore
}

function updateArrowVisibility() {
    const leftArrow = document.querySelector('.nav-arrow.left');
    const rightArrow = document.querySelector('.nav-arrow.right');
    
    if (currentPage === 'cherry') {
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'flex';
    } else if (currentPage === 'lavender') {
        leftArrow.style.display = 'flex';
        rightArrow.style.display = 'none';
    }
}

// Show Learn More section with smooth animation
function showLearnMore() {
    const learnMoreSection = document.getElementById('learnMore');
    
    // Smooth scroll to the learn more section
    setTimeout(() => {
        learnMoreSection.classList.add('show');
        learnMoreSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }, 100);
}

// Show Checkout section
function showCheckout() {
    // First show the info card, then the checkout
    const learnMoreSection = document.getElementById('learnMore');
    const checkoutSection = document.getElementById('checkout');
    
    // Show learn more first
    setTimeout(() => {
        learnMoreSection.classList.add('show');
        
        // Then show checkout immediately and scroll to center it
        setTimeout(() => {
            checkoutSection.classList.add('show');
            checkoutSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }, 300);
    }, 100);
}

// Update quantity and pricing
function updateQuantity(change) {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
        quantity = newQuantity;
        updatePricing();
    }
}

function updatePricing() {
    const totalPrice = (quantity * pricePerUnit).toFixed(2);
    
    // Update quantity display
    const quantityElement = document.getElementById('quantity');
    if (quantityElement) {
        quantityElement.textContent = quantity;
    }
    
    // Update total price displays
    const totalPriceElements = document.querySelectorAll('#totalPrice, .subtotal, .final-total');
    totalPriceElements.forEach(element => {
        if (element) {
            element.textContent = totalPrice;
        }
    });
}

// Checkout flow navigation
function showAddressCard() {
    const addressCard = document.getElementById('addressCard');
    canScrollToAddress = true;
    
    setTimeout(() => {
        addressCard.classList.add('show');
        addressCard.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }, 100);
}

function showPaymentCard() {
    const paymentCard = document.getElementById('paymentCard');
    canScrollToPayment = true;
    
    setTimeout(() => {
        paymentCard.classList.add('show');
        paymentCard.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }, 100);
}

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const shippingForm = document.getElementById('shippingForm');
    const paymentForm = document.getElementById('paymentForm');
    
    if (shippingForm) {
        shippingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showPaymentCard();
        });
    }
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            completeOrder();
        });
    }
});

// Apple Pay integration
function applePayCheckout() {
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
        const totalItems = cart.cherry + cart.lavender;
        const totalPrice = (cart.cherry + cart.lavender) * pricePerUnit;
        
        const request = {
            countryCode: 'GB',
            currencyCode: 'GBP',
            supportedNetworks: ['visa', 'masterCard', 'amex'],
            merchantCapabilities: ['supports3DS'],
            total: {
                label: 'Edible Earth Natural Deodorant',
                amount: totalPrice.toFixed(2)
            },
            lineItems: []
        };
        
        // Add line items for each product in cart
        if (cart.cherry > 0) {
            request.lineItems.push({
                label: `Cherry Blossom Deodorant (${cart.cherry})`,
                amount: (cart.cherry * pricePerUnit).toFixed(2)
            });
        }
        
        if (cart.lavender > 0) {
            request.lineItems.push({
                label: `Lavender Deodorant (${cart.lavender})`,
                amount: (cart.lavender * pricePerUnit).toFixed(2)
            });
        }
        
        const session = new ApplePaySession(3, request);
        
        session.onvalidatemerchant = function(event) {
            // In a real implementation, validate the merchant with your server
            console.log('Apple Pay merchant validation required');
            // For demo purposes, we'll simulate validation
            alert('Apple Pay Demo: In production, this would validate with your payment processor.');
        };
        
        session.onpaymentauthorized = function(event) {
            // Process the payment
            session.completePayment(ApplePaySession.STATUS_SUCCESS);
            completeOrderApplePay();
        };
        
        session.begin();
    } else {
        alert('Apple Pay is not available on this device or browser. Please use Safari on iOS/macOS.');
    }
}

function completeOrderApplePay() {
    const totalItems = cart.cherry + cart.lavender;
    let itemsList = [];
    if (cart.cherry > 0) itemsList.push(`${cart.cherry} Cherry Blossom`);
    if (cart.lavender > 0) itemsList.push(`${cart.lavender} Lavender`);
    
    alert(`Apple Pay order completed! Thank you for purchasing ${itemsList.join(' and ')}.`);
    
    // Reset cart
    cart.cherry = 0;
    cart.lavender = 0;
    updateCart();
}

// Google Pay integration (placeholder)
function googlePayCheckout() {
    // In a real implementation, integrate with Google Pay API
    alert('Google Pay integration would be implemented here with your payment processor.');
    completeOrder();
}

// Complete order
function completeOrder() {
    // Simulate order completion
    alert(`Order completed! Thank you for purchasing ${quantity} jar${quantity > 1 ? 's' : ''} of Natural Deodorant Cream.`);
    
    // Reset the form
    quantity = 1;
    updatePricing();
    
    // Hide all sections
    document.getElementById('checkout').classList.remove('show');
    document.getElementById('addressCard').classList.remove('show');
    document.getElementById('paymentCard').classList.remove('show');
    document.getElementById('learnMore').classList.remove('show');
    
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize scroll effects for glass morphism
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        // The background image is now fixed, so no parallax needed
        // The frosted glass effect is handled by CSS backdrop-filter
        
        // Add subtle glow animation based on scroll position
        const glow = document.querySelector('.glow');
        if (glow) {
            const scrollProgress = Math.min(scrolled / window.innerHeight, 1);
            const glowOpacity = 0.5 - (scrollProgress * 0.2);
            glow.style.opacity = Math.max(0.2, glowOpacity);
        }
    });
}

// Initialize scroll triggers for automatic section reveals
function initializeScrollTriggers() {
    const learnMoreSection = document.getElementById('learnMore');
    const checkoutSection = document.getElementById('checkout');
    const addressCard = document.getElementById('addressCard');
    const paymentCard = document.getElementById('paymentCard');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        
        const firstTriggerPoint = windowHeight * 0.3; // Trigger at 30% of viewport height
        const secondTriggerPoint = windowHeight * 0.8; // Trigger at 80% of viewport height
        
        // Show learn more section when scrolling down
        if (scrolled > firstTriggerPoint && !learnMoreSection.classList.contains('show')) {
            learnMoreSection.classList.add('show');
        }
        
        // Show checkout section when scrolling further down OR when near bottom
        const nearBottom = scrolled + windowHeight >= documentHeight - 100;
        if ((scrolled > secondTriggerPoint || nearBottom) && !checkoutSection.classList.contains('show')) {
            checkoutSection.classList.add('show');
        }
        
        // Prevent scrolling to address card unless button was clicked
        if (!canScrollToAddress) {
            const addressCardTop = addressCard.offsetTop;
            if (scrolled > addressCardTop - windowHeight / 2) {
                window.scrollTo({
                    top: addressCardTop - windowHeight / 2,
                    behavior: 'smooth'
                });
            }
        }
        
        // Prevent scrolling to payment card unless address form was submitted
        if (!canScrollToPayment) {
            const paymentCardTop = paymentCard.offsetTop;
            if (scrolled > paymentCardTop - windowHeight / 2) {
                window.scrollTo({
                    top: paymentCardTop - windowHeight / 2,
                    behavior: 'smooth'
                });
            }
        }
    });
}

// Smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add subtle animations on load
window.addEventListener('load', function() {
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroButtons) {
        heroButtons.style.opacity = '0';
        heroButtons.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroButtons.style.transition = 'all 0.8s ease';
            heroButtons.style.opacity = '1';
            heroButtons.style.transform = 'translateY(0)';
        }, 500);
    }
});

// LAVENDER PRODUCT FUNCTIONS
// Show Learn More section with smooth animation - Lavender
function showLearnMoreLavender() {
    const learnMoreSection = document.getElementById('learnMoreLavender');
    
    setTimeout(() => {
        learnMoreSection.classList.add('show');
        learnMoreSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }, 100);
}

// Show Checkout section - Lavender
function showCheckoutLavender() {
    const learnMoreSection = document.getElementById('learnMoreLavender');
    const checkoutSection = document.getElementById('checkoutLavender');
    
    setTimeout(() => {
        learnMoreSection.classList.add('show');
        
        setTimeout(() => {
            checkoutSection.classList.add('show');
            checkoutSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }, 300);
    }, 100);
}

// Update quantity and pricing - Lavender
function updateQuantityLavender(change) {
    const newQuantity = quantityLavender + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
        quantityLavender = newQuantity;
        updatePricingLavender();
    }
}

function updatePricingLavender() {
    const totalPrice = (quantityLavender * pricePerUnit).toFixed(2);
    
    const quantityElement = document.getElementById('quantityLavender');
    if (quantityElement) {
        quantityElement.textContent = quantityLavender;
    }
    
    const totalPriceElements = document.querySelectorAll('#totalPriceLavender, .subtotalLavender, .final-totalLavender');
    totalPriceElements.forEach(element => {
        if (element) {
            element.textContent = totalPrice;
        }
    });
}

// Checkout flow navigation - Lavender
function showAddressCardLavender() {
    const addressCard = document.getElementById('addressCardLavender');
    canScrollToAddressLavender = true;
    
    setTimeout(() => {
        addressCard.classList.add('show');
        addressCard.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }, 100);
}

function showPaymentCardLavender() {
    const paymentCard = document.getElementById('paymentCardLavender');
    canScrollToPaymentLavender = true;
    
    setTimeout(() => {
        paymentCard.classList.add('show');
        paymentCard.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }, 100);
}

// Initialize scroll triggers for lavender page
function initializeScrollTriggersLavender() {
    const learnMoreSection = document.getElementById('learnMoreLavender');
    const checkoutSection = document.getElementById('checkoutLavender');
    const addressCard = document.getElementById('addressCardLavender');
    const paymentCard = document.getElementById('paymentCardLavender');
    
    window.addEventListener('scroll', function() {
        if (currentPage !== 'lavender') return;
        
        const scrolled = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        
        const firstTriggerPoint = windowHeight * 0.3;
        const secondTriggerPoint = windowHeight * 0.8;
        
        if (scrolled > firstTriggerPoint && !learnMoreSection.classList.contains('show')) {
            learnMoreSection.classList.add('show');
        }
        
        const nearBottom = scrolled + windowHeight >= documentHeight - 100;
        if ((scrolled > secondTriggerPoint || nearBottom) && !checkoutSection.classList.contains('show')) {
            checkoutSection.classList.add('show');
        }
        
        if (!canScrollToAddressLavender) {
            const addressCardTop = addressCard.offsetTop;
            if (scrolled > addressCardTop - windowHeight / 2) {
                window.scrollTo({
                    top: addressCardTop - windowHeight / 2,
                    behavior: 'smooth'
                });
            }
        }
        
        if (!canScrollToPaymentLavender) {
            const paymentCardTop = paymentCard.offsetTop;
            if (scrolled > paymentCardTop - windowHeight / 2) {
                window.scrollTo({
                    top: paymentCardTop - windowHeight / 2,
                    behavior: 'smooth'
                });
            }
        }
    });
}

// Form handling for lavender
document.addEventListener('DOMContentLoaded', function() {
    const shippingFormLavender = document.getElementById('shippingFormLavender');
    const paymentFormLavender = document.getElementById('paymentFormLavender');
    
    if (shippingFormLavender) {
        shippingFormLavender.addEventListener('submit', function(e) {
            e.preventDefault();
            showPaymentCardLavender();
        });
    }
    
    if (paymentFormLavender) {
        paymentFormLavender.addEventListener('submit', function(e) {
            e.preventDefault();
            completeOrderLavender();
        });
    }
});

// Complete order - Lavender
function completeOrderLavender() {
    alert(`Order completed! Thank you for purchasing ${quantityLavender} jar${quantityLavender > 1 ? 's' : ''} of Natural Deodorant Cream - Lavender.`);
    
    quantityLavender = 1;
    updatePricingLavender();
    
    document.getElementById('checkoutLavender').classList.remove('show');
    document.getElementById('addressCardLavender').classList.remove('show');
    document.getElementById('paymentCardLavender').classList.remove('show');
    document.getElementById('learnMoreLavender').classList.remove('show');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}