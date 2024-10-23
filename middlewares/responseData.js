const responseData = (req, res, next) => {
  const responseData = req.responseData || { message: 'No data available' };
  return res.json(responseData);
}

export { responseData };