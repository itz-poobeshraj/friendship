/**
 * =========================================================================
 * STAGE 5 - CINEMATIC FRIENDSHIP VIDEO PLAYER
 * =========================================================================
 * Single custom-styled video player with play/pause, scrubbable progress bar,
 * volume slider, time counter, and fullscreen toggle.
 * Surrounding cinematic frame with floating hearts and sparkle accents.
 * Includes graceful memory reel fallback if the personal video is yet to be placed.
 */

class CinematicPlayer {
    constructor() {
        this.video = document.getElementById('friendshipVideo');
        this.frame = document.getElementById('cinematicFrame');
        this.playBtn = document.getElementById('videoPlayBtn');
        this.overlayPlayBtn = document.getElementById('overlayPlayBtn');
        this.progressBar = document.getElementById('videoProgressBar');
        this.progressFilled = document.getElementById('videoProgressFilled');
        this.timeDisplay = document.getElementById('videoTimeDisplay');
        this.volumeBtn = document.getElementById('videoVolumeBtn');
        this.volumeSlider = document.getElementById('videoVolumeSlider');
        this.fullscreenBtn = document.getElementById('videoFullscreenBtn');
        this.captionEl = document.getElementById('videoCaptionText');

        this.isScrubbing = false;
        this.fallbackCanvas = document.getElementById('videoFallbackCanvas');
        this.fallbackActive = false;

        this.init();
    }

    init() {
        if (!this.video) return;

        // Set caption from config
        if (this.captionEl && window.CONFIG && window.CONFIG.videoCaption) {
            this.captionEl.textContent = window.CONFIG.videoCaption;
        }

        // Set video source and poster from config
        if (window.CONFIG) {
            if (window.CONFIG.videoPoster) {
                this.video.poster = window.CONFIG.videoPoster;
            }
            if (window.CONFIG.videoSrc) {
                this.video.src = window.CONFIG.videoSrc;
            }
        }

        this.bindEvents();
        this.setupFallback();
    }

    bindEvents() {
        // Toggle play/pause
        const togglePlay = () => this.togglePlay();
        if (this.playBtn) this.playBtn.addEventListener('click', togglePlay);
        if (this.overlayPlayBtn) this.overlayPlayBtn.addEventListener('click', togglePlay);
        this.video.addEventListener('click', togglePlay);

        // Update progress & time
        this.video.addEventListener('timeupdate', () => this.handleTimeUpdate());
        this.video.addEventListener('loadedmetadata', () => this.handleTimeUpdate());
        this.video.addEventListener('ended', () => {
            this.updatePlayState(false);
        });

        // Scrubbing progress bar
        if (this.progressBar) {
            this.progressBar.addEventListener('mousedown', (e) => {
                this.isScrubbing = true;
                this.scrub(e);
            });
            window.addEventListener('mousemove', (e) => {
                if (this.isScrubbing) this.scrub(e);
            });
            window.addEventListener('mouseup', () => {
                this.isScrubbing = false;
            });

            // Touch events for mobile progress bar
            this.progressBar.addEventListener('touchstart', (e) => {
                this.isScrubbing = true;
                this.scrub(e.touches[0]);
            }, { passive: true });
            window.addEventListener('touchmove', (e) => {
                if (this.isScrubbing && e.touches.length > 0) {
                    this.scrub(e.touches[0]);
                }
            }, { passive: true });
            window.addEventListener('touchend', () => {
                this.isScrubbing = false;
            });
        }

        // Volume controls
        if (this.volumeBtn) {
            this.volumeBtn.addEventListener('click', () => {
                this.video.muted = !this.video.muted;
                this.updateVolumeUI();
            });
        }

        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', (e) => {
                this.video.volume = parseFloat(e.target.value);
                this.video.muted = (this.video.volume === 0);
                this.updateVolumeUI();
            });
        }

        // Fullscreen
        if (this.fullscreenBtn) {
            this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        // Error handling / Fallback detection
        this.video.addEventListener('error', () => {
            this.startFallbackReel();
        });
    }

    togglePlay() {
        if (this.fallbackActive) {
            this.toggleFallbackPlay();
            return;
        }

        if (this.video.paused || this.video.ended) {
            const playPromise = this.video.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.updatePlayState(true);
                }).catch(() => {
                    // Fallback to animated slideshow if browser prevents video or file missing
                    this.startFallbackReel();
                });
            }
        } else {
            this.video.pause();
            this.updatePlayState(false);
        }
    }

    updatePlayState(isPlaying) {
        if (isPlaying) {
            this.frame.classList.add('is-playing');
            if (this.playBtn) {
                this.playBtn.innerHTML = `
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                `;
            }
        } else {
            this.frame.classList.remove('is-playing');
            if (this.playBtn) {
                this.playBtn.innerHTML = `
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21"></polygon>
                    </svg>
                `;
            }
        }
    }

    handleTimeUpdate() {
        if (this.isScrubbing) return;
        const cur = this.video.currentTime || 0;
        const dur = this.video.duration || 0;
        const pct = dur > 0 ? (cur / dur) * 100 : 0;

        if (this.progressFilled) {
            this.progressFilled.style.width = `${pct}%`;
        }

        if (this.timeDisplay) {
            this.timeDisplay.textContent = `${this.formatTime(cur)} / ${this.formatTime(dur)}`;
        }
    }

    scrub(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

        if (this.video.duration) {
            this.video.currentTime = pos * this.video.duration;
            this.progressFilled.style.width = `${pos * 100}%`;
        }
    }

    formatTime(sec) {
        if (isNaN(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    updateVolumeUI() {
        if (!this.volumeBtn) return;
        if (this.video.muted || this.video.volume === 0) {
            this.volumeBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0a7 7 0 0 1-.11 1.23"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
            `;
            if (this.volumeSlider) this.volumeSlider.value = 0;
        } else {
            this.volumeBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
            `;
            if (this.volumeSlider) this.volumeSlider.value = this.video.volume;
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            if (this.frame.requestFullscreen) {
                this.frame.requestFullscreen();
            } else if (this.frame.webkitRequestFullscreen) {
                this.frame.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Graceful memory slideshow fallback if local video file has not yet been placed
    setupFallback() {
        if (!this.fallbackCanvas) return;
        this.fCtx = this.fallbackCanvas.getContext('2d');
        this.fSlideIndex = 0;
        this.fIsPlaying = false;
        this.fProgress = 0;
        this.fSlides = window.CONFIG && window.CONFIG.gallery ? window.CONFIG.gallery : [];
    }

    startFallbackReel() {
        this.fallbackActive = true;
        if (!this.fallbackCanvas) return;
        this.fallbackCanvas.style.display = 'block';
        this.video.style.opacity = '0';
        this.fallbackCanvas.width = 960;
        this.fallbackCanvas.height = 540;
        this.toggleFallbackPlay();
    }

    toggleFallbackPlay() {
        this.fIsPlaying = !this.fIsPlaying;
        this.updatePlayState(this.fIsPlaying);

        if (this.fIsPlaying) {
            this.runFallbackLoop();
        }
    }

    runFallbackLoop() {
        if (!this.fIsPlaying || !this.fallbackCanvas) return;

        this.fProgress += 0.005;
        if (this.fProgress >= 1) {
            this.fProgress = 0;
            this.fSlideIndex = (this.fSlideIndex + 1) % (this.fSlides.length || 1);
        }

        const ctx = this.fCtx;
        const w = this.fallbackCanvas.width;
        const h = this.fallbackCanvas.height;

        // Background dreamy gradient
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#2D1B4E');
        grad.addColorStop(1, '#1A0E2E');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Slide info
        const curSlide = this.fSlides[this.fSlideIndex] || { title: "Our Friendship", quote: "Memories that last forever" };
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(curSlide.title, w / 2, h / 2 - 20);

        ctx.fillStyle = '#FFB6C1';
        ctx.font = 'italic 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`“${curSlide.quote}”`, w / 2, h / 2 + 25);

        ctx.fillStyle = '#A090C0';
        ctx.font = '14px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Friendship Video Preview • Drop friendship-video.mp4 in videos/ to play your clip', w / 2, h - 35);

        // Update progress bar
        if (this.progressFilled) {
            const overallPct = ((this.fSlideIndex + this.fProgress) / this.fSlides.length) * 100;
            this.progressFilled.style.width = `${overallPct}%`;
        }

        requestAnimationFrame(() => this.runFallbackLoop());
    }
}

window.CinematicPlayer = CinematicPlayer;

