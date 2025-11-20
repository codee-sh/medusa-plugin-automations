#!/usr/bin/env node

/**
 * Watch script for .tsx files in templates directory
 * Automatically rebuilds and publishes to yalc when .tsx files change
 * 
 * Run this in parallel with `npm run dev`:
 * npm run dev & npm run watch:tsx
 */

import chokidar from 'chokidar';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

let isBuilding = false;
let buildTimeout = null;

function buildAndPublish() {
  if (isBuilding) {
    return; // Skip if already building
  }

  isBuilding = true;
  console.log('🔨 Building plugin...');

  execAsync('npm run build', { cwd: projectRoot })
    .then(({ stdout, stderr }) => {
      if (stdout) console.log(stdout);
      if (stderr && !stderr.includes('warning')) console.error(stderr);

      console.log('📦 Publishing to yalc...');
      return execAsync('npm run publish-local', { cwd: projectRoot });
    })
    .then(({ stdout, stderr }) => {
      isBuilding = false;
      if (stdout) console.log(stdout);
      if (stderr && !stderr.includes('warning')) console.error(stderr);
      console.log('✅ Changes published to yalc\n');
    })
    .catch((error) => {
      isBuilding = false;
      console.error('❌ Error:', error.message);
      if (error.stdout) console.log(error.stdout);
      if (error.stderr) console.error(error.stderr);
    });
}

// Debounce function to avoid multiple builds
function debouncedBuild() {
  if (buildTimeout) {
    clearTimeout(buildTimeout);
  }
  
  buildTimeout = setTimeout(() => {
    buildAndPublish();
  }, 5000); // Wait 300ms after last change
}

console.log('🚀 Starting file watcher...\n');
console.log('📁 Watching .tsx files in src/templates/\n');

// Watch only .tsx files in templates directory
const watcher = chokidar.watch('src/templates/**/*.tsx', {
  ignored: [
    /(^|[\\/\\])\../,
    'node_modules',
    'dist',
    'static',
    'private',
    '.medusa/**/*',
    'src/admin/**/*',
    '**/*.d.ts',
  ],
  ignoreInitial: true,
  persistent: true,
  cwd: projectRoot,
});

watcher
  .on('add', (filePath) => {
    const relativePath = path.relative(projectRoot, filePath);
    console.log(`➕ ${relativePath} created: Rebuilding...`);
    debouncedBuild();
  })
  .on('change', (filePath) => {
    const relativePath = path.relative(projectRoot, filePath);
    console.log(`📝 ${relativePath} modified: Rebuilding...`);
    debouncedBuild();
  })
  .on('unlink', (filePath) => {
    const relativePath = path.relative(projectRoot, filePath);
    console.log(`🗑️  ${relativePath} removed: Rebuilding...`);
    debouncedBuild();
  })
  .on('ready', () => {
    console.log('✅ Watcher ready. Changes to .tsx files in templates/ will trigger rebuild.\n');
  })
  .on('error', (error) => {
    console.error('❌ Watcher error:', error);
  });

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Stopping watcher...');
  if (buildTimeout) {
    clearTimeout(buildTimeout);
  }
  process.exit(0);
});

console.log('✅ Watcher ready. Make changes to .tsx files to trigger rebuild.\n');

