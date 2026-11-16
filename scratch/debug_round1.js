const fs = require('fs');
const path = require('path');

console.log('=== STARTING DEBUG ROUND 1: Static Integrity & Symbol Resolution ===');

// 1. Check JS syntax with node vm
const vm = require('vm');
['data.js', 'audio.js', 'app.js'].forEach(file => {
  try {
    const code = fs.readFileSync(file, 'utf8');
    new vm.Script(code);
    console.log(`[PASS] ${file} compiles successfully without syntax errors.`);
  } catch (err) {
    console.error(`[FAIL] Syntax error in ${file}:`, err);
    process.exit(1);
  }
});

// 2. Check CSS bracket match
const css = fs.readFileSync('styles.css', 'utf8');
const openCount = (css.match(/\{/g) || []).length;
const closeCount = (css.match(/\}/g) || []).length;
if (openCount === closeCount) {
  console.log(`[PASS] styles.css bracket match verified (${openCount} pairs).`);
} else {
  console.error(`[FAIL] styles.css bracket mismatch: { ${openCount} vs } ${closeCount}`);
  process.exit(1);
}

// 3. Inspect HTML window.LabApp calls
const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');

const htmlCalls = [...html.matchAll(/window\.LabApp\.([a-zA-Z0-9_]+)/g)].map(m => m[1]);
const uniqueCalls = [...new Set(htmlCalls)];
console.log(`[INFO] Found ${uniqueCalls.length} unique window.LabApp calls in index.html.`);

// Find all keys exported in window.LabApp = { ... } in app.js
const labAppMatch = appJs.match(/window\.LabApp\s*=\s*\{([\s\S]*?)\};/);
if (!labAppMatch) {
  console.error('[FAIL] Could not locate window.LabApp export block in app.js!');
  process.exit(1);
}

const exportedKeys = labAppMatch[1]
  .split(',')
  .map(s => s.trim().split(':')[0].trim())
  .filter(s => s && !s.startsWith('//'));

console.log(`[INFO] Found ${exportedKeys.length} exported keys in window.LabApp.`);

let missingCalls = [];
uniqueCalls.forEach(callName => {
  if (!exportedKeys.includes(callName)) {
    missingCalls.push(callName);
  }
});

if (missingCalls.length > 0) {
  console.error('[FAIL] Missing window.LabApp methods referenced by index.html:', missingCalls);
  process.exit(1);
} else {
  console.log('[PASS] All index.html LabApp calls are fully implemented and exported!');
}

console.log('=== DEBUG ROUND 1 PASSED WITH ZERO ERRORS ===');
