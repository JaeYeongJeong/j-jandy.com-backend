import express from 'express';
import { sessionIsAuthenticated } from '../middlewares/auth-protection.js';
import { deleteNote, getNote, getNotes, getNotesSearch, patchNote, postNote } from '../controller/mongodb-note-controller.js';
import { deleteImageFromS3, uploadImageS3 } from '../middlewares/multer-s3.js';
import { cacheNotes, updateNotesCache } from '../middlewares/cacheMiddleware.js';
import { responseData } from '../middlewares/responseData.js';

const router = express.Router();

router.get('/notes', cacheNotes, getNotes);

router.get('/notes/search', getNotesSearch);

router.get('/notes/:id', getNote);

router.post('/notes', sessionIsAuthenticated, uploadImageS3, postNote, updateNotesCache, responseData)

router.patch('/notes/:id', sessionIsAuthenticated, uploadImageS3, patchNote, deleteImageFromS3, updateNotesCache, responseData)

router.delete('/notes/:id', sessionIsAuthenticated, deleteNote, deleteImageFromS3, updateNotesCache, responseData);

export default router;