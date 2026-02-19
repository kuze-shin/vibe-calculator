const out = document.getElementById('out');
const songTitle = document.getElementById('songTitle');
const playBtn = document.getElementById('playBtn');
const viz = document.getElementById('viz');

/* ---------------- CONVERTER ---------------- */

const modes = [
    "Calculator",
    "Meters ➝ Feet",
    "Kg ➝ Lbs",
    "°C ➝ °F"
];

let currentMode = 0;

function handleClick(e) {
    if (e.target.tagName !== 'BUTTON') return;
    const val = e.target.innerText;
    val === '⇄' ? toggleMode() : input(val);
}

function toggleMode() {
    beep();
    currentMode = (currentMode + 1) % modes.length;
    out.value = '';
    out.placeholder = modes[currentMode];
}

function input(v) {
    beep();

    if (v === 'AC') return out.value = '';
    if (v === 'DEL') return out.value = out.value.slice(0, -1);

    if (v === '=') {
        if (!out.value) return;

        if (currentMode === 0) {
            try { out.value = eval(out.value) || ''; }
            catch { out.value = 'Error'; }
            return;
        }

        const num = parseFloat(out.value);
        if (isNaN(num)) return out.value = "Error";

        const conversions = [
            () => num * 3.28084 + " ft",
            () => num * 2.20462 + " lbs",
            () => (num * 9/5 + 32) + " °F"
        ];

        out.value = conversions[currentMode - 1]().toFixed(2);
        return;
    }

    if (currentMode !== 0 && isNaN(v) && v !== '.') return;
    out.value += v;
}

/* ---------------- MUSIC ---------------- */

const songs = [
    { title: "Blue - Yung Kai", src: "blue.mp3" },
    { title: "Kalapastangan - fitterkarma", src: "kalapastangan.mp3" },
    { title: "Pag-Ibig ay Kanibalismo II - fitterkarma", src: "kanibalismo.mp3" }
];

let songIndex = 0;
const audio = new Audio(songs[0].src);

audio.addEventListener('ended', () => changeSong(1, true));

function togglePlay() {
    if (audio.paused) {
        audio.play().catch(() => alert("File not found!"));
        viz.classList.remove('paused');
        playBtn.innerText = "⏸";
    } else {
        audio.pause();
        viz.classList.add('paused');
        playBtn.innerText = "▶";
    }
}

function changeSong(dir, force = false) {
    const shouldPlay = !audio.paused || force;

    songIndex = (songIndex + dir + songs.length) % songs.length;
    audio.src = songs[songIndex].src;
    songTitle.innerText = songs[songIndex].title;

    if (shouldPlay) {
        audio.play();
        viz.classList.remove('paused');
        playBtn.innerText = "⏸";
    } else {
        viz.classList.add('paused');
        playBtn.innerText = "▶";
    }
}

/* ---------------- SYSTEM ---------------- */

function theme() {
    beep();
    document.body.dataset.theme =
        document.body.dataset.theme === 'light' ? 'dark' : 'light';
}

function beep() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.connect(g);
    g.connect(ctx.destination);

    o.frequency.value = 600;
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);

    o.start();
    o.stop(ctx.currentTime + 0.1);
}

document.onkeydown = e => {
    if ("0123456789.+-*/".includes(e.key)) input(e.key);
    if (e.key === "Enter") input("=");
    if (e.key === "Backspace") input("DEL");
};
