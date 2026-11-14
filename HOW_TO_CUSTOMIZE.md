# 💖 A Beautiful Friendship – Personalization Guide

Welcome to your personalized Birthday + Friendship Website!
Every part of this website has been built to celebrate the bond between you and your best friend.

---

## 🚀 Quick Start (Opening the Website)

Simply double-click **`index.html`** in your browser (Google Chrome, Microsoft Edge, Safari, or Firefox), or serve the folder using any local server:
```bash
# Optional: Using Python
python -m http.server 8000
# Then open http://localhost:8000 in your browser
```

### Default Login Credentials
- **Username:** `sornakaa`
- **Password:** `15112005` *(Format: DDMMYYYY)*

*(You can also click the handy **"Auto-fill"** button on the login screen to test immediately!)*

---

## 🎨 How to Personalize Your Website

All configurations are centralized in a single file: **`js/config.js`**. You do **not** need to touch complex code to personalize anything!

### 1. Friend's Name & Birthday Password
Open `js/config.js` in any text editor (Notepad, VS Code, etc.):
```javascript
// Change "Bestie" to your friend's real first name or nickname:
friendName: "Pooja",

// Change to your name (used for letter signature):
yourName: "Alex",

// Change to her actual Date of Birth in DDMMYYYY format:
// For example: 25th of October 2001 -> "25102001"
friendDOB: "25102001",
```
> **Note:** The username is case-insensitive, and the password must match the 8 digits of her birth date.

---

### 2. Replacing the 10 Friendship Photos
Place your 10 photos into the **`images/`** folder:
- Name them `photo1.jpg`, `photo2.jpg`, ... up to `photo10.jpg`.
- **Any photo dimensions or orientations** (portrait, landscape, square) are supported:
  - In the gallery grid, they automatically fit with `object-fit: cover`.
  - In the full-size lightbox, the entire original image is preserved with `object-fit: contain` without cropping or stretching!

To customize the titles or quotes, edit the list in `js/config.js`:
```javascript
gallery: [
    {
        id: 1,
        title: "A Beautiful Beginning",
        quote: "Some people make ordinary moments feel extraordinary.",
        image: "images/photo1.jpg"
    },
    ...
]
```

---

### 3. Adding Your Friendship Video
Place your edited video inside the **`videos/`** folder:
- File name: **`friendship-video.mp4`**
- File format: Standard MP4 video (H.264 / AAC).
- The player features custom cinematic controls (Play/Pause, Scrubbing timeline bar, Volume slider, Mute, and Fullscreen).
- *(If the video file is not added yet, the website automatically plays an animated "Memory Reel" slideshow fallback so the frame is never broken!)*

---

### 4. Writing Your Secret Letter
In `js/config.js`, find the `secretLetter` section and write your heartfelt letter:
```javascript
secretLetter: `Dear Pooja,

Happy Birthday to the most amazing, chaotic, and wonderful best friend in the entire universe!

I still remember when we first started talking—I never imagined that an unexpected friendship would become the most important part of my life. From our endless 2 AM conversations and silly arguments over who is more dramatic, to always having each other's back whenever things get tough...

Thank you for being genuinely you. No matter where life takes us, you'll always have a best friend in me.

Always by your side,
Alex`
```
When your friend taps the envelope on Stage 6:
- The envelope flap folds open in 3D.
- The wax seal breaks.
- The letter parchment smoothly slides out.
- Your personal letter types out character-by-character with a blinking cursor!
- She can also tap **"Fast-forward text ⚡"** to read it instantly or **"Replay typing ↺"**.

---

## 📂 File Structure

```
d:\friend_birthday\
├── index.html               # Main HTML webpage with all 6 stages
├── HOW_TO_CUSTOMIZE.md      # This guide
├── css/
│   └── style.css            # Dreamy pastel styling & animations
├── js/
│   ├── config.js            # ⭐ All personal settings, letter & photo details
│   ├── main.js              # Stage transitions, login validation & navigation
│   ├── particles.js         # Floating hearts, sparkles, butterflies & confetti
│   ├── gallery.js           # 10-photo responsive grid & full-size lightbox
│   ├── player.js            # Cinematic video player & fallback reel
│   └── envelope.js          # Interactive 3D envelope & typing animation
├── images/
│   ├── friendship.png       # Boy and girl best friends hero illustration
│   ├── friendship.svg       # Crisp vector illustration fallback
│   ├── photo1.jpg .. 10.jpg # 10 friendship memory photos
│   └── video-poster.jpg     # Video cover poster
└── videos/
    └── friendship-video.mp4 # Your edited friendship video
```

---

## 💖 Made with Love for Your Best Friend
Enjoy celebrating your friendship! 🎂✨

