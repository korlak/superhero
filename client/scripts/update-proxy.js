const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const packageJsonPath = path.resolve(__dirname, '../package.json');
const port = process.env.REACT_APP_API_PORT || 5005; // запасний порт

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
packageJson.proxy = `http://localhost:${port}`;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`✅ Proxy set to http://localhost:${port}`);