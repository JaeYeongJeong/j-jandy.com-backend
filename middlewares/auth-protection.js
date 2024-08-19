const sessionIsAuthenticated = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ message: 'Please log in' });
  }

  next();
}

export { sessionIsAuthenticated };