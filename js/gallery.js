/**
 * =========================================================================
 * STAGE 4 - FRIENDSHIP PHOTO GALLERY & LIGHTBOX
 * =========================================================================
 * Renders exactly 10 friendship photographs in a responsive grid.
 * Lightbox preserves full aspect ratio using object-fit: contain.
 * Keyboard navigation: Left/Right arrows, Escape to close.
 * Touch swipe supported on mobile devices.
 */

class FriendshipGallery {
    constructor() {
        this.gridContainer = document.getElementById('galleryGrid');
        this.lightbox = document.getElementById('galleryLightbox');
        this.lightboxImg = document.getElementById('lightboxImage');
        this.lightboxTitle = document.getElementById('lightboxTitle');
        this.lightboxQuote = document.getElementById('lightboxQuote');
        this.lightboxCounter = document.getElementById('lightboxCounter');
        this.closeBtn = document.getElementById('lightboxClose');
        this.prevBtn = document.getElementById('lightboxPrev');
        this.nextBtn = document.getElementById('lightboxNext');

        this.currentIndex = 0;
        this.items = window.CONFIG && window.CONFIG.gallery ? window.CONFIG.gallery : [];

        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        if (!this.gridContainer) return;
        this.renderGrid();
        this.bindEvents();
    }

    renderGrid() {
        this.gridContainer.innerHTML = '';
        this.items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.dataset.index = index;
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `View photo ${index + 1}: ${item.title}`);

            card.innerHTML = `
                <div class="gallery-card-inner">
                    <div class="gallery-img-wrapper">
                        <img src="${item.image}" alt="${item.alt}" class="gallery-img" loading="lazy">
                        <div class="gallery-badge">#${index + 1}</div>
                    </div>
                    <div class="gallery-overlay">
                        <div class="gallery-overlay-content">
                            <span class="gallery-tag">Memory #${index + 1}</span>
                            <h3 class="gallery-card-title">${item.title}</h3>
                            <p class="gallery-card-quote">“${item.quote}”</p>
                            <span class="gallery-zoom-hint">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    <line x1="11" y1="8" x2="11" y2="14"></line>
                                    <line x1="8" y1="11" x2="14" y2="11"></line>
                                </svg>
                                Tap to expand
                            </span>
                        </div>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => this.open(index));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.open(index);
                }
            });

            this.gridContainer.appendChild(card);
        });
    }

    bindEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.prev();
            });
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.next();
            });
        }

        // Close on clicking backdrop
        if (this.lightbox) {
            this.lightbox.addEventListener('click', (e) => {
                if (e.target === this.lightbox || e.target.classList.contains('lightbox-backdrop')) {
                    this.close();
                }
            });

            // Touch swipe support for mobile
            this.lightbox.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            this.lightbox.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, { passive: true });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox || !this.lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') {
                this.close();
            } else if (e.key === 'ArrowLeft') {
                this.prev();
            } else if (e.key === 'ArrowRight') {
                this.next();
            }
        });
    }

    handleSwipe() {
        const threshold = 40;
        if (this.touchEndX < this.touchStartX - threshold) {
            // Swiped left -> Next
            this.next();
        } else if (this.touchEndX > this.touchStartX + threshold) {
            // Swiped right -> Prev
            this.prev();
        }
    }

    open(index) {
        if (!this.items[index]) return;
        this.currentIndex = index;
        this.updateLightboxContent();

        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Trigger confetti celebration on opening first image if desired
        if (window.confetti && Math.random() > 0.5) {
            window.confetti.burst(window.innerWidth / 2, window.innerHeight * 0.4, 40);
        }
    }

    close() {
        if (!this.lightbox) return;
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.updateLightboxContent('next');
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.updateLightboxContent('prev');
    }

    updateLightboxContent(direction = 'none') {
        const item = this.items[this.currentIndex];
        if (!item) return;

        // Animate image transition
        this.lightboxImg.classList.add('changing');
        setTimeout(() => {
            this.lightboxImg.src = item.image;
            this.lightboxImg.alt = item.alt;
            this.lightboxTitle.textContent = item.title;
            this.lightboxQuote.textContent = `“${item.quote}”`;
            this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
            this.lightboxImg.classList.remove('changing');
        }, 150);
    }
}

window.FriendshipGallery = FriendshipGallery;

