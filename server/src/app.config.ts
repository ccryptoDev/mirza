const NODE_ENV = process.env.NODE_ENV;
const databaseName = 'mirza';
let baseUrl = 'http://localhost:5000';
let serverPort = 5000;
let databasePassword = '@lchemy@123$';
let databaseHost = 'localhost';
let databaseUsername = 'postgres';

if (process.env.NODE_ENV === 'test') {
  baseUrl = 'https://mirza-api.alchemylms.com';
  serverPort = 5432;
  databasePassword = '@lchemy@123$';
  databaseUsername = 'postgres';
  databaseHost = '34.219.234.254';
} else if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://heymirza.com';
  serverPort = 8000;
  databasePassword = '@lchemy@123$';
  databaseHost = '34.219.234.254';
}

export default () => ({
  NODE_ENV: NODE_ENV || 'development',
  serverPort,
  baseUrl,
  databaseUsername,
  databasePassword,
  databasePort: 5432,
  synchronizeDatabase: true,
  databaseName,
  databaseHost,
});
