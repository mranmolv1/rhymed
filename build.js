const fs = require('fs');
const path = require('path');

// Define paths to your files and directories
const poemsDir = path.join(__dirname, 'Poems');
const indexPath = path.join(__dirname, 'index.html');

function generateSidebarHTML() {
    let generatedHTML = '';

    // 1. Read the 'Poems' directory and filter for folders (Years)
    if (!fs.existsSync(poemsDir)) {
        console.error("Error: 'Poems' directory not found!");
        return '';
    }
    
    const years = fs.readdirSync(poemsDir).filter(file => {
        return fs.statSync(path.join(poemsDir, file)).isDirectory();
    }).sort(); // Sorts years in ascending order

    // 2. Loop through each year folder
    years.forEach(year => {
        const yearPath = path.join(poemsDir, year);
        
        // 3. Read the contents of the year folder and filter for .txt files FIRST
        const poems = fs.readdirSync(yearPath).filter(file => file.endsWith('.txt'));

        // NEW: If there are no .txt files in this folder, skip it completely
        if (poems.length === 0) {
            return;
        }

        // If it passes the check, generate the dropdown for this year
        generatedHTML += `        <div class="dropdown-btn">${year}<span class="arrow">▼</span></div>\n`;
        generatedHTML += `        <div class="dropdown-container" id="${year}">\n`;

        // 4. Create a link for each text file
        poems.forEach(poemFile => {
            // Remove the .txt extension for the display name
            const poemName = path.basename(poemFile, '.txt');
            generatedHTML += `            <a href="#" class="poem-link">${poemName}</a>\n`;
        });

        generatedHTML += `        </div>\n\n`;
    });

    return generatedHTML;
}

function updateIndexHTML() {
    try {
        const newHTML = generateSidebarHTML();
        let indexContent = fs.readFileSync(indexPath, 'utf-8');

        // Regex to find everything between the start and end markers
        const regex = /(<!-- POEMS_START -->)[\s\S]*(<!-- POEMS_END -->)/;
        
        // Replace the content between the markers with our new HTML
        indexContent = indexContent.replace(regex, `$1\n${newHTML}        $2`);

        // Write the changes back to index.html
        fs.writeFileSync(indexPath, indexContent);
        console.log('✅ Successfully updated index.html! Empty folders were skipped.');
        
    } catch (error) {
        console.error('❌ An error occurred:', error.message);
    }
}

updateIndexHTML();