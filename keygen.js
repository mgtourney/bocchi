import crypto from 'crypto';
import * as fs from 'fs';

if (!fs.existsSync('.env.json')) {
  fs.writeFileSync('.env.json', '{}');
}

let envfile = JSON.parse(fs.readFileSync('.env.json', 'utf8'));

const secrets = [crypto.randomBytes(32).toString('hex'), crypto.randomBytes(32).toString('hex')];
console.log('Generated session secret keys:', secrets);

envfile.cookieKeys = secrets;

fs.writeFileSync('.env.json', JSON.stringify(envfile, null, 2));