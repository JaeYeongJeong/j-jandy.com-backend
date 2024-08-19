import mongodb from 'mongodb';
import session from 'express-session';
import mongodbStore from 'connect-mongodb-session';

const MongoClient = mongodb.MongoClient;

let database;

const connectMongoDb = async () => {
  try {
    const client = await MongoClient.connect('mongodb://localhost:27017');
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
  uri: 'mongodb://localhost:27017',
  databaseName: 'portfolio',
  collection: 'session',
});

export default { connectMongoDb, getDb };

export { mongodbSessionStore };
