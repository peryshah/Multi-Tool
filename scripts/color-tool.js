const colorInput = document.getElementById('color-input');
const selectedColorText = document.getElementById('selected-color');
const paletteContainer = document.getElementById('palette-container');

colorInput.addEventListener('input', () => {
    selectedColorText.textContent = colorInput.value.toUpperCase();
});

function generatePalette() {
    const baseColor = hexToHSL(colorInput.value);
    paletteContainer.innerHTML = "";

    for (let i = -40; i <= 40; i += 20) {
        let lightness = Math.min(100, Math.max(0, baseColor.l + i));
        const shade = `hsl(${baseColor.h}, ${baseColor.s}%, ${lightness}%)`;
        const hex = hslToHex(baseColor.h, baseColor.s, lightness);
        const div = document.createElement('div');
        div.className = "color-box";
        div.style.background = hex;
        div.innerHTML = `<span>${hex}</span><span>📋</span>`;
        div.onclick = () => {
            navigator.clipboard.writeText(hex);
            div.querySelector('span:last-child').textContent = "✅";
            setTimeout(() => div.querySelector('span:last-child').textContent = "📋", 1000);
        };
        paletteContainer.appendChild(div);
    }
}

function hexToHSL(H) {
    let r = 0, g = 0, b = 0;
    if (H.length === 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    r /= 255;
    g /= 255;
    b /= 255;
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h = 0, s = 0, l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    return { h: h, s: +(s * 100).toFixed(1), l: +(l * 100).toFixed(1) };
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
        Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));

    return `#${[f(0), f(8), f(4)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('')}`.toUpperCase();
}
