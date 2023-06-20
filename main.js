const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const app = express();

const secretKey = 'AptechKey2023';

app.use(express.json());
app.use(cors());


// Middleware for token verification
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1];
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }
      req.user = decoded;
      next();
    });
  };

  


// Route for login and returning a token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'aptech') {
    // Generate a token with an expiration time
    const token = jwt.sign({ username: 'admin' }, secretKey, { expiresIn: '1h' });

    // Return the token as a response
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Protected route that requires authentication
app.get('/documents', verifyToken, (req, res) => {
  res.json({ message: 'Access granted!', user: req.user });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
