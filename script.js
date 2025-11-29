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


    // --- 4. AKTIVNO STANJE POVEZAVE OB SKROLANJU (SAMO NA INDEX.HTML) ---
    
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
});