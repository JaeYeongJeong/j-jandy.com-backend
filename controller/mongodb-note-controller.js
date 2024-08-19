import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoDb from '../data/mongodb.js';
import { ObjectId } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getNotes = async (req, res) => {
  try {
    const notes = await mongoDb.getDb().collection('notes').find().toArray();

    if (!notes.length) {
      return res.status(404).json({ message: `Notes not found.` });
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
    res.status(500).json({ message: 'Failed to retrieve notes.' });
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
      return res.status(404).json({ message: `For the ${searchQuery}, no note could be found.` });
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
    res.status(500).json({ message: 'Failed to search notes.' });
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
    res.status(500).json({ message: 'Failed to retrieve note.' });
  }
}

const postNote = async (req, res) => {
  const data = req.body;
  const imageFile = req.file?.filename;

  try {
    const result = await mongoDb.getDb().collection('notes').insertOne({
      title: data.title,
      description: data.description,
      image: imageFile,
      date: new Date(),
      name: req.session.user.name,
    });

    if (!result.acknowledged) {
      return res.status(500).json({ message: "Failed to insert the document" });
    }

    res.json({ insertedId: result.insertedId });
  } catch {
    console.error(error);
    res.status(500).json({ message: "An error occurred while inserting the document" });
  }
}

const patchNote = async (req, res) => {
  const data = req.body;
  const id = req.params.id;

  try {
    const updateData = {
      title: data.title,
      description: data.description,
      name: req.session.user.name,
      date: new Date(),
    };

    if (req.file?.filename) {
      updateData.image = req.file.filename;
    }

    const result = await mongoDb.getDb().collection('notes').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: `No document found with id ${id}` });
    }

    res.json({ editedId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update the document' });
  }
}

const deleteNote = async (req, res) => {
  const id = req.params.id;

  try {
    const objectId = new ObjectId(id);

    const note = await mongoDb.getDb().collection('notes').findOne({ _id: objectId });

    if (!note) {
      return res.status(404).json({ message: `No note found with id ${id}` });
    }

    const result = await mongoDb.getDb().collection('notes').deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No document was deleted' });
    }

    if (note.image) {
      const imageFile = note.image;
      const imagePath = path.join(__dirname, '../data/notesImage/', imageFile);

      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (error) {
          console.error('Failed to delete image file:', error);
        }
      }
    }

    res.json({ deleteId: id });
  } catch (error) {
    console.error('Failed to delete note:', error);
    res.status(500).json({ message: 'Failed to delete note' });
  }
}

export { getNotes, getNotesSearch, getNote, postNote, patchNote, deleteNote };