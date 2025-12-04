document.addEventListener("DOMContentLoaded", function() {
    
    // Sprememba navigacije ob skrolanju
    const navbar = document.getElementById('mainNav');
    const isKuhinjePage = document.title.includes('Kuhinje');
    
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

    //za active podcrtavo
    if (isKuhinjePage) {
        // Ker smo na kuhinje.html, ročno dodamo razred 'active'
        const kuhinjeLink = document.querySelector('.dropdown-item[href="kuhinje.html"]');
        if (kuhinjeLink) {
            // Aktivira 'Kuhinje po meri'
            kuhinjeLink.classList.add('active');
            // Aktivira nadrejeni 'Storitve'
            const storitveLink = kuhinjeLink.closest('.dropdown').querySelector('.nav-link');
            if (storitveLink) {
                 storitveLink.classList.add('active');
            }
        }
    }

    if (!isKuhinjePage && window.innerWidth >= 992) {
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
    
    // Preveri, če modal obstaja (da ne javlja napak na podstraneh kjer ga ni)
    if (galleryModalElement) {
        const galleryModal = new bootstrap.Modal(galleryModalElement);
        const modalTitle = document.getElementById('galleryModalLabel');
        const carouselContainer = document.getElementById('carousel-images-container');

        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                // 1. Dobimo podatke iz kliknjenega elementa
                const title = this.getAttribute('data-title');
                // String "img1,img2" pretvorimo v array ["img1", "img2"]
                const imagesString = this.getAttribute('data-images'); 
                
                if (!imagesString) return; // Varovalka če ni slik
                
                const images = imagesString.split(',');

                // 2. Nastavimo naslov
                modalTitle.textContent = title;

                // 3. Počistimo prejšnje slike
                carouselContainer.innerHTML = '';

                // 4. Zgeneriramo nove slike za vrtiljak
                images.forEach((imgUrl, index) => {
                    const isActive = index === 0 ? 'active' : '';
                    
                    const slideHtml = `
                        <div class="carousel-item ${isActive}">
                            <img src="${imgUrl}" class="d-block img-fluid" alt="${title} - slika ${index + 1}">
                        </div>
                    `;
                    carouselContainer.insertAdjacentHTML('beforeend', slideHtml);
                });

                // 5. Odpremo modal
                galleryModal.show();
            });
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
            threshold: 0.2 // Sproži animacijo, ko je 10% elementa vidnega
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
        "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')", 
        "url('https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", 
        "url('https://images.unsplash.com/photo-1633948393301-d43e3ec0e5cd?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" 
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
});