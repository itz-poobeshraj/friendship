/**
 * =========================================================================
 * STAGE 6 - INTERACTIVE ENVELOPE & SECRET MESSAGE TYPING EFFECT
 * =========================================================================
 * Features a 3D animated envelope that unfolds its flap when clicked.
 * The letter parchment slides out and types out character by character.
 * Supports "Skip Typing" and "Replay" for maximum reading comfort.
 * Content is pulled from CONFIG.secretLetter (clearly marked placeholder).
 */

class SecretEnvelope {
    constructor() {
        this.envelopeContainer = document.getElementById('secretEnvelopeContainer');
        this.envelope = document.getElementById('interactiveEnvelope');
        this.seal = document.getElementById('envelopeSeal');
        this.letterPaper = document.getElementById('letterPaper');
        this.typedContent = document.getElementById('letterTypedContent');
        this.typingCursor = document.getElementById('typingCursor');
        this.skipBtn = document.getElementById('letterSkipBtn');
        this.replayBtn = document.getElementById('letterReplayBtn');
        this.hintText = document.getElementById('envelopeHint');

        this.isOpen = false;
        this.isTyping = false;
        this.typewriterTimeout = null;
        this.currentCharIndex = 0;
        
        // Load text and gracefully substitute name placeholders
        let rawText = (window.CONFIG && window.CONFIG.secretLetter) ? window.CONFIG.secretLetter : "";
        if (window.CONFIG && window.CONFIG.friendName) {
            rawText = rawText.replace(/\[FRIEND'S NAME\]/gi, window.CONFIG.friendName);
            rawText = rawText.replace(/\[Friend's Name\]/g, window.CONFIG.friendName);
        }
        if (window.CONFIG && window.CONFIG.yourName) {
            rawText = rawText.replace(/\[YOUR NAME\]/gi, window.CONFIG.yourName);
            rawText = rawText.replace(/\[Your Name\]/g, window.CONFIG.yourName);
        }
        this.fullText = rawText;

        this.init();
    }

    init() {
        if (!this.envelope) return;
        this.bindEvents();
    }

    bindEvents() {
        // Open envelope on click
        const triggerOpen = () => {
            if (!this.isOpen) {
                this.openEnvelope();
            }
        };

        this.envelope.addEventListener('click', triggerOpen);
        if (this.seal) this.seal.addEventListener('click', triggerOpen);

        // Skip typing button
        if (this.skipBtn) {
            this.skipBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.skipTyping();
            });
        }

        // Replay button
        if (this.replayBtn) {
            this.replayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.startTyping(true);
            });
        }
    }

    openEnvelope() {
        this.isOpen = true;
        this.envelopeContainer.classList.add('is-opened');
        this.envelope.classList.add('is-opened');

        if (this.hintText) {
            this.hintText.textContent = "Unfolding your heartfelt letter... ♡";
        }

        // Trigger celebratory confetti burst
        if (window.confetti) {
            const rect = this.envelope.getBoundingClientRect();
            window.confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);
        }

        // Delay typewriter until envelope flap animation finishes
        setTimeout(() => {
            this.startTyping(false);
            if (this.hintText) {
                this.hintText.style.opacity = '0';
            }
        }, 850);
    }

    startTyping(forceReset = false) {
        if (this.typewriterTimeout) {
            clearTimeout(this.typewriterTimeout);
        }

        this.isTyping = true;
        this.currentCharIndex = 0;
        this.typedContent.innerHTML = '';
        if (this.typingCursor) this.typingCursor.style.display = 'inline-block';
        if (this.skipBtn) this.skipBtn.style.display = 'inline-flex';
        if (this.replayBtn) this.replayBtn.style.display = 'none';

        this.typeNextChar();
    }

    typeNextChar() {
        if (!this.isTyping) return;

        if (this.currentCharIndex < this.fullText.length) {
            const char = this.fullText.charAt(this.currentCharIndex);
            
            if (char === '\n') {
                this.typedContent.innerHTML += '<br>';
            } else {
                // Escape HTML characters
                const safeChar = char === '<' ? '&lt;' : char === '>' ? '&gt;' : char;
                this.typedContent.innerHTML += safeChar;
            }

            this.currentCharIndex++;

            // Natural typing cadence (optimized for comfortable reading speed)
            let speed = 12;
            if (char === '.' || char === '!' || char === '?') {
                speed = 60;
            } else if (char === ',' || char === ';') {
                speed = 35;
            }

            this.typewriterTimeout = setTimeout(() => this.typeNextChar(), speed);
        } else {
            this.finishTyping();
        }
    }

    skipTyping() {
        if (this.typewriterTimeout) {
            clearTimeout(this.typewriterTimeout);
        }
        this.isTyping = false;
        // Format full text with line breaks
        const formatted = this.fullText.replace(/\n/g, '<br>');
        this.typedContent.innerHTML = formatted;
        this.finishTyping();
    }

    finishTyping() {
        this.isTyping = false;
        if (this.typingCursor) this.typingCursor.style.display = 'none';
        if (this.skipBtn) this.skipBtn.style.display = 'none';
        if (this.replayBtn) this.replayBtn.style.display = 'inline-flex';

        // Floating hearts burst around letter completion
        if (window.confetti) {
            const rect = this.letterPaper.getBoundingClientRect();
            window.confetti.burst(rect.left + rect.width / 2, rect.top + 80, 50);
        }
    }
}

window.SecretEnvelope = SecretEnvelope;

