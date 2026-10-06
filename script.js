// ---------- Floating hearts ----------
const container = document.getElementById('hearts-container');
const heartSymbols = ['💗', '💕', '💖', '❤️', '💓'];
let heartInterval = null;

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

    const startX = Math.random() * window.innerWidth;
    const drift = (Math.random() - 0.5) * 200;
    const duration = 6 + Math.random() * 6;
    const size = 12 + Math.random() * 16;

    heart.style.left = `${startX}px`;
    heart.style.fontSize = `${size}px`;
    heart.style.setProperty('--drift', `${drift}px`);
    heart.style.animationDuration = `${duration}s`;

    container.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000);
}

function startHearts() {
    if (!heartInterval) {
        heartInterval = setInterval(createHeart, 400);
    }
}

function stopHearts() {
    clearInterval(heartInterval);
    heartInterval = null;
    container.innerHTML = '';
}

// ---------- Loading screen ----------
window.addEventListener('load', () => {
    const doneBtn = document.getElementById('doneBtn');

    // Simulate "unwrapping" for a couple seconds, then reveal the button
    setTimeout(() => {
        doneBtn.classList.remove('hidden');
        doneBtn.classList.add('show');
    }, 2500); // adjust delay as you like
});

document.getElementById('doneBtn').addEventListener('click', () => {
    bgMusic.play();
    document.getElementById('musicToggle').classList.add('playing'); // ← add this line

    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.classList.add('fade-out');
    setTimeout(() => loadingScreen.remove(), 600);
});

// ---------- Screen switching ----------
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });

    const target = document.getElementById(id);
    target.classList.remove('hidden');

    startHearts();

    if (id === 'screen2') {
        target.scrollTop = 0;
        target.querySelectorAll('.fixed-btn').forEach(btn => btn.classList.remove('visible'));
        animateCounter('dayCounter', 393, 3000);
    }

    if (id === 'screenWishes') {
        target.scrollTop = 0;
        target.classList.remove('play');
        void target.offsetWidth; // restart the animation each visit
        target.classList.add('play');
    }
}

// ---------- Day counter ----------
function animateCounter(id, target, duration) {
    const el = document.getElementById(id);
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - (1 - progress) * (1 - progress);
        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

// ---------- Polaroid reveal ----------
function initPolaroidObserver() {
    const polaroids = document.querySelectorAll('.polaroid');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
        });
    }, {
        root: document.getElementById('screen2'),
        threshold: 0.2
    });

    polaroids.forEach(p => observer.observe(p));
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
    // Back/Next buttons on screen2 appear near the bottom
    const screen2 = document.getElementById('screen2');
    const fixedButtons = screen2.querySelectorAll('.fixed-btn');
    screen2.addEventListener('scroll', () => {
        const scrolledToBottom =
            screen2.scrollTop + screen2.clientHeight >= screen2.scrollHeight - 100;
        fixedButtons.forEach(btn => btn.classList.toggle('visible', scrolledToBottom));
    });

    initPolaroidObserver();

    // Hearts start right away since screen1 is now the first screen
    startHearts();
});

const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const songTitle = "Romantic Happy Birthday - Miranda Wong";
document.getElementById('songTitle').textContent = songTitle;

musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.classList.add('playing');
    } else {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
    }
});