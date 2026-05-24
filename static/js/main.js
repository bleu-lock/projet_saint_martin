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

// Animation d'entrée des champs de saisie (effet de saut de lettres type Framer Motion)
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.animated-input');
    inputs.forEach(input => {
        const labelText = input.getAttribute('data-label') || '';
        const container = document.createElement('div');
        container.className = 'absolute pointer-events-none flex text-gray-400 font-medium transition-all duration-300';
        container.id = `animated-label-${input.id || Math.random().toString(36).substr(2, 9)}`;
        
        labelText.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.className = 'inline-block transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu';
            span.style.transitionDelay = `${index * 30}ms`;
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            container.appendChild(span);
        });

        // Insère le conteneur de label avant l'input
        const wrapper = input.parentElement;
        wrapper.classList.add('relative');
        wrapper.insertBefore(container, input);

        const isTextarea = input.tagName.toLowerCase() === 'textarea';
        if (isTextarea) {
            container.classList.add('left-2', 'top-3');
            input.className = 'w-full bg-transparent border-b-2 border-gray-300 focus:border-asm-bordeaux outline-none py-2 transition-colors text-asm-dark font-medium placeholder-transparent resize-none';
        } else {
            container.classList.add('left-2', 'top-1/2', '-translate-y-1/2');
            input.className = 'w-full bg-transparent border-b-2 border-gray-300 focus:border-asm-bordeaux outline-none py-2.5 transition-colors text-asm-dark font-medium placeholder-transparent';
        }
        
        const updateState = () => {
            const hasVal = input.value.length > 0;
            const isFocused = document.activeElement === input;
            
            const spans = container.querySelectorAll('span');
            spans.forEach(span => {
                if (hasVal || isFocused) {
                    span.style.transform = isTextarea ? 'translateY(-24px) scale(0.85)' : 'translateY(-26px) scale(0.85)';
                    span.style.color = '#8B1A1A'; // bordeaux
                } else {
                    span.style.transform = 'translateY(0) scale(1)';
                    span.style.color = '';
                }
            });
        };

        input.addEventListener('focus', updateState);
        input.addEventListener('blur', updateState);
        input.addEventListener('input', updateState);

        // État initial (autofill, valeur pré-remplie, etc.)
        setTimeout(updateState, 100);
    });
});

// --- Animation 3D Scroll Container (style Aceternity UI) ---
document.addEventListener('DOMContentLoaded', () => {
    const containerScrolls = document.querySelectorAll('.container-scroll');
    if (containerScrolls.length === 0) return;

    const handleContainerScroll = () => {
        const isMobile = window.innerWidth <= 768;
        containerScrolls.forEach(container => {
            const card = container.querySelector('.container-scroll-card');
            const header = container.querySelector('.container-scroll-header');
            if (!card) return;
            
            const rect = container.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Si le conteneur est visible dans le viewport
            if (rect.top < windowHeight && rect.bottom > 0) {
                // Calcule le progrès de défilement (0 quand il entre en bas, 1 quand il sort en haut)
                const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
                
                // Zone d'animation active
                const activeProgress = Math.min(Math.max((progress - 0.1) / 0.6, 0), 1);
                
                // Angle de rotation : de 20deg (non défilé) à 0deg (défilé)
                const rotateX = 20 * (1 - activeProgress);
                
                // Échelle : de 1.05 à 1.0 sur desktop, et de 0.8 à 0.95 sur mobile
                const scaleStart = isMobile ? 0.8 : 1.05;
                const scaleEnd = isMobile ? 0.95 : 1.0;
                const scale = scaleStart + (scaleEnd - scaleStart) * activeProgress;
                
                // Décalage vertical du titre/header
                const translateY = (1 - activeProgress) * -40;
                const opacity = 0.6 + activeProgress * 0.4;
                
                // Applique les transformations en 3D
                card.style.transform = `rotateX(${rotateX}deg) scale(${scale})`;
                
                if (header) {
                    header.style.transform = `translateY(${translateY}px)`;
                    header.style.opacity = opacity.toString();
                }
            }
        });
    };

    window.addEventListener('scroll', handleContainerScroll, { passive: true });
    handleContainerScroll(); // Appel initial
    window.addEventListener('resize', handleContainerScroll, { passive: true });
});


