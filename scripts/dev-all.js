#!/usr/bin/env node

import { spawn } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// Define the projects and their ports
const projects = [
  { name: 'clerk-center', command: 'dev', port: 3000, color: 'blue' },
  { name: 'pl1', command: 'dev', port: 3001, color: 'green' },
  { name: 'pl2', command: 'dev', port: 3002, color: 'magenta' },
];

// ANSI color codes
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
};

// Start each project
projects.forEach(({ name, command, port, color }) => {
  console.log(`${colors[color]}Starting ${name} on port ${port}...${colors.reset}`);
  
  const proc = spawn('pnpm', ['--filter', name, command, '--port', port.toString()], {
    cwd: rootDir,
    stdio: 'pipe',
    env: {
      ...process.env,
      PORT: port.toString(),
      NEXT_PUBLIC_PORT: port.toString(),
    },
  });

  // Handle stdout
  proc.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      console.log(`${colors[color]}[${name}] ${line}${colors.reset}`);
    });
  });

  // Handle stderr
  proc.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      console.log(`${colors[color]}[${name}] ${line}${colors.reset}`);
    });
  });

  // Handle process exit
  proc.on('close', (code) => {
    console.log(`${colors[color]}[${name}] Process exited with code ${code}${colors.reset}`);
  });
});

console.log('\x1b[36m%s\x1b[0m', '🚀 All projects started!');
console.log('\x1b[36m%s\x1b[0m', '📋 Available URLs:');
console.log('\x1b[36m%s\x1b[0m', '   - Clerk Auth Center: http://localhost:3000');
console.log('\x1b[36m%s\x1b[0m', '   - PayloadCMS App 1: http://localhost:3001');
console.log('\x1b[36m%s\x1b[0m', '   - PayloadCMS App 2: http://localhost:3002');
