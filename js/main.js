document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('active');
            burger.classList.toggle('active');

            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                burger.classList.remove('active');
                navLinks.forEach(l => l.style.animation = '');
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Stats visibility
    const statsElements = document.querySelectorAll('.stat-item');
    statsElements.forEach(el => observer.observe(el));

    // Contact Form Handling
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = form.querySelector('button');

            // --- GOOGLE SHEETS CONFIGURATION ---
            const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyokqyd0ENpoJI1EpA6X37TY8cqjXsPXUxahy5xQ0oBcCPGbXYeRUkyDUxVW1w8VD8sMQ/exec';
            // -----------------------------------

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('contact_info').value,
                service: document.getElementById('project').value,
                message: `Budget: ${document.getElementById('budget').value} | Contact: ${document.getElementById('contact_info').value}`
            };

            // UI Loading State
            btn.innerText = 'Sending...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            try {
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                showSuccess(btn, 'Sent!');

            } catch (error) {
                console.error('Form Error:', error);
                showSuccess(btn, 'Error');
            }
        });
    }

    function showSuccess(btn, message) {
        const form = document.getElementById('contactForm');
        btn.innerText = message;
        btn.style.background = '#b3e600'; // Success lime
        btn.style.color = 'black';
        form.reset();

        setTimeout(() => {
            btn.innerText = 'SEND';
            btn.style.background = ''; // Reset
            btn.style.color = '';
            btn.style.opacity = '1';
            btn.disabled = false;
        }, 3000);
    }
});
