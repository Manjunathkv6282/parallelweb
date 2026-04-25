// 0. preloader home page 
window.addEventListener('load', () => {
    const tl = gsap.timeline();

    // 1. Initial Logo Fade In
    tl.to(".loader-logo", {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: "power4.out"
    })
    // 2. Bar expansion
    .to(".loader-bar", {
        width: "150px",
        duration: 1.5,
        ease: "expo.inOut"
    }, "-=0.5")
    // 3. Elements disappear
    .to(".loader-inner", {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power2.in"
    })
    // 4. The "Amazing" Split Reveal
    .to(".loader-side.left", {
        xPercent: -100,
        duration: 1.2,
        ease: "expo.inOut"
    }, "+=0.1")
    .to(".loader-side.right", {
        xPercent: 100,
        duration: 1.2,
        ease: "expo.inOut"
    }, "<") // "<" starts at the same time as the left side
    // 5. Hero Content Reveal
    .from(".modern-hero h1", {
        scale: 1.1,
        filter: "blur(10px)",
        opacity: 0,
        duration: 2,
        ease: "power2.out"
    }, "-=0.8")
    // 6. Cleanup
    .set(".loader-wrapper", { display: "none" });
});

// 1. Register Plugins at the very top
gsap.registerPlugin(ScrollTrigger);

// 2. Wrap EVERYTHING in one DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    
    // --- GLOBAL ELEMENTS ---
    const cursor = document.querySelector('.custom-cursor');
    const menu = document.querySelector('#fullMenu');
    const opener = document.querySelector('#menuTrigger');
    const closer = document.querySelector('#closeMenu');
    const header = document.querySelector('.main-navigation'); // Target the class from your HTML

    // --- NEW: HEADER SCROLL LOGIC ---
    // This fixes your non-working header. We use the class '.main-navigation'
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- NEW: HERO ENTRANCE ANIMATIONS ---
    const tl = gsap.timeline();
    tl.from(".nav-link", {
        y: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 1
    })
    .from(".hero-title", {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out"
    }, "-=0.5")
    .from(".floating-img", {
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "back.out(1.7)"
    }, "-=1");

    // --- NEW: FLOATING MOVEMENTS ---
    gsap.to(".img-1, .img-3", {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".img-2, .img-main", {
        y: 20,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".circle-ring", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
    });

    // --- EXISTING: CUSTOM CURSOR ---
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            window.requestAnimationFrame(() => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });
        });

        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('a, button, .menu-icon, .nav-item, .m-card, .tab-btn, .service-card, .btn-3d-reveal, .info-item, input, textarea, select');
            if (target) cursor.classList.add('grow');
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('a, button, .menu-icon, .nav-item, .m-card, .tab-btn, .service-card, .btn-3d-reveal, .info-item, input, textarea, select');
            if (target) cursor.classList.remove('grow');
        });
    }

    // --- EXISTING: FULL SCREEN MENU ---
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

    // --- EXISTING: GSAP HORIZONTAL SCROLL ---
    const cardsContainer = document.querySelector(".cards-container");
    const scrollSection = document.querySelector(".horizontal-scroll-section");
    
    if (cardsContainer && scrollSection) {
        const getScrollAmount = () => -(cardsContainer.scrollWidth - window.innerWidth);

        gsap.to(cardsContainer, {
            x: getScrollAmount,
            ease: "none",
            scrollTrigger: {
                trigger: scrollSection,
                start: "top top",
                end: () => `+=${cardsContainer.scrollWidth - window.innerWidth}`, 
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

    // --- EXISTING: NEWS CAROUSEL & FAQ ---
    const slider = document.querySelector('.news-container');
    const nextBtn = document.querySelector('.nav-btn.next');
    const prevBtn = document.querySelector('.nav-btn.prev');

    if (slider && nextBtn && prevBtn) {
        const handleScroll = (direction) => {
            const card = slider.querySelector('.news-card');
            if (!card) return;
            slider.scrollBy({
                left: direction === 'next' ? (card.offsetWidth + 30) : -(card.offsetWidth + 30),
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

    // --- REVEAL OBSERVER ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else if (entry.target.classList.contains('reveal-element')) {
                entry.target.classList.remove('active');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-element, .reveal-on-scroll').forEach(el => revealObserver.observe(el));
});

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-tab');

            // 1. Update Button States
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. Clear All Tabs First
            tabContents.forEach(content => {
                content.classList.remove('active');
                // Use GSAP to kill any ongoing animations and hide
                gsap.killTweensOf(content); 
                gsap.set(content, { display: 'none', opacity: 0, y: 10 });
            });

            // 3. Animate Target Tab
            const targetEl = document.getElementById(target);
            if (targetEl) {
                targetEl.classList.add('active');
                // Force display: block so GSAP can animate the opacity
                gsap.set(targetEl, { display: 'block' }); 
                gsap.to(targetEl, { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.5, 
                    ease: "power2.out" 
                });
            }
        });
    });
});