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
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('navbarNav');
    const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle: false});

    navLinks.forEach((l) => {
        l.addEventListener('click', () => {
            if (menuToggle.classList.contains('show')) {
                bsCollapse.toggle();
            }
        });
    });

    // Smooth scroll za starejše brskalnike (opcijsko, ker CSS scroll-behavior: smooth večinoma deluje)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

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