// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

// Hero Slider Configuration
const heroConfig = {
    slides: [
        {
            id: 'homepage',
            image: 'images/hero/hero-digital-transformation.jpg',
            title: 'Transform Your Business with Innovative Technology Solutions',
            badge: 'Digital Transformation Solutions',
            description: 'Empower your business with cutting-edge AI, data analytics, and cloud solutions. We help you navigate the digital landscape with confidence.',
            link: '#products'
        },
        {
            id: 'pos',
            image: 'images/hero/hero-pos.jpg',
            title: 'Modernize Your Business with Advanced POS System',
            badge: 'Point of Sale Solution',
            description: 'Streamline operations with real-time inventory tracking, sales analytics, and seamless payment processing.',
            link: 'products/pos.html'
        },
        {
            id: 'fleet',
            image: 'images/hero/hero-fleet.jpg',
            title: 'Optimize Your Fleet with Smart Management',
            badge: 'Vehicle Tracking System',
            description: 'Track vehicles in real-time, optimize routes, and monitor driver performance to improve efficiency.',
            link: 'products/fleet.html'
        },
        {
            id: 'crm',
            image: 'images/hero/hero-crm.jpg',
            title: 'Transform Customer Relationships with Site Core CRM',
            badge: 'Customer Management',
            description: 'Build stronger customer relationships with advanced lead tracking, contact management, and sales pipeline optimization.',
            link: 'products/crm.html'
        }
    ],
    currentSlide: 0,
    interval: 8000, // 8 seconds
    transitionDuration: 1000 // 1 second
};

// Initialize Hero Slider
function initHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    // Create slides
    heroConfig.slides.forEach((slide, index) => {
        const slideElement = createSlideElement(slide, index);
        slider.appendChild(slideElement);
    });

    // Initialize first slide
    showSlide(0);

    // Start auto-rotation
    startAutoRotation();

    // Add navigation event listeners
    addNavigationListeners();
}

// Create Slide Element
function createSlideElement(slide, index) {
    const slideDiv = document.createElement('div');
    slideDiv.className = `hero-slide ${index === 0 ? 'active' : ''}`;
    slideDiv.dataset.slide = slide.id;
    // No need to set background image here since it's handled by CSS based on data-slide attribute

    const container = document.createElement('div');
    container.className = 'container';

    const row = document.createElement('div');
    row.className = 'row align-items-center min-vh-100';

    const contentCol = document.createElement('div');
    contentCol.className = 'col-lg-6';
    contentCol.setAttribute('data-aos', 'fade-right');

    const content = document.createElement('div');
    content.className = 'hero-content';

    // Add hero content
    content.innerHTML = `
        <span class="hero-badge">${slide.badge}</span>
        <h1>${slide.title}</h1>
        <p class="lead">${slide.description}</p>
        <div class="hero-buttons">
            <a href="${slide.link}" class="btn btn-primary btn-lg">
                <span>Learn More</span>
                <i class="fas fa-arrow-right ms-2"></i>
            </a>
        </div>
    `;

    contentCol.appendChild(content);
    row.appendChild(contentCol);

    // We don't need the image column anymore since we're using full-screen background images
    // But we'll add an empty column to maintain the layout
    const spacerCol = document.createElement('div');
    spacerCol.className = 'col-lg-6';
    row.appendChild(spacerCol);

    container.appendChild(row);
    slideDiv.appendChild(container);

    return slideDiv;
}

// Show Slide
function showSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const currentSlide = document.querySelector('.hero-slide.active');

    if (currentSlide) {
        currentSlide.classList.remove('active');
        // Add fade out effect
        currentSlide.style.opacity = '0';
    }

    // Short delay before making the new slide active for smoother transition
    setTimeout(() => {
        slides[index].classList.add('active');
        slides[index].style.opacity = '1';
        heroConfig.currentSlide = index;
    }, 50);
}

// Start Auto Rotation
function startAutoRotation() {
    setInterval(() => {
        const nextSlide = (heroConfig.currentSlide + 1) % heroConfig.slides.length;
        showSlide(nextSlide);
    }, heroConfig.interval);
}

// Add Navigation Listeners
function addNavigationListeners() {
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            const prevSlide = (heroConfig.currentSlide - 1 + heroConfig.slides.length) % heroConfig.slides.length;
            showSlide(prevSlide);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const nextSlide = (heroConfig.currentSlide + 1) % heroConfig.slides.length;
            showSlide(nextSlide);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    AOS.init(); // Initialize AOS animations
});

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Initialize AOS Animation
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Initialize Swiper for Testimonials
const testimonialSwiper = new Swiper('.testimonial-slider', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        }
    }
});

// Counter Animation
$('.counter').counterUp({
    delay: 10,
    time: 1000
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form Submission
const contactForm = document.querySelector('.contact-form');
const newsletterForm = document.querySelector('.newsletter-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Add your form submission logic here
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
});

newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Add your newsletter subscription logic here
    alert('Thank you for subscribing to our newsletter!');
    newsletterForm.reset();
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add Active Class to Navigation Links
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Mobile Menu Toggle
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');

navbarToggler.addEventListener('click', function() {
    navbarCollapse.classList.toggle('show');
});

// Close Mobile Menu on Link Click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        navbarCollapse.classList.remove('show');
    });
}); 