const lengthInput = document.getElementById('length');
const lengthDisplay = document.getElementById('length-display');
const passwordDisplay = document.getElementById('password');
const resultBox = document.getElementById('result');

// Small dictionary of meaningful words
const words = [
    "Swift", "Power", "Dream", "Happy", "Magic", "Smart",
    "Quick", "Sharp", "Light", "Brave", "Fresh", "Shine",
    "Glory", "Flame", "Chase", "Rise", "Storm", "Vivid", "Caste",
    "Roti", "Pen", "Money", "Sun", "Rain", "Sad", "Weight", "Lion",
    "Cat", "Load", "Sign", "Lake", "Army", "Book", "File", "Size",
    "Open", "road", "Bride", "Crime", "Minor", "Fight", "Steel", 
    "Smell", "Clean", "Valid", "Movie", "Flood", "Food", "Court",
    "Trust", "Dress", "Spend", "Ball", "Pen", "Key", "Cow", "Get",
    "Pin", "Row", "Lip", "Hot", "Boy", "Girl", "Car", "Bike", "Train",
    "Metro", "Bank", "Fan", "Water", "Clock", "Page", "Mobile", 
    "Cable", "Bag", "Day", "Night", "Purse", "Bra", "Sex", "Boobs",
    "To", "Do", "One", "Two", "Three", "Four", "Five", "Six", "Of",
    "Nine", "Seven", "Zero"
];

const symbols = "@#$%&*?";

lengthInput.addEventListener('input', () => {
    lengthDisplay.textContent = lengthInput.value;
});

function generatePassword() {
    const length = parseInt(lengthInput.value);

    let word = words[Math.floor(Math.random() * words.length)];
    let symbol = symbols[Math.floor(Math.random() * symbols.length)];
    
    // Calculate how many digits needed based on selected length
    let digitsLength = length - word.length - 1; // 1 symbol
    if (digitsLength < 1) {
        alert("Increase password length for better results!");
        return;
    }

    let digits = "";
    for (let i = 0; i < digitsLength; i++) {
        digits += Math.floor(Math.random() * 10); // random 0-9
    }

    const password = word + symbol + digits;

    passwordDisplay.textContent = password;
    resultBox.classList.remove('hidden');
}

function copyPassword() {
    const text = passwordDisplay.textContent;
    navigator.clipboard.writeText(text);
    const btn = document.getElementById('copy-btn');
    btn.textContent = "✅";
    setTimeout(() => {
        btn.textContent = "📋";
    }, 1000);
}
