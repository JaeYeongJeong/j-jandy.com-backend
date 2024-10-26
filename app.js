import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import noteRoutes from './route/note.js';
import authRoutes from './route/auth.js';
import { createSessionConfig } from './config/config.js';
import mongoDb, { mongodbSessionStore } from './data/mongodb.js';
import fs from "fs";
import https from 'https';
import dotenv from 'dotenv';

if (fs.existsSync('.env')) {
  dotenv.config();
}

const PORT = process.env.PORT;
const frontendUrl = process.env.FRONTEND_URL;

const app = express();

app.set('trust proxy', 1);
app.use(session(createSessionConfig(mongodbSessionStore)));

app.use(bodyParser.json());
app.use(express.static('./data/notesImage'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', frontendUrl);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

await mongoDb.connectMongoDb().then(() => {
  app.use(authRoutes);
  app.use(noteRoutes);

  if (process.env.PROTOCAL === 'https') {
    const options = {
      key: fs.readFileSync(process.env.SSL_KEY),
      cert: fs.readFileSync(process.env.SSL_CERT),
    };
    https.createServer(options, app).listen(PORT, () => {
      console.log(`HTTPS server started on port ${PORT}`);
    });
  } else {
    app.listen(PORT, () => {
      console.log(`HTTP Server is running on port ${PORT}`);
    });
  }
});

