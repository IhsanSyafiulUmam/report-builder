import fs from 'fs';
import path from 'path';

export const loadSQL = (filePath: string): string => {
  const fullPath = path.resolve(process.cwd(), 'src/queries', filePath);
  return fs.readFileSync(fullPath, 'utf-8');
};