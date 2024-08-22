import dotenv from 'dotenv';

dotenv.config();

const createSessionConfig = (session_DB) => {
  return {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: session_DB,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
    },
  };
}

export { createSessionConfig };