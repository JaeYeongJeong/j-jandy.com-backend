import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import mongoDb from '../data/mongodb.js';

if (fs.existsSync('.env')) {
  dotenv.config();
}

const getSession = (req, res) => {
  if (req.session.isAuthenticated) {
    return res.status(200).json({ isAuthenticated: true, user: req.session.user });
  } else {
    return res.status(401).json({ isAuthenticated: false });
  }
}

const postLogin = async (req, res) => {
  const { id, password } = req.body;

  try {
    const user = await mongoDb.getDb().collection('users').findOne({ user_id: id });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.user_pw);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    req.session.user = { id: user.user_id, name: user.name };
    req.session.isAuthenticated = true;

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ message: 'Session save error' });
      }

      return res.status(200).json({ message: 'Login successful' });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Login failed' });
  }
}

const postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err.message });
    }
    return res.status(200).json({ message: 'Logout successful' });
  });
}

const postRegist = async (req, res) => {
  const { id, password, email, name } = req.body;

  try {
    const existingUser = await mongoDb.getDb().collection('users').findOne({ user_id: id });

    if (existingUser) {
      return res.status(409).json({ message: 'This ID is already in use' });
    }

    const existingEmail = await mongoDb.getDb().collection('users').findOne({ email: email });

    if (existingEmail) {
      return res.status(409).json({ message: 'This Email is already in use' });
    }

    const existingName = await mongoDb.getDb().collection('users').findOne({ name: name });

    if (existingName) {
      return res.status(409).json({ message: 'This Name is already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await mongoDb.getDb().collection('users').insertOne({
      user_id: id,
      user_pw: hashedPassword,
      name,
      email,
      role: 'member',
    });

    if (!result.insertedId) {
      return res.status(500).json({ message: `No response to the regist` });
    }

    return res.status(201).json({ message: 'Regist successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Database error' });
  }
}

export { getSession, postLogin, postLogout, postRegist }