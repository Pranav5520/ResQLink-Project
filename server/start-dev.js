const { MongoMemoryServer } = require('mongodb-memory-server');

async function main() {
  console.log('Starting in-memory MongoDB...');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log(`MongoDB running at: ${uri}`);

  process.env.MONGO_URI = uri;
  process.env.PORT = '5000';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';
  process.env.JWT_EXPIRE = '7d';
  process.env.CLIENT_URL = 'http://localhost:5173';
  process.env.NODE_ENV = 'development';

  // Connect to the in-memory DB and seed
  const mongoose = require('mongoose');
  await mongoose.connect(uri);
  console.log('Connected to in-memory MongoDB');

  // Run seed
  console.log('Seeding database...');
  const seed = require('./seed');
  await seed();
  console.log('Database seeded successfully!');

  // Disconnect before starting the server with its own connection
  await mongoose.disconnect();

  // Now start the server (it connects on its own)
  require('./server.js');
}

main().catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});
