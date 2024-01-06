import jwt from 'jsonwebtoken';
export function authenticateToken(req, res, next) {
    const token = req.headers['authorization'].split(' ')[1];
  
    console.log(token);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token, process.env.SECRETE_KEY, (err, user) => {
      console.log(err)
      if (err) {
        console.error("not allowed"); 
        return res.status(403).json({ error: 'Forbidden' });
      }
      req.user = user;
      next();
    });
}
