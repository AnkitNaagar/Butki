document.addEventListener('DOMContentLoaded', function () {
    gsap.registerPlugin(ScrollTrigger);

    // GSAP Animations (only on index page)
    if (document.querySelector('#hero')) { // Check if hero section exists
        gsap.from("#hero h1", { opacity: 0, duration: 1, y: -50 });
        gsap.from("#hero p", { opacity: 0, duration: 1, y: 50, delay: 0.5 });
    }

    // Cart Functionality - Check if we are on cart page
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.querySelector('.cart-count');
    let cart = [];

    // Load cart from local storage
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCart();
    }

    function updateCartCount() {
        if (cartCountElement) {
            cartCountElement.textContent = `(${cart.length})`;
        }

    }

    updateCartCount();

    if (document.querySelector('.add-to-cart')) { // Only on index AND dresses page now
        const addToCartButtons = document.querySelectorAll('.add-to-cart');

        // Add to cart function
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // PREVENT PAGE FROM JUMPING!

                const name = button.dataset.name;
                const price = parseFloat(button.dataset.price);
                const image = button.dataset.image;

                const item = {
                    name: name,
                    price: price,
                    image: image,
                    quantity: 1
                };

                // Check if item already exists in cart
                const existingItem = cart.find(cartItem => cartItem.name === item.name);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push(item);
                }

                updateCart();
            });
        });
    }

    function updateCart() {
        if (cartItemsContainer) { // If it exists we're on cart.html
            cartItemsContainer.innerHTML = '';
            let total = 0;
    
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
    
                cartItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Price: $${item.price.toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-decrease" data-name="${item.name}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-increase" data-name="${item.name}">+</button>
                        </div>
                    </div>
                    <span class="cart-item-remove" data-name="${item.name}">Remove</span>
                `;
    
                cartItemsContainer.appendChild(cartItemDiv);
                total += item.price * item.quantity;
            });
    
            cartTotalElement.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
    
            // Add event listeners to remove buttons
            const removeCartButtons = document.querySelectorAll('.cart-item-remove');
            removeCartButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const name = button.dataset.name;
                    removeFromCart(name);
                });
            });
    
            // Add event listeners for quantity buttons
            const quantityDecreaseButtons = document.querySelectorAll('.quantity-decrease');
            quantityDecreaseButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const name = button.dataset.name;
                    adjustQuantity(name, -1);
                });
            });
    
            const quantityIncreaseButtons = document.querySelectorAll('.quantity-increase');
            quantityIncreaseButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const name = button.dataset.name;
                    adjustQuantity(name, 1);
                });
            });
        }
        updateCartCount();
    
        // Save cart to local storage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Adjust item quantity
    function adjustQuantity(name, change) {
        const item = cart.find(item => item.name === name);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) { // Remove item if quantity is 0 or less
                removeFromCart(name);
            } else {
                updateCart(); // Refresh the cart display
            }
        }
    }
    


// currency




    async function convertCurrency() {
        const priceElements = document.querySelectorAll('.price');
        const isUserInIndia = navigator.language === 'en-IN'; // Basic check for Indian locale
    
        if (isUserInIndia) {
            const apiKey = 'f0de3d4293348c73cf05337c'; // Use your own API key
            const apiUrl = `https://v6.exchangerate-api.com/v6/f0de3d4293348c73cf05337c/latest/USD`; // Exchange rate API for USD to INR
    
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                const inrRate = data.rates.INR; // Get INR conversion rate
    
                priceElements.forEach(priceElement => {
                    const usdPrice = parseFloat(priceElement.dataset.priceUsDollar); // Get original USD price
                    const inrPrice = (usdPrice * inrRate).toFixed(2); // Convert to INR
                    priceElement.textContent = `₹${inrPrice}`; // Update the display to INR
                });
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
            }
        }
    }
    
    // Call the currency converter function on page load.
    document.addEventListener('DOMContentLoaded', convertCurrency);

    // Remove from cart function
    function removeFromCart(name) {
        cart = cart.filter(item => item.name !== name);
        updateCart();
    }

    // Back to Top Button Functionality
    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (backToTopButton) {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        }
    });

    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Load theme from local storage
    let currentTheme = localStorage.getItem('theme') || 'light';

    function setTheme(theme) {
        if (theme === 'dark') {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        localStorage.setItem('theme', theme);
        currentTheme = theme; // Update the currentTheme variable
    }

    setTheme(currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    // Navbar Toggler Icon Change
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarTogglerIcon = document.querySelector('.navbar-toggler-icon');
    const navbarNav = document.getElementById('navbarNav');



    // Advanced Slider Functionality (Only on index page)
    if (document.querySelector('.section-slider')) { // Check if a slider is actually on the page
        const sectionSliders = document.querySelectorAll('.section-slider');

        sectionSliders.forEach(slider => {
            const sliderWrapper = slider.querySelector('.slider-wrapper');
            const slides = sliderWrapper.querySelectorAll('.slide');
            const prevButton = slider.querySelector('.prev-slide');
            const nextButton = slider.querySelector('.next-slide');
            const slideCount = slides.length;
            let currentSlide = 0;
            let isAnimating = false;

            // Set initial position
            gsap.set(sliderWrapper, {
                xPercent: 0
            });

            // Create timeline
            const timeline = gsap.timeline({
                paused: true,
                defaults: {
                    duration: 0.6,
                    ease: "power2.inOut"
                },
                onComplete: () => isAnimating = false,
                onReverseComplete: () => isAnimating = false
            });

            timeline.to(sliderWrapper, {
                xPercent: -100,
            });

            // Navigation functions
            function goToSlide(slideIndex) {
                if (isAnimating) return;
                isAnimating = true;

                timeline.pause(); // Pause auto-sliding when manually navigating

                const xPercent = -slideIndex * (100 / slideCount);
                gsap.to(sliderWrapper, {
                    xPercent: xPercent,
                    duration: 0.6,
                    ease: "power2.inOut",
                    onComplete: () => isAnimating = false
                });
                currentSlide = slideIndex;
            }

            function nextSlide() {
                if (currentSlide < slideCount - 1) {
                    goToSlide(currentSlide + 1);
                } else {
                    goToSlide(0);
                }
            }

            function prevSlide() {
                if (currentSlide > 0) {
                    goToSlide(currentSlide - 1);
                } else {
                    goToSlide(slideCount - 1);
                }
            }

            // Event listeners for navigation buttons
            nextButton.addEventListener('click', nextSlide);
            prevButton.addEventListener('click', prevSlide);

            // Automatic sliding (pause on hover)
            let autoSlideInterval;

            function startAutoSlide() {
                autoSlideInterval = setInterval(nextSlide, 5000);
            }

            function stopAutoSlide() {
                clearInterval(autoSlideInterval);
            }

            startAutoSlide();

            slider.addEventListener("mouseenter", stopAutoSlide);
            slider.addEventListener("mouseleave", startAutoSlide);

        });
    }

});