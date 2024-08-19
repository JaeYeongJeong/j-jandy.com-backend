import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
// import fs from 'fs';
// import https from 'https';
import noteRoutes from './route/note.js';
import authRoutes from './route/auth.js';
import { createSessionConfig } from './config/config.js';
import mongoDb, { mongodbSessionStore } from './data/mongodb.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
  origin: 'https://localhost:5173',
  credentials: true,
}));

app.use(bodyParser.json());
app.use(express.static('./data/notesImage'));

app.use(session(createSessionConfig(mongodbSessionStore)));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://localhost:5173');
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


//conncet mongoDb
await mongoDb.connectMongoDb().then(() => {
  app.use(authRoutes);
  app.use(noteRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // const options = {
  //   key: fs.readFileSync('../localhost-key.pem'),
  //   cert: fs.readFileSync('../localhost.pem'),
  // };
  // https.createServer(options, app).listen(PORT, () => {
  //   console.log(`HTTPS server started on port 8080`);
  // });
});

