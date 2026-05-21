// ── SLIDE NAVIGATION ──────────────────────────────────────────
const slides = document.querySelectorAll('.slide');
let current = 0;

function buildDots() {
    const dotsContainer = document.getElementById('dots');
    slides.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.className = 'dot' + (i === 0 ? ' active' : '');
        btn.onclick = () => goTo(i);
        dotsContainer.appendChild(btn);
    });
}

function goTo(n) {
    slides[current].classList.remove('active');
    current = Math.max(0, Math.min(n, slides.length - 1));
    slides[current].classList.add('active');

    document.querySelectorAll('.dot').forEach((d, i) =>
        d.classList.toggle('active', i === current)
    );
    document.getElementById('counter').textContent = (current + 1) + ' / ' + slides.length;
    document.getElementById('progress').style.width = ((current + 1) / slides.length * 100) + '%';

    // Start sensor simulation when entering slide 5 (index 4)
    if (current === 4) startSensorSim();
}

function nextSlide() { goTo(current + 1); }

function prevSlide() { goTo(current - 1); }

// Keyboard navigation
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextSlide();
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevSlide();
});


// ── SENSOR SIMULATION ─────────────────────────────────────────
let simInterval;

function startSensorSim() {
    clearInterval(simInterval);
    simulateNormal();
}

function simulateNormal() {
    document.getElementById('alert-box').style.display = 'none';
    clearInterval(simInterval);

    // Reset colors
    document.getElementById('gas-val').style.color = '#f59e0b';
    document.getElementById('temp-val').style.color = '#3b82f6';
    document.getElementById('hr-val').style.color = '#22c55e';
    document.getElementById('spo2-val').style.color = '#22c55e';
    document.getElementById('gas-bar').style.background = '#f59e0b';
    document.getElementById('temp-bar').style.background = '#3b82f6';
    document.getElementById('hr-bar').style.background = '#22c55e';
    document.getElementById('spo2-bar').style.background = '#22c55e';

    const vals = { gas: 0.3, temp: 34, hr: 78, spo2: 98 };

    simInterval = setInterval(() => {
        vals.gas = Math.max(0.1, Math.min(0.8, vals.gas + (Math.random() - 0.5) * 0.1));
        vals.temp = Math.max(30, Math.min(36, vals.temp + (Math.random() - 0.5) * 0.5));
        vals.hr = Math.max(65, Math.min(90, vals.hr + (Math.random() - 0.5) * 3));
        vals.spo2 = Math.max(96, Math.min(99, vals.spo2 + (Math.random() - 0.5) * 0.5));

        document.getElementById('gas-val').textContent = vals.gas.toFixed(1) + '%';
        document.getElementById('temp-val').textContent = vals.temp.toFixed(0) + '°C';
        document.getElementById('hr-val').textContent = vals.hr.toFixed(0) + ' BPM';
        document.getElementById('spo2-val').textContent = vals.spo2.toFixed(0) + '%';

        document.getElementById('gas-bar').style.width = (vals.gas / 2 * 100) + '%';
        document.getElementById('temp-bar').style.width = ((vals.temp - 20) / 20 * 100) + '%';
        document.getElementById('hr-bar').style.width = ((vals.hr - 40) / 100 * 100) + '%';
        document.getElementById('spo2-bar').style.width = vals.spo2 + '%';
    }, 1000);
}

function simulateDanger() {
    clearInterval(simInterval);
    let step = 0;

    simInterval = setInterval(() => {
        step++;
        const gas = Math.min(3.5, 0.3 + step * 0.25);
        const temp = Math.min(44, 34 + step * 0.8);
        const hr = Math.max(45, 78 - step * 3);
        const spo2 = Math.max(86, 98 - step * 1.2);

        document.getElementById('gas-val').textContent = gas.toFixed(1) + '%';
        document.getElementById('temp-val').textContent = temp.toFixed(0) + '°C';
        document.getElementById('hr-val').textContent = hr.toFixed(0) + ' BPM';
        document.getElementById('spo2-val').textContent = spo2.toFixed(0) + '%';

        // Dynamic color based on threshold breach
        const gasColor = gas > 1 ? '#ef4444' : '#f59e0b';
        const tempColor = temp > 38 ? '#ef4444' : '#3b82f6';
        const hrColor = hr < 50 ? '#ef4444' : '#22c55e';
        const spo2Color = spo2 < 94 ? '#ef4444' : '#22c55e';

        document.getElementById('gas-val').style.color = gasColor;
        document.getElementById('temp-val').style.color = tempColor;
        document.getElementById('hr-val').style.color = hrColor;
        document.getElementById('spo2-val').style.color = spo2Color;

        document.getElementById('gas-bar').style.width = Math.min(100, gas / 4 * 100) + '%';
        document.getElementById('gas-bar').style.background = gasColor;

        document.getElementById('temp-bar').style.width = Math.min(100, (temp - 20) / 20 * 100) + '%';
        document.getElementById('temp-bar').style.background = tempColor;

        document.getElementById('hr-bar').style.width = Math.min(100, (hr - 40) / 100 * 100) + '%';
        document.getElementById('hr-bar').style.background = hrColor;

        document.getElementById('spo2-bar').style.width = spo2 + '%';
        document.getElementById('spo2-bar').style.background = spo2Color;

        // Show alert when any threshold is breached
        if (gas > 1 || temp > 38 || hr < 50 || spo2 < 94) {
            document.getElementById('alert-box').style.display = 'flex';
        }

        if (step >= 12) clearInterval(simInterval);
    }, 500);
}


// ── INIT ──────────────────────────────────────────────────────
buildDots();
document.getElementById('progress').style.width = (1 / slides.length * 100) + '%';