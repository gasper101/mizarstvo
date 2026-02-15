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

    // Smooth scroll za starejše brskalnike (opcijsko, ker CSS scroll-behavior: smooth večinoma deluje)
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
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModalElement = document.getElementById('galleryModal');

    if (galleryModalElement) {
        const galleryModal = new bootstrap.Modal(galleryModalElement);
        const modalTitle = document.getElementById('galleryModalLabel');
        const carouselContainer = document.getElementById('carousel-images-container');

        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const title = this.getAttribute('data-title');
                const imagesString = this.getAttribute('data-images'); 
                
                if (!imagesString) return;
                
                const images = imagesString.split(',');

                modalTitle.textContent = title;

                //spinner
                carouselContainer.innerHTML = `
                    <div class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Nalaganje...</span>
                        </div>
                    </div>`;

                let slidesHtml = '';
                images.forEach((imgUrl, index) => {
                    const isActive = index === 0 ? 'active' : '';
                    //lazy da se ne takoj nalozijo
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

                setTimeout(() => {
                    carouselContainer.innerHTML = slidesHtml;
                }, 100);

                galleryModal.show();
            });
        });

        galleryModalElement.addEventListener('hidden.bs.modal', function () {
            carouselContainer.innerHTML = '';
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