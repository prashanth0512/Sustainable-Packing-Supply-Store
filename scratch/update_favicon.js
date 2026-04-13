const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\DELL\\Desktop\\sustainable-packaging-business';
const htmlDir = path.join(rootDir, 'html');

function addFaviconToFiles(directory, prefix) {
    if (!fs.existsSync(directory)) return;
    const files = fs.readdirSync(directory);
    files.forEach(file => {
        if (file.endsWith('.html')) {
            const filePath = path.join(directory, file);
            let content = fs.readFileSync(filePath, 'utf8');
            if (!content.includes('favicon.svg')) {
                const favLink = `  <link rel="icon" type="image/svg+xml" href="${prefix}assets/images/favicon.svg" />\n</head>`;
                content = content.replace('</head>', favLink);
            }
            content = content.replace(/<svg width="32" height="32" viewBox="0 0 32 32" fill="none">/g, '<svg width="32" height="32" viewBox="-1 -1 34 34" fill="none" style="overflow: visible;">');
            content = content.replace(/<svg width="28" height="28" viewBox="0 0 32 32" fill="none">/g, '<svg width="28" height="28" viewBox="-1 -1 34 34" fill="none" style="overflow: visible;">');
            
            fs.writeFileSync(filePath, content);
        }
    });
}
addFaviconToFiles(htmlDir, '../');
addFaviconToFiles(rootDir, '');

console.log('Successfully updated all HTML files with favicon and logo fixes.');
