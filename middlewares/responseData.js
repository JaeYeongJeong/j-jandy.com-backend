const responseData = (req, res) => {
  return res.json(req.responseData);
}

export { responseData };