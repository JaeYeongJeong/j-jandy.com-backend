import fs from 'fs';
import dotenv from 'dotenv';

if (fs.existsSync('.env')) {
  dotenv.config();
}

const createSessionConfig = (session_DB) => {
  return {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: session_DB,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: true,
      httpOnly: true,
      sameSite: 'None',
    },
  };
}

export { createSessionConfig };