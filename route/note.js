import express from 'express';
import { sessionIsAuthenticated } from '../middlewares/auth-protection.js';
import { deleteNote, getNote, getNotes, getNotesSearch, patchNote, postNote } from '../controller/mongodb-note-controller.js';
import { uploadImageS3 } from '../middlewares/multer-s3.js';

const router = express.Router();

router.get('/notes', getNotes);

router.get('/notes/search', getNotesSearch);

router.get('/notes/:id', getNote);

router.post('/notes', uploadImageS3, sessionIsAuthenticated, postNote)

router.patch('/notes/:id', uploadImageS3, sessionIsAuthenticated, patchNote)

router.delete('/notes/:id', sessionIsAuthenticated, deleteNote);

export default router;