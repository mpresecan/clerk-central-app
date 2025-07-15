#!/usr/bin/env node

import { spawn } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// Define the build order (auth center first, then satellite apps)
const projects = [
  'clerk-center',
  'pl1',
  'pl2',
  'better-auth-center'
];

// ANSI color codes
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

async function buildProject(projectName) {
  return new Promise((resolve, reject) => {
    console.log(`${colors.blue}Building ${projectName}...${colors.reset}`);
    
    const proc = spawn('pnpm', ['--filter', projectName, 'build'], {
      cwd: rootDir,
      stdio: 'pipe',
    });

    // Handle stdout
    proc.stdout.on('data', (data) => {
      const lines = data.toString().trim().split('\n');
      lines.forEach(line => {
        console.log(`${colors.green}[${projectName}] ${line}${colors.reset}`);
      });
    });

    // Handle stderr
    proc.stderr.on('data', (data) => {
      const lines = data.toString().trim().split('\n');
      lines.forEach(line => {
        console.log(`${colors.yellow}[${projectName}] ${line}${colors.reset}`);
      });
    });

    // Handle process exit
    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`${colors.green}✅ ${projectName} built successfully${colors.reset}`);
        resolve();
      } else {
        console.log(`${colors.red}❌ ${projectName} build failed with code ${code}${colors.reset}`);
        reject(new Error(`Build failed for ${projectName}`));
      }
    });
  });
}

async function buildAll() {
  console.log(`${colors.blue}🚀 Starting build process for all projects...${colors.reset}`);
  
  try {
    for (const project of projects) {
      await buildProject(project);
    }
    
    console.log(`${colors.green}🎉 All projects built successfully!${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}💥 Build process failed: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

buildAll();
