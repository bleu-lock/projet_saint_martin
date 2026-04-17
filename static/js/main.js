document.addEventListener('DOMContentLoaded', () => {

    const fadeElements = document.querySelectorAll('.fade-in-section, .slide-up-anim');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger quand 15% de l'élément est visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Si l'élément contient des compteurs, on les lance
                const counters = entry.target.querySelectorAll('.counter') || [];
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                    entry.target.classList.remove('counter'); // Prevent re-animating
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
