let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let image = new Image();
let originalDataUrl = "";
let currentQuality = 1;

document.getElementById('image-upload').addEventListener('change', async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "image/heic" || file.name.endsWith(".heic")) {
        const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
        loadImageBlob(convertedBlob);
    } else {
        loadImageBlob(file);
    }
});

function loadImageBlob(blob) {
    const reader = new FileReader();
    reader.onload = function (event) {
        image.onload = function () {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            canvas.classList.remove('hidden');
            document.getElementById('resize-controls').classList.remove('hidden');
            document.getElementById('crop-controls').classList.remove('hidden');
            document.getElementById('download-btn').classList.remove('hidden');
            document.getElementById('crop-x').value = 0;
            document.getElementById('crop-y').value = 0;
            document.getElementById('crop-width').value = image.width;
            document.getElementById('crop-height').value = image.height;
            originalDataUrl = event.target.result;
        };
        image.src = URL.createObjectURL(blob);
    };
    reader.readAsDataURL(blob);
}

document.getElementById('quality-range').addEventListener('input', function (e) {
    document.getElementById('quality-value').textContent = `${e.target.value}%`;
    currentQuality = e.target.value / 100;
});

function resizeImage() {
    const tempImage = new Image();
    tempImage.onload = function () {
        canvas.width = tempImage.width;
        canvas.height = tempImage.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempImage, 0, 0);
    };
    tempImage.src = canvas.toDataURL('image/jpeg', currentQuality);
}

function cropImage() {
    const x = parseInt(document.getElementById('crop-x').value);
    const y = parseInt(document.getElementById('crop-y').value);
    const w = parseInt(document.getElementById('crop-width').value);
    const h = parseInt(document.getElementById('crop-height').value);

    const croppedData = ctx.getImageData(x, y, w, h);

    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(croppedData, 0, 0);
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'edited-image.jpg';
    link.href = canvas.toDataURL('image/jpeg', currentQuality);
    link.click();
}
