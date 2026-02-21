window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    
    setTimeout(() => {
        preloader.classList.add('loader-hidden');
        
        setTimeout(() => {
            document.body.style.overflow = 'auto';
        }, 800);
    }, 1000);
});

// Medtem ko se nalaga, preprečimo skrolanje
document.body.style.overflow = 'hidden';

document.addEventListener("DOMContentLoaded", function() {
    
    // Sprememba navigacije ob skrolanju
    const navbar = document.getElementById('mainNav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('navbar-dark');
            navbar.classList.add('navbar-light');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.add('navbar-dark');
            navbar.classList.remove('navbar-light');
        }
    });

    // Zapri mobilni meni ko kliknemo na povezavo
    const linksToCloseMenu = document.querySelectorAll('.nav-link:not([data-bs-toggle="dropdown"]), .dropdown-item');
    
    const menuToggle = document.getElementById('navbarNav');

    // Preverimo varnostno, če element obstaja
    if (menuToggle) {
        const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle: false});

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
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
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

    if (!subpages.includes(currentPage) && window.innerWidth >= 992) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5 
        };

        const sections = document.querySelectorAll('.section-padding, .hero-section, .page-header');
        
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                // Uporabimo 'let' da lahko kasneje spremenimo navLink
                let navLink = document.querySelector(`.nav-link[href="index.html#${id}"], .nav-link[href="#${id}"]`);
                
                if (entry.isIntersecting) {
                    // Odstrani aktivni razred z vseh povezav
                    document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item').forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // *** KLJUČNI POPRAVEK: Ročno poiščemo 'Storitve' link ***
                    if (id === 'storitve') {
                        // Poišči glavno povezavo 'Storitve' preko strukture (.nav-item.dropdown > .nav-link)
                        navLink = document.querySelector('.nav-item.dropdown > .nav-link');
                    }

                    // Določi aktivno povezavo
                    if (navLink) {
                        navLink.classList.add('active');
                        
                    }
                    
                    // Posebna obravnava za AKTIVIRANJE PODLINKOV, če je aktivna sekcija podrejena dropdown meniju
                    const parentDropdown = navLink ? navLink.closest('.dropdown') : null;
                    if (parentDropdown) {
                        // Ta blok ponovno aktivira nadrejeni link (Storitve), kar je redundantno ampak varno
                        parentDropdown.querySelector('.nav-link').classList.add('active');
                    }
                }
            });
        }, observerOptions);

        // Začnemo opazovati vse sekcije
        sections.forEach(section => {
            if (section.getAttribute('id')) {
                sectionObserver.observe(section);
            }
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
            item.addEventListener('click', function() {
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


    const animElements = document.querySelectorAll('.animate-on-scroll');

    if (animElements.length > 0) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Dodaj razred, ko je element viden
                    entry.target.classList.add('is-visible');
                    // Preneha opazovati element po animaciji
                    observer.unobserve(entry.target); 
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.2
        });

        animElements.forEach(element => {
            observer.observe(element);
        });
    }

    //to the top button
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    // Če gumb obstaja, dodamo logiko
    if (scrollToTopBtn) {
        // A. Prikaži/skrij gumb
        window.addEventListener('scroll', function() {
            // Prikažemo, ko je skrol večji od 300px
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        // B. Premik na vrh ob kliku (gladka animacija)
        scrollToTopBtn.addEventListener('click', function(e) {
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
        "url('slike/kuhinja_5.webp')", 
        "url('slike/pisarna_3.webp')", 
        "url('slike/stopnice_11.webp')" 
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
    vizSection.addEventListener('mousemove', (e) => {
        const rect = vizSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        vizStump.style.transform = `translate(calc(-49% + ${x * 30}px), calc(-49% + ${y * 30}px)) scale(1.03)`;
    });

    vizSection.addEventListener('mouseleave', () => {
        vizStump.style.transform = `translate(-49%, -49%) scale(1)`;
    });
}

const gallerySection = document.querySelector('#galerija');
const knot = document.querySelector('.gallery-knot');

if (gallerySection && knot) {
    gallerySection.addEventListener('mousemove', (e) => {
        const rect = gallerySection.getBoundingClientRect();
   
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        knot.style.transform = `translate(${x * 30}px, ${y * 20}px) scale(1.03) rotate(${x * 2}deg)`;
    });

    gallerySection.addEventListener('mouseleave', () => {
        knot.style.transform = `translate(0, 0) scale(1) rotate(0deg)`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal, .process-step-row');

    const observerOptions = {
        threshold: 0.15, 
        rootMargin: "0px 0px -50px 0px" 
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Če želiš, da se animacija izvede le enkrat, odkomentiraj spodnjo vrstico:
                // observer.unobserve(entry.target);
            } else {
                // Če želiš, da se ob skrolanju navzgor elementi spet skrijejo:
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal-box').forEach(box => revealObserver.observe(box));


// Elegantna animacija naslovov ob skrolu
const headingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('heading-visible');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('h2').forEach(h2 => {
    h2.classList.add('heading-animate');
    headingObserver.observe(h2);
});

const magneticButtons = document.querySelectorAll('.btn-custom2');

window.addEventListener('mousemove', function(e) {
    magneticButtons.forEach(btn => {
        const rect = btn.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        //kk blizo v px
        const proximity = 120; 

        if (distance < proximity) {
            // Moč efekta (manjša številka = bolj subtilno, poskusi 0.1 ali 0.15)
            const strength = 0.1; 
            const x = distanceX * strength;
            const y = distanceY * strength;

            btn.style.transform = `translate(${x}px, ${y}px)`;
            btn.style.transition = 'transform 0.1s ease-out'; 
        } else {
            btn.style.transform = 'translate(0px, 0px)';
            btn.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        }
    });
});

const lenis = new Lenis({
  duration: 1.2,     // Dolžina trajanja skrola (v sekundah)
  lerp: 0.1,         // Nižje je bolj "gumijasto", višje je bolj odzivno (poskusi 0.1 ali 0.15)
  wheelMultiplier: 1, // Moč koleščka na miški
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  smoothTouch: false, // IZKLJUČI na touch napravah, da ne bo laga
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);


//floating particles
const canvas = document.getElementById('dustCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 80; // Število delcev (manj je bolj elegantno)

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
        this.size = Math.random() * 1.5 + 0.5; // Zelo majhni delci
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
        if (this.opacity > 0.7 || this.opacity < 0.1) {
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

function animateDust() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateDust);
}

createParticles();
animateDust();

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