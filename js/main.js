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

    // Counter Animation for Stats
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Could add number counting animation logic here if needed
            }
        });
    });

    // Contact Form Handling
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = form.querySelector('button');
            const originalText = btn.innerText;

            // --- GOOGLE SHEETS CONFIGURATION ---
            const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyokqyd0ENpoJI1EpA6X37TY8cqjXsPXUxahy5xQ0oBcCPGbXYeRUkyDUxVW1w8VD8sMQ/exec';
            // -----------------------------------

            const formData = {
                name: document.getElementById('name').value,
                // Mapping new inputs to the keys the Google Script expects:
                email: document.getElementById('contact_info').value, // Column C (Might be cleared if not email)
                service: document.getElementById('project').value,    // Column D
                // Combine Budget and Contact into Column E to ensure contact info is saved even if Column C rejects it
                message: `Budget: ${document.getElementById('budget').value} | Contact: ${document.getElementById('contact_info').value}`
            };

            // UI Loading State
            btn.innerText = 'Sending...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            try {
                // Send to Google Apps Script
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                // Assume success if no network error occurred
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
