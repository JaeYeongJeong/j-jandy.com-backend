const responseData = (req, res, next) => {
  const responseData = req.responseData || { message: 'No data available' };
  const status = req.status || 200;
  return res.status(status).json(responseData);
}

export { responseData };