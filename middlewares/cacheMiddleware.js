import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 * 60 });

const cacheNotes = (req, res, next) => {
  const key = 'note';
  try {
    const notes = cache.get(key);

    if (notes) {
      return res.json(notes);
    }

    res.sendResponse = res.json;

    res.json = (body) => {
      cache.set(key, body);
      res.sendResponse(body);
    };
    console.log('set cache');
  } catch (error) {
    console.error(error);
  }
  next();
};

const updateNotesCache = (req, res, next) => {
  const key = 'note';
  try {
    console.log('delete cache');
    cache.del(key);
    console.log(req.responseData);
    res.json(req.responseData);
  } catch (error) {
    console.error(error);
  }
}

export { cacheNotes, updateNotesCache };