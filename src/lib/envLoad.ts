import fs from 'fs';

export const env = JSON.parse(fs.readFileSync('./../../.env.json', 'utf8'));