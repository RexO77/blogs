import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const publicDirectory = path.resolve('public');

if (!fs.existsSync(publicDirectory)) {
    console.error('public/ does not exist. Run ./build.sh first.');
    process.exit(1);
}

function collectFiles(directory, files = []) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const filePath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            collectFiles(filePath, files);
        } else {
            files.push(filePath);
        }
    }
    return files;
}

function attributeValue(match) {
    return match[1] ?? match[2] ?? match[3] ?? '';
}

const htmlFiles = collectFiles(publicDirectory).filter((file) => file.endsWith('.html'));
const failures = [];
let structuredDataBlocks = 0;

for (const file of htmlFiles) {
    const relativeFile = path.relative(publicDirectory, file);
    const html = fs.readFileSync(file, 'utf8');
    const ids = new Set();

    for (const match of html.matchAll(/\sid=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/g)) {
        const id = attributeValue(match);
        if (ids.has(id)) failures.push(`${relativeFile}: duplicate id "${id}"`);
        ids.add(id);
    }

    for (const match of html.matchAll(/<script type=application\/ld\+json>([\s\S]*?)<\/script>/g)) {
        try {
            JSON.parse(match[1]);
            structuredDataBlocks += 1;
        } catch (error) {
            failures.push(`${relativeFile}: invalid JSON-LD (${error.message})`);
        }
    }

    for (const match of html.matchAll(/(?:href|src)=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/g)) {
        const rawValue = attributeValue(match).replaceAll('&amp;', '&');
        if (!rawValue.startsWith('/') || rawValue.startsWith('//') || rawValue.startsWith('/_vercel/')) {
            continue;
        }

        const [pathname] = rawValue.split(/[?#]/);
        const decodedPath = decodeURIComponent(pathname);
        let target = path.join(publicDirectory, decodedPath);
        if (decodedPath.endsWith('/')) target = path.join(target, 'index.html');

        if (!fs.existsSync(target)) {
            failures.push(`${relativeFile}: missing local target "${decodedPath}"`);
        }
    }

    for (const match of html.matchAll(/href=(?:"(#[^"]+)"|'(#[^']+)'|(#[^\s>]+))/g)) {
        const fragment = decodeURIComponent(attributeValue(match).slice(1));
        if (fragment && !ids.has(fragment)) {
            failures.push(`${relativeFile}: missing fragment target "#${fragment}"`);
        }
    }
}

if (failures.length > 0) {
    console.error(failures.join('\n'));
    process.exit(1);
}

console.log(`✅ HTML validation passed for ${htmlFiles.length} files and ${structuredDataBlocks} JSON-LD blocks`);
