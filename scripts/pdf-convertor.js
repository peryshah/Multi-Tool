document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById(tab.dataset.tab).classList.add("active");
        });
    });

    setupConverter("word", convertPDFtoWord);
    setupConverter("excel", convertPDFtoExcel);
});

function setupConverter(type, convertFunction) {
    const dropZone = document.getElementById(`${type}-drop-zone`);
    const fileInput = document.getElementById(`${type}-file-input`);
    const fileInfo = document.getElementById(`${type}-file-info`);
    const progress = document.getElementById(`${type}-progress`);
    const button = document.getElementById(`convert-to-${type}`);

    dropZone.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;

        fileInfo.textContent = `Selected File: ${file.name}`;
        fileInfo.classList.remove("hidden");
        button.disabled = false;
    });

    button.addEventListener("click", async () => {
        const file = fileInput.files[0];
        if (!file) return;

        button.innerHTML = '<span class="spinner"></span>Processing...';
        button.disabled = true;
        progress.classList.remove("hidden");

        try {
            await convertFunction(file);
        } catch (error) {
            alert("Conversion failed: " + error.message);
        }

        button.innerHTML = `Convert to ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        button.disabled = false;
        progress.classList.add("hidden");
    });
}

async function convertPDFtoWord(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const { Document, Packer, Paragraph } = docx;
    const doc = new Document();
    const paragraphs = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        const lines = pageText.split(/(?<=\.)\s+/); // Split by sentences

        lines.forEach(line => {
            if (line.trim()) {
                paragraphs.push(new Paragraph(line.trim()));
            }
        });
    }

    doc.addSection({ properties: {}, children: paragraphs });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, file.name.replace(".pdf", ".docx"));
}

async function convertPDFtoExcel(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const sheetData = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const rawText = textContent.items.map(item => item.str).join(" ");
        const lines = rawText.split(/\r?\n|(?<=\.)\s+/); // Try splitting smartly

        sheetData.push([`Page ${i}`]);
        lines.forEach(line => {
            if (line.trim()) sheetData.push([line.trim()]);
        });
        sheetData.push([""]);
    }

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, sheet, "PDF Content");

    const excelBlob = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBlob]), file.name.replace(".pdf", ".xlsx"));
}
