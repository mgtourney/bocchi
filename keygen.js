import crypto from 'crypto';
import * as fs from 'fs';

if (!fs.existsSync('.env.json')) {
  fs.writeFileSync('.env.json', '{}');
}

let envfile = JSON.parse(fs.readFileSync('.env.json', 'utf8'));

const secret = crypto.randomBytes(32).toString('hex');
console.log('Generated session secret key:', secret);
const iv = crypto.randomBytes(16).toString('hex');
console.log('Generated session initialisation vector:', iv);

envfile.encryption = {
  key: secret,
  iv: iv
};

fs.writeFileSync('.env.json', JSON.stringify(envfile, null, 2));