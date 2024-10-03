const sessionIsAuthenticated = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ message: 'Session is anauthenticated' });
  }

  next();
}

export { sessionIsAuthenticated };