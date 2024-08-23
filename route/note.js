import express from 'express';
import { sessionIsAuthenticated } from '../middlewares/auth-protection.js';
import { deleteNote, getNote, getNotes, getNotesSearch, patchNote, postNote } from '../controller/mongodb-note-controller.js';
import { uploadImage } from '../middlewares/multer.js';

const router = express.Router();

router.get('/notes', getNotes);

router.get('/notes/search', getNotesSearch);

router.get('/notes/:id', getNote);

router.post('/notes', uploadImage, sessionIsAuthenticated, postNote)

router.patch('/notes/:id', uploadImage, sessionIsAuthenticated, patchNote)

router.delete('/notes/:id', sessionIsAuthenticated, deleteNote);

export default router;