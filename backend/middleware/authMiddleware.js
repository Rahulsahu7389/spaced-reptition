const admin = require('firebase-admin');

const protect = async (req, res, next) => {
  let token;

  /* ========================================================
   * DEV BYPASS MOCK (Uncomment block below to test via Postman
   * without needing a valid Firebase token every time)
   * ======================================================== */
  
  // req.user = { uid: 'test_user_123', email: 'test@example.com' };
  // return next();
  
  /* ======================================================== */

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Attach decoded payload to req.user (which contains uid)
      req.user = decodedToken;

      next();
    } catch (error) {
      console.error('Firebase Auth Error:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    // Only return error if we haven't already responded (e.g. if DEV bypass is active it won't reach here anyway)
    if (!res.headersSent) {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  }
};

module.exports = { protect };
