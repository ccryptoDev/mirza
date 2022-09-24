const NODE_ENV = process.env.NODE_ENV;
const databaseName = 'mirza';
let baseUrl = 'http://localhost:5000';
let serverPort = 5000;
let databasePassword = 'Postgres1';
let databaseHost = 'localhost';

if (process.env.NODE_ENV === 'test') {
  baseUrl = 'https://mirza-bw.alchemylms.com';
  serverPort = 19191;
  databasePassword = '@lchemy@123$';
} else if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://heymirza.com';
  serverPort = 8000;
  databasePassword = '@lchemy@123$';
  databaseHost = '35.165.155.90';
}

export default () => ({
  NODE_ENV: NODE_ENV || 'development',
  serverPort,
  baseUrl,
  databaseUsername: 'postgres',
  databasePassword,
  databasePort: 5432,
  synchronizeDatabase: true,
  databaseName,
  databaseHost,
});
