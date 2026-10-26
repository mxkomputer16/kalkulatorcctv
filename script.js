document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Calculator
    const resolutionSelect = document.getElementById('resolution');
    const codecSelect = document.getElementById('codec');
    const modeSelect = document.getElementById('mode');
    const daysInput = document.getElementById('daysInput');
    const daysSlider = document.getElementById('daysSlider');

    const recommendedText = document.getElementById('recommendedText');
    const perDayText = document.getElementById('perDayText');
    const totalReqText = document.getElementById('totalReqText');

    // DOM Elements - Theme Toggle
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    // Load Preferensi Mode Terang/Gelap dari LocalStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    // Event Switch Theme
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');

        if (isLight) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Sync Input Number & Slider Hari
    daysInput.addEventListener('input', (e) => {
        let val = parseInt(e.target.value) || 1;
        if (val < 1) val = 1;
        daysSlider.value = Math.min(val, 30);
        calculateStorage();
    });

    daysSlider.addEventListener('input', (e) => {
        daysInput.value = e.target.value;
        calculateStorage();
    });

    // Event listeners Kalkulasi
    [resolutionSelect, codecSelect, modeSelect].forEach(element => {
        element.addEventListener('change', calculateStorage);
    });

    // Fungsi Utama Kalkulasi
    function calculateStorage() {
        const selectedOption = resolutionSelect.options[resolutionSelect.selectedIndex];
        
        const baseBitrateKbps = parseFloat(selectedOption.getAttribute('data-bitrate'));
        const codecFactor = parseFloat(codecSelect.value);
        const activeHours = parseFloat(modeSelect.value);
        const days = parseFloat(daysInput.value) || 1;

        const actualBitrateKbps = baseBitrateKbps * codecFactor;

        // Kbps -> KB/s (/8) -> MB/s (/1024) -> GB/h (*3600 / 1024)
        const gbPerHour = (actualBitrateKbps / 8 / 1024 / 1024) * 3600;

        const gbPerDay = gbPerHour * activeHours;
        const totalGbNeeded = gbPerDay * days;

        // Tentukan Rekomendasi MicroSD
        const standardSizes = [32, 64, 128, 256, 512, 1024];
        let recommendedSize = "> 1 TB (Pakai NVR + HDD)";

        for (let size of standardSizes) {
            if (size >= totalGbNeeded * 1.05) {
                recommendedSize = size + " GB";
                break;
            }
        }

        // Render Output
        perDayText.innerText = `${gbPerDay.toFixed(2)} GB`;
        totalReqText.innerText = `${totalGbNeeded.toFixed(2)} GB`;
        recommendedText.innerText = recommendedSize;
    }

    // Kalkulasi awal
    calculateStorage();
});