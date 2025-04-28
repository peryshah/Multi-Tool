let qr;

function generateQR() {
    const text = document.getElementById('qr-text').value.trim();
    if (text === "") {
        alert("Please enter some text or a link!");
        return;
    }

    if (!qr) {
        qr = new QRious({
            element: document.getElementById('qr-image'),
            size: 250,
            value: text
        });
    } else {
        qr.value = text;
    }

    document.getElementById('qr-result').classList.remove('hidden');
}

function downloadQR() {
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = document.getElementById('qr-image').src;
    link.click();
}
