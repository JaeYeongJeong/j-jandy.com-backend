import dotenv from 'dotenv';

dotenv.config();

const createSessionConfig = (session_DB) => {
  return {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: session_DB,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24시간
      secure: true, // HTTPS를 사용하는 경우 true로 설정
      sameSite: 'lax', // 필요에 따라 'strict' 또는 'none'으로 변경
    },
  };
}

export { createSessionConfig };