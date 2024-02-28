export const passwordResetMiddleware = (req, res, next) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Se requiere  password' });
    }
    next();
  };