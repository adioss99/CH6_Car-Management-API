import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.auth = decoded;
    next();
  });
};

export const isSuperadmin = (req, res, next) => {
  if (req.auth.roles !== 'superadmin') return res.status(403).send('You are not superadmin');
  next();
};

export const isMember = (req, res, next) => {
  if (req.auth.roles === 'member') return res.status(403).send('Members not allowed to do this action');
  next();
};
