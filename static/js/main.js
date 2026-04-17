document.addEventListener('DOMContentLoaded', () => {

    const fadeElements = document.querySelectorAll('.fade-in-section, .slide-up-anim, .reveal-left, .reveal-right, .reveal-fade');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Trigger slightly before the element is in view for better feel
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Staggered children if requested
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        child.style.transitionDelay = `${index * 0.1}s`;
                    });
                }
                
                // Si l'élément contient des compteurs, on les lance
                const counters = entry.target.querySelectorAll('.counter') || [];
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                    entry.target.classList.remove('counter'); 
                }
                counters.forEach(counter => {
                    animateCounter(counter);
                    counter.classList.remove('counter'); 
                });

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
    
    // --- Parallax Effect for Project Images ---
    const parallaxImages = document.querySelectorAll('.parallax-img');
    
    const handleParallax = () => {
        parallaxImages.forEach(img => {
            const container = img.parentElement;
            const containerRect = container.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (containerRect.top < windowHeight && containerRect.bottom > 0) {
                // Calculate position relative to viewport (0 to 1)
                const scrollPercent = (windowHeight - containerRect.top) / (windowHeight + containerRect.height);
                // Move image slightly (adjusted by CSS height: 120%)
                const moveY = (scrollPercent - 0.5) * 60; // Max 30px up/down
                img.style.transform = `scale(1.1) translateY(${moveY}px)`;
            }
        });
    };
    
    window.addEventListener('scroll', handleParallax, { passive: true });
    handleParallax(); // Initial position check
    
    // Au cas où les compteurs ne sont pas dans un fade-in-section
    const pureCounters = document.querySelectorAll('.counter:not(.fade-in-section)');
    pureCounters.forEach(el => observer.observe(el));

    function animateCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // ms
        const increment = target / (duration / 16); // 60fps approx
        
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target + (target > 50 ? '+' : '');
            }
        };
        
        updateCounter();
    }
});
