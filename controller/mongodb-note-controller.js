import mongoDb from '../data/mongodb.js';
import { ObjectId } from 'mongodb';

const getNotes = async (req, res) => {
  try {
    const notes = await mongoDb.getDb().collection('notes').find().toArray();

    if (!notes.length) {
      return res.status(200).json({ message: `Notes not found.` });
    }

    res.json({
      notes: notes.map((note) => ({
        id: note._id.toString(),
        title: note.title,
        date: note.date,
        description: note.description,
        image: note.image,
        name: note.name,
        user: note.user,
      }))
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve notes.' });
  }
}

const getNotesSearch = async (req, res) => {
  try {
    const { query: searchQuery } = req.query;

    const regex = new RegExp(searchQuery, 'i');

    const notes = await mongoDb.getDb().collection('notes').find({
      $or: [
        { description: { $regex: regex } },
        { title: { $regex: regex } }
      ]
    }).toArray();

    if (!notes.length) {
      return res.status(200).json({ message: `For the ${searchQuery}, no note could be found.` });
    }

    res.json({
      notes: notes.map((note) => ({
        id: note._id.toString(),
        title: note.title,
        date: note.date,
        description: note.description,
        image: note.image,
        name: note.name,
      }))
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: 'Failed to search notes.' });
  }
}

const getNote = async (req, res) => {
  try {
    const note = await mongoDb.getDb().collection('notes').findOne({ _id: new ObjectId(req.params.id) })

    if (!note) {
      return res.status(404).json({ message: `For the id ${req.params.id}, no note could be found.` });
    }

    res.json({
      note: {
        id: note._id.toString(),
        title: note.title,
        date: note.date,
        description: note.description,
        image: note.image,
        name: note.name,
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: 'Failed to retrieve note.' });
  }
}

const postNote = async (req, res, next) => {
  const data = req.body;
  const imageFile = req.file?.key;

  try {
    const result = await mongoDb.getDb().collection('notes').insertOne({
      title: data.title,
      description: data.description,
      image: imageFile,
      date: new Date(),
      name: req.session.user.name,
      user: req.session.user.id,
    });

    if (!result.acknowledged) {
      return res.status(500).json({ message: "Failed to insert the document" });
    }

    req.responseData = { insertedId: result.insertedId };
    req.status = 201;
    next();
  } catch {
    console.error(error);

    return res.status(500).json({ message: "An error occurred while inserting the document" });
  }
}

const patchNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const userId = req.session.user.id;
    const data = req.body;

    const existingNote = await mongoDb.getDb().collection('notes').findOne({ _id: new ObjectId(noteId) });

    const user = await mongoDb.getDb().collection('users').findOne({ user_id: userId });

    if (user?.role !== 'master' && existingNote.user !== userId) {
      return res.status(403).json({ message: `No authorization` });
    }

    const existingImage = existingNote?.image;

    const updateData = {
      ...existingNote,
      title: data.title,
      description: data.description,
      date: new Date(),
    };

    if (req.file?.key) {
      updateData.image = req.file?.key;
    } else {
      updateData.image = '';
    }

    const result = await mongoDb.getDb().collection('notes').updateOne(
      { _id: new ObjectId(noteId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: `No document found with id ${noteId}` });
    }

    if (existingImage) {
      req.imageKeyToDelete = existingImage;
    }

    req.status = 200;
    req.responseData = { editedId: noteId };

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: 'Failed to update the document' });
  }
}

const deleteNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const objectNoteId = new ObjectId(noteId);
    const userId = req.session.user.id;

    const note = await mongoDb.getDb().collection('notes').findOne({ _id: objectNoteId });

    const user = await mongoDb.getDb().collection('users').findOne({
      user_id: userId
    });

    if (!note) {
      return res.status(404).json({ message: `No note found.` });
    }

    if (user?.role !== 'master' && note.user !== userId) {
      return res.status(403).json({ message: `No authorization.` });
    }

    const result = await mongoDb.getDb().collection('notes').deleteOne({ _id: objectNoteId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No document was deleted' });
    }

    if (note.image) {
      req.imageKeyToDelete = note.image;
    }

    req.responseData = { deleteId: noteId };

    next();
  } catch (error) {
    console.error('Failed to delete note:', error);

    return res.status(500).json({ message: 'Failed to delete note' });
  }
}

export { getNotes, getNotesSearch, getNote, postNote, patchNote, deleteNote };