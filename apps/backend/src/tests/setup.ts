import { afterAll, afterEach, beforeAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

// Function to clear all models
const clearModels = () => {
  // Use type assertion to handle readonly type
  const models = mongoose.connection.models as any;
  const modelNames = Object.keys(models);
  for (const model of modelNames) {
    delete models[model];
  }
};

// Connect to the in-memory database before tests run
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  
  // Clear any existing models
  clearModels();
  
  await mongoose.connect(mongoUri);
});

// Clear all test data and models after each test
afterEach(async () => {
  // Drop the whole in-memory database after each test
  await mongoose.connection.dropDatabase();
  clearModels();

});

// Remove and close the db and server
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Export mongoose for use in tests
export { mongoose };
