#!/usr/bin/env node

import { readdir, stat } from 'fs/promises';
import { join } from 'path';

async function findFiles(dir, extensions, maxResults = 10) {
  const results = [];
  
  async function traverse(currentDir) {
    if (results.length >= maxResults) return;
    
    try {
      const entries = await readdir(currentDir);
      
      for (const entry of entries) {
        if (results.length >= maxResults) break;
        
        const fullPath = join(currentDir, entry);
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
          await traverse(fullPath);
        } else if (stats.isFile()) {
          const ext = entry.split('.').pop();
          if (extensions.includes(ext)) {
            results.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  await traverse(dir);
  return results;
}

// Main execution
const extensions = ['jsx', 'js', 'tsx', 'ts'];
const maxResults = 10;

try {
  const files = await findFiles('src', extensions, maxResults);
  files.forEach(file => console.log(file));
} catch (error) {
  console.error('Error finding files:', error.message);
}