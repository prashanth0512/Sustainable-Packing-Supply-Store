const fs = require('fs');
const path = require('path');
const rootDir = 'c:\\Users\\DELL\\Desktop\\sustainable-packaging-business';
const htmlDir = path.join(rootDir, 'html');
const navDir = path.join(rootDir, 'navigation');
const jsDir = path.join(rootDir, 'js');

function fixSVGs(directory) {
    if (!fs.existsSync(directory)) return;
    const files = fs.readdirSync(directory);
    files.forEach(file => {
        const filePath = path.join(directory, file);
        if (fs.lstatSync(filePath).isDirectory()) {
            fixSVGs(filePath);
            return;
        }
        if (file.endsWith('.html') || file.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let changed = false;

            const newSVG = '<svg width="$1" height="$2" viewBox="-2 -2 36 40" fill="none" style="overflow: visible;">';
            const regex = /<svg width="(\d+)" height="(\d+)" viewBox="[^"]*" fill="none"( style="overflow: visible;")?>/g;
            
            if (content.includes('M16 2L4 8v8')) {
                content = content.replace(regex, (match, w, h) => {
                    if (w >= 28 && w <= 32) {
                        changed = true;
                        return `<svg width="${w}" height="${h}" viewBox="-2 -2 36 40" fill="none" style="overflow: visible;">`;
                    }
                    return match;
                });
            }

            if (changed) {
                fs.writeFileSync(filePath, content);
                console.log(`Updated SVGs in ${file}`);
            }
        }
    });
}
fixSVGs(rootDir);
console.log('Successfully refined all logo SVGs.');
