window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');

    if (preloader) {
        // Quickly hide preloader to not punish LCP metric layout
        preloader.classList.add('loader-hidden');

        setTimeout(() => {
            document.body.style.overflow = 'auto';

            // Sedaj je skrolanje omogočeno, skočimo na hash
            if (window.location.hash) {
                setTimeout(() => {
                    lenis.scrollTo(window.location.hash, { offset: -50, duration: 1.5 });
                }, 50); // Zelo kratek zamik za osvežitev layouta
            }
        }, 800);
    } else {
        document.body.style.overflow = 'auto';
        if (window.location.hash) {
            setTimeout(() => {
                lenis.scrollTo(window.location.hash, { offset: -50, duration: 1.5 });
            }, 100);
        }
    }
});

// Medtem ko se nalaga, preprečimo skrolanje
document.body.style.overflow = 'hidden';

window.addEventListener("load", function () {

    // Sprememba navigacije ob skrolanju
    gsap.registerPlugin(ScrollTrigger);

    const heroText = document.getElementById('heroText');
    const navbar = document.getElementById('mainNav');
    const oNasSection = document.getElementById('o-nas');

    let hasScrolledPast = false;

    let mm = gsap.matchMedia();

    //text reveal
    if (heroText) {
        const textContent = heroText.innerText;
        heroText.innerHTML = '';

        let spans = [];
        textContent.split(' ').forEach(word => {
            const span = document.createElement('span');
            span.innerText = word + ' ';
            span.style.opacity = 0.1;
            span.style.transform = 'translateY(20px)'; // Added for float effect
            span.style.display = 'inline-block'; // Necessary for transform to work on span
            span.style.whiteSpace = 'pre'; // Preserves the trailing space
            span.style.filter = 'blur(10px)'; // Start blurred (Idea 2)
            span.style.willChange = 'transform, filter, opacity'; // Optimize for ScrollTrigger Scrubbing
            heroText.appendChild(span);
            spans.push(span);
        });

        mm.add("(min-width: 900px)", () => {

            // Idea 3: Initial Entry Animation (Title and button enter immediately)
            gsap.to(".main-title, .btn-custom2", {
                opacity: 1,
                y: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "power3.out",
                delay: 0.2, // Wait slightly after load
                onStart: () => {
                    gsap.set(".main-title, .btn-custom2", { visibility: "visible", y: 20 });
                }
            });

            let textTl = gsap.timeline({ paused: true });
            textTl.to(spans, {
                opacity: 1,
                y: 0, // Animate back to original position
                filter: 'blur(0px)', // Un-blur as it moves
                stagger: 0.1,
                ease: "power2.out" // Use a nicer ease for the float
            });

            ScrollTrigger.create({
                id: "heroIntro",
                trigger: "#domov",
                start: "top top",
                end: "+=150%",
                pin: true,
                scrub: 1,

                onLeave: () => {
                    hasScrolledPast = true;
                    gsap.set(spans, { opacity: 0.1, y: 20, filter: 'blur(10px)' });
                },
                onUpdate: (self) => {
                    if (!hasScrolledPast) {
                        textTl.progress(self.progress);

                    } else {
                        textTl.progress(1 - self.progress);
                    }
                }
            });


            return () => {
                hasScrolledPast = false;
            };
        });

        mm.add("(max-width: 900px)", () => {
            gsap.set(spans, { opacity: 1, y: 0, filter: 'blur(0px)' });
            gsap.set(".main-title, .btn-custom2", { opacity: 1, visibility: "visible", y: 0 });
        });
    }

    window.addEventListener("scroll", () => {
        if (hasScrolledPast && window.scrollY <= 0) {
            let introTrigger = ScrollTrigger.getById("heroIntro");
            if (introTrigger) {
                introTrigger.kill(true);
                gsap.set("#heroText span", { opacity: 1, y: 0 });
                ScrollTrigger.refresh();
            }
        }
    });

    //change navbar
    const firstContentSection = document.querySelector('section');

    if (firstContentSection && navbar) {
        ScrollTrigger.create({
            trigger: firstContentSection,
            start: "top 80px",
            onEnter: () => {
                navbar.classList.add('scrolled', 'navbar-light');
                navbar.classList.remove('navbar-dark');
            },
            onLeaveBack: () => {
                navbar.classList.remove('scrolled', 'navbar-light');
                navbar.classList.add('navbar-dark');
            }
        });
    }

    //glitch
    document.querySelectorAll('#mainNav a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href) return;

            const [path, hash] = href.split('#');
            // If the anchor points to another page, don't do anything here (let browser navigate)
            if (path && !window.location.pathname.endsWith(path) && !(path === 'index.html' && window.location.pathname.endsWith('/'))) return;
            if (!hash) return;

            // Only kill the trigger if it actually exists (Desktop only)
            let introTrigger = ScrollTrigger.getById("heroIntro");
            if (introTrigger && hash !== 'domov') {
                introTrigger.kill(true);
                gsap.set("#heroText span", { opacity: 1, y: 0 });
                hasScrolledPast = true;
                ScrollTrigger.refresh();
            }

            // The actual scrolling is now handled universally by the lenis scrollTo click listener below
        });
    });

    // Zapri mobilni meni ko kliknemo na povezavo
    const linksToCloseMenu = document.querySelectorAll('.nav-link:not([data-bs-toggle="dropdown"]), .dropdown-item');

    const menuToggle = document.getElementById('navbarNav');

    // Preverimo varnostno, če element obstaja
    if (menuToggle) {
        const bsCollapse = new bootstrap.Collapse(menuToggle, { toggle: false });

        linksToCloseMenu.forEach((l) => {
            l.addEventListener('click', () => {
                // Zapremo meni samo, če je trenutno odprt (ima razred 'show')
                if (menuToggle.classList.contains('show')) {
                    bsCollapse.hide();
                }
            });
        });
    }

    //za starejse browserje
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Preskoči navadne modale/galerije

            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const subpages = [
        'kuhinje.html',
        'izdelki.html',
        'pohistvo.html',
        'prostori.html',
        'stopnice.html',
        'vrata.html'
    ];

    //dobi ime datoteke
    const currentPage = window.location.pathname.split('/').pop();

    if (subpages.includes(currentPage)) {
        const activeSubLink = document.querySelector(`.dropdown-item[href="${currentPage}"]`);

        if (activeSubLink) {

            const parentLink = activeSubLink.closest('.dropdown').querySelector('.nav-link');

            if (parentLink) {
                parentLink.classList.add('active');
            }
        }
    }



    // 2. LOGIKA ZA AKTIVNE POVEZAVE V MENIJU (UNIVERZALNO)
    const isHomePage = document.getElementById('domov') !== null;

    if (window.innerWidth >= 992) {
        const sections = document.querySelectorAll('section, header');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const tagName = target.tagName.toLowerCase();
                    const id = target.id || "";

                    const isHeader = tagName === 'header' || target.classList.contains('page-header') || id === 'domov';

                    // Najprej očistimo vse active razrede
                    document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item').forEach(link => {
                        link.classList.remove('active');
                    });

                    // Če smo na headerju (tudi na podstraneh), pustimo meni neoznačen
                    if (isHeader) {
                        return;
                    }

                    // Če smo drseli dol na vsebino:
                    if (isHomePage) {
                        // LOGIKA ZA PRVO STRAN
                        if (id) {
                            let navLink = document.querySelector(`.navbar-nav a[href="#${id}"]`) ||
                                document.querySelector(`.navbar-nav a[href="index.html#${id}"]`);

                            if (id === 'storitve') {
                                navLink = document.querySelector('.nav-item.dropdown > .nav-link');
                            }

                            if (navLink) {
                                navLink.classList.add('active');
                                const parentDropdown = navLink.closest('.dropdown');
                                if (parentDropdown) {
                                    const parentLink = parentDropdown.querySelector('.nav-link');
                                    if (parentLink) parentLink.classList.add('active');
                                }
                            }
                        }
                    } else {
                        // LOGIKA ZA PODSTRANI (kuhinje, stopnice...)
                        // Fiksno označi "Produkti-Proizvodi", saj smo na vsebini podstrani
                        const productDropdown = document.querySelector('.nav-item.dropdown > .nav-link');
                        if (productDropdown) {
                            productDropdown.classList.add('active');
                        }
                    }
                }
            });
        }, {
            threshold: 0.2
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }
    //galerija
    const allGalleryItems = document.querySelectorAll('.gallery-card, .gallery-item');
    const galleryModalElement = document.getElementById('galleryModal');

    if (galleryModalElement) {
        const galleryModal = new bootstrap.Modal(galleryModalElement);
        const modalTitle = document.getElementById('galleryModalLabel');
        const carouselContainer = document.getElementById('carousel-images-container');

        allGalleryItems.forEach(item => {
            item.addEventListener('click', function () {
                const title = this.getAttribute('data-title');
                const imagesString = this.getAttribute('data-images');

                if (!imagesString) return;

                const images = imagesString.split(',');

                if (modalTitle) modalTitle.textContent = title;

                // Spinner
                if (carouselContainer) {
                    carouselContainer.innerHTML = `
                        <div class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Nalaganje...</span>
                            </div>
                        </div>`;
                }

                let slidesHtml = '';
                images.forEach((imgUrl, index) => {
                    const isActive = index === 0 ? 'active' : '';
                    const loadingAttr = index === 0 ? 'eager' : 'lazy';

                    slidesHtml += `
                        <div class="carousel-item ${isActive}">
                            <img src="${imgUrl.trim()}" 
                                class="d-block img-fluid mx-auto" 
                                alt="${title} - slika ${index + 1}"
                                loading="${loadingAttr}">
                        </div>
                    `;
                });

                // Small timeout to ensure the spinner is replaced correctly
                setTimeout(() => {
                    if (carouselContainer) carouselContainer.innerHTML = slidesHtml;
                }, 100);

                galleryModal.show();
            });
        });

        galleryModalElement.addEventListener('hidden.bs.modal', function () {
            if (carouselContainer) carouselContainer.innerHTML = '';
        });
    }


    // 4. Globalne opazovanje elementov za animacije ob skrolu
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const target = entry.target;
            if (entry.isIntersecting) {
                // Skupne animacije
                if (target.classList.contains('animate-on-scroll')) {
                    target.classList.add('is-visible');
                    scrollObserver.unobserve(target);
                }
                if (target.classList.contains('reveal') || target.classList.contains('process-step-row')) {
                    target.classList.add('active');
                }
                if (target.classList.contains('reveal-box')) {
                    target.classList.add('animated');
                }
                if (target.tagName.toLowerCase() === 'h2') {
                    target.classList.add('heading-visible');
                }
            } else {
                // Skrijemo elemente ob skrolanju navzgor (če je potrebno)
                if (target.classList.contains('reveal') || target.classList.contains('process-step-row')) {
                    target.classList.remove('active');
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    // Registriramo vse elemente v en sam observer
    document.querySelectorAll('.animate-on-scroll, .reveal, .process-step-row, .reveal-box, h2').forEach(el => {
        if (el.tagName.toLowerCase() === 'h2') el.classList.add('heading-animate');
        scrollObserver.observe(el);
    });

    //to the top button
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // Če gumb obstaja, dodamo logiko
    if (scrollToTopBtn) {
        // A. Prikaži/skrij gumb
        window.addEventListener('scroll', function () {
            // Prikažemo, ko je skrol večji od 300px
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        // B. Premik na vrh ob kliku (gladka animacija)
        scrollToTopBtn.addEventListener('click', function (e) {
            e.preventDefault(); // Prepreči skok na #
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Ključ za gladko animacijo
            });
        });
    }


    //menjavanje slik na gl strnai
    const heroSection = document.getElementById('domov');
    const imageProgressBar = document.getElementById('imageProgressBar');
    const rotatingImages = [
        "url('slike/stopnice_11.webp')",
        "url('slike/pisarna_3.webp')",
        "url('slike/kuhinja_5.webp')"
    ];

    let currentImageIndex = 0;

    function changeBackgroundImage() {
        if (!heroSection && !imageProgressBar) return;

        imageProgressBar.classList.remove('running');
        void imageProgressBar.offsetWidth;
        imageProgressBar.classList.add('running');

        heroSection.style.backgroundImage = rotatingImages[currentImageIndex];

        currentImageIndex = (currentImageIndex + 1) % rotatingImages.length;
    }

    // 4. Zaženemo menjavo slik
    if (heroSection) {
        changeBackgroundImage();

        // Nastavimo interval menjave (npr. vsakih 6 sekund = 6000 milisekund)
        setInterval(changeBackgroundImage, 6000);
    }



    var lightboxModal = document.getElementById('lightboxModal');

    if (lightboxModal) {
        lightboxModal.addEventListener('show.bs.modal', function (event) {
            var button = event.relatedTarget;

            var imageSrc = button.getAttribute('data-bs-img-src');
            var imageAlt = button.getAttribute('data-bs-img-alt');

            var modalImage = lightboxModal.querySelector('#lightboxImage');
            modalImage.src = imageSrc;
            modalImage.alt = imageAlt;
        });
    }

    // Contact Form Handler for mailto substitution
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const inputs = contactForm.querySelectorAll('input:not([type="checkbox"]), textarea');
            const name = inputs[0]?.value || '';
            const email = inputs[1]?.value || '';
            const subjectInput = inputs[2]?.value || 'Spletno povpraševanje';
            const message = inputs[3]?.value || '';

            const receiver = "mizarstvokrebs@gmail.com";
            const subject = encodeURIComponent(subjectInput + " - " + name);
            const body = encodeURIComponent(
                "Ime: " + name + "\n" +
                "Email: " + email + "\n\n" +
                "Sporočilo:\n" + message
            );

            window.location.href = `mailto:${receiver}?subject=${subject}&body=${body}`;

            // Optional: reset form after a short delay
            setTimeout(() => {
                contactForm.reset();
            }, 500);
        });
    }
});

const aboutSection = document.querySelector('#o-nas');
const ringPaths = document.querySelectorAll('.wood-stump-svg path');

if (aboutSection && ringPaths.length > 0) {
    let ticking = false;

    aboutSection.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const rect = aboutSection.getBoundingClientRect();

                // Tvoja originalna matematika
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                ringPaths.forEach((path, index) => {
                    const depth = (index + 1) * 6;
                    const rotate = (index + 1) * 0.7;


                    path.style.transition = 'transform 0.4s ease-out';
                    path.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0) rotate(${x * rotate}deg)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });

    aboutSection.addEventListener('mouseleave', () => {
        ringPaths.forEach((path) => {
            path.style.transition = 'transform 1s cubic-bezier(0.23, 1, 0.32, 1)';
            path.style.transform = `translate3d(0, 0, 0) rotate(0deg)`;
        });
    });
}

const vizSection = document.querySelector('#vizualizacija');
const vizStump = document.querySelector('.viz-stump');

if (vizSection && vizStump) {
    let tickingViz = false;
    let vizMouseMove = (e) => {
        if (!tickingViz) {
            window.requestAnimationFrame(() => {
                const rect = vizSection.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                vizStump.style.transform = `translate(calc(-49% + ${x * 30}px), calc(-49% + ${y * 30}px)) scale(1.03)`;
                tickingViz = false;
            });
            tickingViz = true;
        }
    };

    vizSection.addEventListener('mouseenter', () => {
        vizSection.addEventListener('mousemove', vizMouseMove, { passive: true });
    });

    vizSection.addEventListener('mouseleave', () => {
        vizSection.removeEventListener('mousemove', vizMouseMove);
        window.requestAnimationFrame(() => {
            vizStump.style.transform = `translate(-49%, -49%) scale(1)`;
        });
    });
}

const gallerySection = document.querySelector('#galerija');
const knot = document.querySelector('.gallery-knot');

if (gallerySection && knot) {
    let tickingGallery = false;
    let galleryMouseMove = (e) => {
        if (!tickingGallery) {
            window.requestAnimationFrame(() => {
                const rect = gallerySection.getBoundingClientRect();

                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                knot.style.transform = `translate(${x * 30}px, ${y * 20}px) scale(1.03) rotate(${x * 2}deg)`;
                tickingGallery = false;
            });
            tickingGallery = true;
        }
    };

    gallerySection.addEventListener('mouseenter', () => {
        gallerySection.addEventListener('mousemove', galleryMouseMove, { passive: true });
    });

    gallerySection.addEventListener('mouseleave', () => {
        gallerySection.removeEventListener('mousemove', galleryMouseMove);
        window.requestAnimationFrame(() => {
            knot.style.transform = `translate(0, 0) scale(1) rotate(0deg)`;
        });
    });
}

// Reveal animaice so sedaj vključene v globalni scrollObserver v window.load

// Reveal box in H2 animacije so sedaj vključene v globalni scrollObserver v window.load

const magneticButtons = document.querySelectorAll('.btn-custom2');
let tickingMagnet = false;
let buttonCaches = [];

function cacheMagneticButtons() {
    buttonCaches = Array.from(magneticButtons).map(btn => {
        const rect = btn.getBoundingClientRect();
        // Calculate absolute position on the page (independent of scroll)
        return {
            btn: btn,
            absCenterX: rect.left + window.scrollX + rect.width / 2,
            absCenterY: rect.top + window.scrollY + rect.height / 2
        };
    });
}

// Initial cache after load & on resize to avoid Layout Thrashing
window.addEventListener('load', cacheMagneticButtons);
window.addEventListener('resize', cacheMagneticButtons, { passive: true });

window.addEventListener('mousemove', function (e) {
    if (buttonCaches.length === 0) return;

    if (!tickingMagnet) {
        window.requestAnimationFrame(() => {
            // e.pageX and e.pageY provide absolute document coordinates
            const mouseX = e.pageX;
            const mouseY = e.pageY;

            buttonCaches.forEach(item => {
                const distanceX = mouseX - item.absCenterX;
                const distanceY = mouseY - item.absCenterY;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                const proximity = 120;
                if (distance < proximity) {
                    const strength = 0.1;
                    const x = distanceX * strength;
                    const y = distanceY * strength;

                    item.btn.style.transform = `translate(${x}px, ${y}px)`;
                    item.btn.style.transition = 'transform 0.1s ease-out';
                } else {
                    item.btn.style.transform = 'translate(0px, 0px)';
                    item.btn.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
                }
            });
            tickingMagnet = false;
        });
        tickingMagnet = true;
    }
}, { passive: true });

const lenis = new Lenis({
    duration: 1.2,
    lerp: 0.1,
    wheelMultiplier: 1,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 2,
});

// 1. Integracija Lenis s ScrollTrigger
// lenis.on('scroll', ScrollTrigger.update); To preobremeni render cikl. Gsap ticker ze osvezi!

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// 2. Nadomestitev sidrišč z Lenis scrollTo funkcijo (tudi index.html#sidro)
document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href) return;

        const [path, hash] = href.split('#');

        // Preverimo, ali smo že na ciljni strani
        const currentPath = window.location.pathname;
        const isSamePage = !path || currentPath.endsWith(path) || (path === 'index.html' && (currentPath.endsWith('/') || currentPath === ''));

        // Če smo na isti strani in imamo hash, uporabimo lenis za gladek skok
        if (isSamePage && hash) {
            e.preventDefault();

            if (hash === 'top' || this.classList.contains('scroll-to-top')) {
                lenis.scrollTo(0);
            } else {
                // Počakamo malo če morda še ni renderirano, ampak običajno ni potrebno
                lenis.scrollTo('#' + hash, {
                    offset: -50,
                    duration: 1.5
                });
            }
        }
        // V nasprotnem primeru pustimo brskalniku, da naloži drugo stran
    });
});





//floating particles
const canvas = document.getElementById('dustCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
// Optimizacija: Manj delcev za manjši zagon procesorja pri velikih ekranih
const particleCount = window.innerWidth > 768 ? 40 : 25;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.8 + 0.5; // Zelo majhni delci
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.4 + 0.1; // Padajo rahlo navzdol
        this.opacity = Math.random() * 0.5;
        this.fadeSpeed = Math.random() * 0.01 + 0.002;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Če delec zapusti zaslon, ga ponovno ustvarimo na vrhu
        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width || this.x < 0) {
            this.speedX *= -1;
        }

        // Subtilno utripanje (twinkle)
        this.opacity += this.fadeSpeed;
        if (this.opacity > 0.78 || this.opacity < 0.1) {
            this.fadeSpeed *= -1;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(179, 142, 93, ${this.opacity})`; // Tvoja zlato-rjava barva
        ctx.fill();
    }
}

function createParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

let isDustVisible = true;
let animationFrameId;

function animateDust() {
    if (!isDustVisible) return; // Optimizacija: Ne risi, ce ni vidno

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    animationFrameId = requestAnimationFrame(animateDust);
}

createParticles();

// Optimizacija: Počakajmo malo z obremenitvijo CPU-ja (canvas animacijo), da damo prioriteto izrisu glavne strani.
setTimeout(() => {
    // Opazuj hero sekcijo in ustavi animacijo, ko ni vidna
    const heroSectionDust = document.getElementById('domov');
    if (heroSectionDust) {
        const dustObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isDustVisible = true;
                    animateDust();
                } else {
                    isDustVisible = false;
                    if (animationFrameId) cancelAnimationFrame(animationFrameId);
                }
            });
        }, { threshold: 0 });

        dustObserver.observe(heroSectionDust);
    } else {
        animateDust(); // Fallback, ce hero sekcija ni najdena
    }
}, 500);
/*custom miska
document.addEventListener('DOMContentLoaded', () => {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    let mouseX = 0;
    let mouseY = 0;

    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;

    // Hitrosti (0.1 je zelo mehko, 1.0 je trdo sledenje)
    const dotSpeed = 1.3;      
    const outlineSpeed = 0.6; 

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {

        dotX += (mouseX - dotX) * dotSpeed;
        dotY += (mouseY - dotY) * dotSpeed;
        dot.style.transform = `translate(-50%, -50%) translate3d(${dotX}px, ${dotY}px, 0)`;

        outlineX += (mouseX - outlineX) * outlineSpeed;
        outlineY += (mouseY - outlineY) * outlineSpeed;
        outline.style.transform = `translate(-50%, -50%) translate3d(${outlineX}px, ${outlineY}px, 0)`;

        requestAnimationFrame(animate);
    }
    
    animate();

    // Hover učinki na elementih
    const interactives = document.querySelectorAll('a, button, .process-step-item, .gallery-item, img, .material-feature');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            outline.classList.add('cursor-active-outline');
        });
        el.addEventListener('mouseleave', () => {
            outline.classList.remove('cursor-active-outline');
        });
    });
});*/