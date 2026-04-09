// Register GSAP once at the top
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GLOBAL ELEMENTS ---
    const cursor = document.querySelector('.custom-cursor');
    const menu = document.querySelector('#fullMenu');
    const opener = document.querySelector('#menuTrigger');
    const closer = document.querySelector('#closeMenu');

    // --- 2. CUSTOM CURSOR LOGIC ---
    if (cursor) {
        // Movement Logic
        document.addEventListener('mousemove', (e) => {
            window.requestAnimationFrame(() => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });
        });

        // EFFECT DELEGATION (The "Grow" Logic)
        // Works for existing and dynamically added elements
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('a, button, .menu-icon, .nav-item, .m-card, .tab-btn, .service-card, .btn-3d-reveal, .info-item, input, textarea, select');
            if (target) {
                cursor.classList.add('grow');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('a, button, .menu-icon, .nav-item, .m-card, .tab-btn, .service-card, .btn-3d-reveal, .info-item, input, textarea, select');
            if (target) {
                cursor.classList.remove('grow');
            }
        });
    }

    // --- 3. FULL SCREEN MENU LOGIC ---
    if (opener && menu) {
        opener.addEventListener('click', (e) => {
            e.preventDefault();
            menu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closer && menu) {
        closer.addEventListener('click', () => {
            menu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // --- 4. MISSION TABS LOGIC ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));
            const targetEl = document.getElementById(target);
            if(targetEl) targetEl.classList.add('active');
        });
    });

    // --- 5. INTERSECTION OBSERVERS (REVEAL EFFECTS) ---
    // Combined observer for Services, Contact Page, and General reveals
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Unobserve items that only need to animate ONCE (Services & Contact)
                if (entry.target.classList.contains('reveal-on-scroll') || 
                    entry.target.classList.contains('reveal-from-bottom')) {
                    revealObserver.unobserve(entry.target);
                }
            } else if (entry.target.classList.contains('reveal-element')) {
                // Re-animate generic elements when scrolling back up/down
                entry.target.classList.remove('active');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    // Target all reveal types
    document.querySelectorAll('.reveal-element, .reveal-on-scroll, .reveal-from-bottom').forEach(el => {
        revealObserver.observe(el);
    });

    // --- 6. GSAP HORIZONTAL SCROLL ---
    const container = document.querySelector(".cards-container");
    const scrollSection = document.querySelector(".horizontal-scroll-section");
    
    if (container && scrollSection) {
        const getScrollAmount = () => -(container.scrollWidth - window.innerWidth);

        gsap.to(container, {
            x: getScrollAmount,
            ease: "none",
            scrollTrigger: {
                trigger: scrollSection,
                start: "top top",
                end: () => `+=${container.scrollWidth - window.innerWidth}`, 
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const progressBar = document.querySelector(".scroll-progress-bar");
                    if (progressBar) {
                        gsap.to(progressBar, { 
                            width: self.progress * 100 + "%", 
                            duration: 0.1 
                        });
                    }
                }
            }
        });
    }

    // --- 7. CAROUSEL & ACCORDION ---
    const slider = document.querySelector('.news-container');
    const nextBtn = document.querySelector('.nav-btn.next');
    const prevBtn = document.querySelector('.nav-btn.prev');

    if (slider && nextBtn && prevBtn) {
        const handleScroll = (direction) => {
            const card = slider.querySelector('.news-card');
            if (!card) return;
            const scrollDistance = card.offsetWidth + 30; 
            slider.scrollBy({
                left: direction === 'next' ? scrollDistance : -scrollDistance,
                behavior: 'smooth'
            });
        };
        nextBtn.addEventListener('click', () => handleScroll('next'));
        prevBtn.addEventListener('click', () => handleScroll('prev'));
    }

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isOpen) item.classList.add('active');
            });
        }
    });
});