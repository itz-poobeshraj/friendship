/**
 * =========================================================================
 * MAIN APPLICATION SCRIPT
 * =========================================================================
 * - Stage 1 Login validation & unlocking transition
 * - Dynamic config injection (friend's name, wishes, etc.)
 * - IntersectionObserver for scroll animations
 * - Floating navigation bar and scroll spy
 * - Global event listeners and module initialization
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Particle Engine & Confetti
    const particleEngine = new AmbientParticleEngine('ambientParticleCanvas');
    const confetti = new ConfettiCannon();
    window.confetti = confetti;

    // 2. Inject Config Data into DOM
    injectConfigData();

    // 3. Setup Stage 1 Login Logic
    setupLogin(confetti);

    // 4. Initialize Stage Modules
    const gallery = new FriendshipGallery();
    const player = new CinematicPlayer();
    const envelope = new SecretEnvelope();

    // 5. Setup Scroll Interaction & Animations
    setupScrollButtons();
    setupScrollAnimations();
});

/**
 * Dynamically injects values from js/config.js into HTML placeholders
 */
function injectConfigData() {
    if (!window.CONFIG) return;

    // Replace friend name occurrences
    const rawName = window.CONFIG.friendName || "sornakaa";
    const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const namePlaceholders = document.querySelectorAll('.inject-friend-name');
    namePlaceholders.forEach(el => {
        el.textContent = displayName;
    });

    // Update birthday wish
    const wishEl = document.getElementById('birthdayWishText');
    if (wishEl && window.CONFIG.birthdayWish) {
        wishEl.textContent = window.CONFIG.birthdayWish;
    }

    const subEl = document.getElementById('welcomeSubtitle');
    if (subEl && window.CONFIG.welcomeSubtitle) {
        subEl.textContent = window.CONFIG.welcomeSubtitle;
    }
}

/**
 * Stage 1 - Login & Authentication Simulation
 */
function setupLogin(confetti) {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');
    const loginError = document.getElementById('loginError');
    const loginBtn = document.getElementById('loginSubmitBtn');
    const loginStage = document.getElementById('stage1-login');
    const mainJourney = document.getElementById('mainJourney');

    if (!loginForm) return;

    // Toggle password visibility
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
            togglePasswordBtn.innerHTML = isPassword ? `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            ` : `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
        });
    }

    // Form submission validation
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const expectedName = (window.CONFIG.friendName || "").trim().toLowerCase();
        const expectedDOB = (window.CONFIG.friendDOB || "").trim();

        const inputName = usernameInput.value.trim().toLowerCase();
        const inputDOB = passwordInput.value.trim();

        const validNames = [expectedName, "sorna", "sornakaa", "bestie"];

        // Validation logic
        if (validNames.includes(inputName) && inputDOB === expectedDOB) {
            // Success!
            loginError.classList.remove('active');
            loginBtn.classList.add('loading');
            loginBtn.innerHTML = `<span>Unlocking magic... ♡</span>`;

            // Confetti shower
            confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 140);

            setTimeout(() => {
                // Smooth transition to Stage 2
                loginStage.classList.add('fade-out');

                setTimeout(() => {
                    loginStage.style.display = 'none';
                    mainJourney.classList.add('unlocked');

                    // Smoothly scroll to Stage 2
                    const welcomeSection = document.getElementById('stage2-welcome');
                    if (welcomeSection) {
                        welcomeSection.scrollIntoView({ behavior: 'smooth' });
                    }

                    // Extra confetti burst on welcome screen
                    setTimeout(() => {
                        confetti.burst(window.innerWidth / 2, window.innerHeight * 0.3, 100);
                    }, 400);

                }, 600);
            }, 700);

        } else {
            // Friendly error message with gentle shake
            loginError.textContent = `Oops! That's not quite right. Make sure your name and birthday (DDMMYYYY) are correct! ♡`;
            loginError.classList.add('active');
            loginForm.classList.add('shake');

            setTimeout(() => {
                loginForm.classList.remove('shake');
            }, 600);
        }
    });

    // Helper button to prefill credentials for instant testing
    const prefillBtn = document.getElementById('prefillCredentialsBtn');
    if (prefillBtn) {
        prefillBtn.addEventListener('click', () => {
            usernameInput.value = window.CONFIG.friendName;
            passwordInput.value = window.CONFIG.friendDOB;
            loginError.classList.remove('active');
        });
    }
}

/**
 * Smooth Scroll Button for Stage 2
 */
function setupScrollButtons() {
    const scrollDownBtn = document.getElementById('scrollDownToStory');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', () => {
            const storySection = document.getElementById('stage3-story');
            if (storySection) {
                storySection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/**
 * Scroll Animations using IntersectionObserver
 */
function setupScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.story-card, .section-header, .cinematic-frame-wrapper, .secret-envelope-wrapper, .balloon-cluster'
    );
    animatedElements.forEach(el => observer.observe(el));
}

