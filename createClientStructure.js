// createClientStructure.js
// Run this script from the client folder to create the mirror structure.
// Usage: node createClientStructure.js

const fs = require('fs').promises;
const path = require('path');

const files = [
  ".gitignore",
  "eslint.config.js",
  "index.html",
  "package.json",
  "README.md",
  "vite.config.js",
  "public/.gitkeep",
  "src/App.jsx",
  "src/index.css",
  "src/main.jsx",
  "src/assets/assets.js",
  "src/assets/rich-text-css.txt",
  "src/components/BlogCard.jsx",
  "src/components/BlogList.jsx",
  "src/components/Footer.jsx",
  "src/components/Header.jsx",
  "src/components/Loader.jsx",
  "src/components/Navbar.jsx",
  "src/components/NewsLetter.jsx",
  "src/components/admin/BlogTableItem.jsx",
  "src/components/admin/CommentTableItem.jsx",
  "src/components/admin/Login.jsx",
  "src/components/admin/Sidebar.jsx",
  "src/pages/Blog.jsx",
  "src/pages/Home.jsx",
  "src/pages/admin/AddBlog.jsx",
  "src/pages/admin/Comments.jsx",
  "src/pages/admin/Dasboard.jsx",
  "src/pages/admin/Layout.jsx",
  "src/pages/admin/ListBlog.jsx"
];

async function ensureFile(filePath) {
  const fullPath = path.resolve(process.cwd(), filePath);
  const dir = path.dirname(fullPath);
  try {
    await fs.mkdir(dir, { recursive: true });
    // Use 'wx' to avoid overwriting existing files
    const placeholder = generatePlaceholder(filePath);
    await fs.writeFile(fullPath, placeholder, { flag: 'wx' });
    console.log('Created:', filePath);
  } catch (err) {
    if (err.code === 'EEXIST' || err.code === 'EISDIR') {
      console.log('Skipped (exists):', filePath);
    } else {
      console.error('Error creating', filePath, err.message);
    }
  }
}

function generatePlaceholder(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.jsx') {
    return `import React from 'react';

export default function ${componentName(filePath)}() {
  return (
    <div>${componentName(filePath)} placeholder</div>
  );
}
`;
  }
  if (ext === '.css' || ext === '.txt') {
    return `/* ${filePath} - placeholder */\n`;
  }
  if (path.basename(filePath) === 'index.html') {
    return `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>QuickBlog</title></head>
  <body><div id="root"></div></body>
</html>
`;
  }
  if (ext === '.json' || path.basename(filePath) === 'package.json') {
    return `{\n  "name": "quickblog-client",\n  "version": "0.0.0"\n}\n`;
  }
  return `// ${filePath} - placeholder\n`;
}

function componentName(filePath) {
  const name = path.basename(filePath, path.extname(filePath));
  // Simple PascalCase
  return name.replace(/(^|-|_)([a-z])/g, (_, __, c) => c.toUpperCase());
}

(async () => {
  for (const f of files) {
    // skip creating dotfiles that might already exist in project root if desired
    await ensureFile(f);
  }
  console.log('Structure creation finished.');
})();