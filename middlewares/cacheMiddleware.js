import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 * 60 });

const cacheNotes = (req, res, next) => {
  const key = 'note';
  try {
    const notes = cache.get(key);

    if (notes) {
      return res.status(200).json(notes);
    }

    res.sendResponse = res.json;

    res.json = (body) => {
      cache.set(key, body);
      res.sendResponse(body);
    };
  } catch (error) {
    console.error(error);
  }
  next();
};

const updateNotesCache = (req, res, next) => {
  const key = 'note';
  try {
    cache.del(key);
  } catch (error) {
    console.error(error);
  }
  next();
}

export { cacheNotes, updateNotesCache };