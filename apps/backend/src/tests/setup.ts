import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeAll, afterAll, afterEach } from 'vitest';

declare global {
  var __MONGO_URI__: string;
  var __MONGO_INSTANCE: MongoMemoryServer;
}

// Create a new in-memory MongoDB server
const startMongoMemoryServer = async () => {
  const instance = await MongoMemoryServer.create();
  const uri = instance.getUri();
  
  // Store the URI and instance in the global scope
  global.__MONGO_URI__ = uri;
  global.__MONGO_INSTANCE = instance;
  
  // Set the MongoDB URI for the application
  process.env.MONGO_URI = uri;
  
  return { instance, uri };
};

// Connect to the in-memory database
const connect = async () => {
  const { uri } = await startMongoMemoryServer();
  
  // Mongoose 6+ doesn't need useNewUrlParser and useUnifiedTopology
  await mongoose.connect(uri);
};

// Remove all data from all collections
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

// Drop database, close the connection and stop mongod
const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await global.__MONGO_INSTANCE.stop();
};

// Setup and teardown
beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});
