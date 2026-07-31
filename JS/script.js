// --- LOGO INTERACTION LOGIC (RELOAD PAGE) ---

const logo = document.getElementById('logo');

logo.addEventListener('click', () => {
    window.location.reload();
});

// --- DROPDOWN LOGIC ---
const dropdowns = document.querySelectorAll('.dropdown-btn');

dropdowns.forEach(btn => {
    btn.addEventListener('click', function () {
        this.classList.toggle('active-dropdown');
        const dropdownContent = this.nextElementSibling;
        const arrow = this.querySelector('.arrow');

        if (dropdownContent.style.display === "flex") {
            dropdownContent.style.display = "none";
            arrow.style.rotate = "0deg";
        } else {
            dropdownContent.style.display = "flex";
            arrow.style.rotate = "180deg";
        }
    });
});

// --- POEM & IMAGE LOADING LOGIC ---
const poemDisplay = document.getElementById('poem-display');
const poemImage = document.getElementById('poem-image');
const links = document.querySelectorAll('.poem-link');

async function loadPoem(filename, imagename) {
    try {
        poemDisplay.textContent = "Loading...";
        poemDisplay.style.color = "#505050"

        // 1. Always hide the image initially to prevent a flash of a broken icon
        poemImage.style.display = "none";

        // 2. Clear the old source
        poemImage.src = "";

        if (imagename) {
            // Set up what happens when the image finishes loading
            poemImage.onload = function () {
                poemImage.style.display = "block";
            };

            // Set up what happens if the image fails (e.g., file doesn't exist)
            poemImage.onerror = function () {
                poemImage.style.display = "none";
            };

            // Finally, assign the source to trigger the load/error events above
            poemImage.src = imagename;
        }

        // 3. Fetch the text file
        const response = await fetch(filename);
        if (!response.ok) throw new Error("Could not find the poem text file.");

        const text = await response.text();
        poemDisplay.textContent = text;
        poemDisplay.style.color = ""

    } catch (error) {
        poemDisplay.textContent = "Error: " + error.message;
        poemDisplay.style.color = "#505050"
    }
}

// --- LINK CLICK LOGIC ---
links.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        links.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        const targetPoem = "/Poems/" + encodeURIComponent(this.parentElement.id) + "/" + encodeURIComponent(this.textContent) + ".txt";
        const targetImage = "/Poems/" + encodeURIComponent(this.parentElement.id) + "/" + encodeURIComponent(this.textContent) + ".jpeg";
        loadPoem(targetPoem, targetImage);
    });
});

// --- THEME BUTTON LOGIC ---
const themeBtn = document.querySelector('.btn-theme');
const theme = document.getElementById('theme');

// 1. Check local storage when the page loads
const currentTheme = localStorage.getItem('preferred-theme');

if (currentTheme === 'dark') {
    // Apply dark mode if it was previously saved
    theme.setAttribute('href', 'styles-dark.css');
    themeBtn.setAttribute('src', 'btn-lightmode.svg');
} else {
    // Default to light mode
    theme.setAttribute('href', 'styles.css');
    themeBtn.setAttribute('src', 'btn-darkmode.svg');
}

// 2. Update the click listener to save the preference
themeBtn.addEventListener('click', () => {
    if (theme.getAttribute('href') === 'styles.css') {
        // Switch to Dark Mode
        theme.setAttribute('href', 'styles-dark.css');
        themeBtn.setAttribute('src', 'btn-lightmode.svg'); 
        
        // Save preference to local storage
        localStorage.setItem('preferred-theme', 'dark');
    } else {
        // Switch back to Light Mode
        theme.setAttribute('href', 'styles.css');
        themeBtn.setAttribute('src', 'btn-darkmode.svg');
        
        // Save preference to local storage
        localStorage.setItem('preferred-theme', 'light');
    }
});