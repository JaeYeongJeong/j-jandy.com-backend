import mongodb from 'mongodb';
import session from 'express-session';
import mongodbStore from 'connect-mongodb-session';
import fs from 'fs';
import dotenv from 'dotenv';

if (fs.existsSync('.env')) {
  dotenv.config();
}

const MongoClient = mongodb.MongoClient;

let database;
const mongodbUrl = process.env.MONGODB_URL;

const connectMongoDb = async () => {
  try {
    const client = await MongoClient.connect(mongodbUrl);
    database = client.db('portfolio');
  } catch (error) {
    throw { message: error };
  }
};

const getDb = () => {
  if (!database) {
    throw { message: 'Database connection not established!' };
  }
  return database;
};

const MongoDBStore = mongodbStore(session);

const mongodbSessionStore = new MongoDBStore({
  uri: mongodbUrl,
  databaseName: 'portfolio',
  collection: 'session',
});

export default { connectMongoDb, getDb };

export { mongodbSessionStore };

