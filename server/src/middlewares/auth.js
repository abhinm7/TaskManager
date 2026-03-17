const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Authentication required. No token provided.' });
        }

        // Verify signature and expiration
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Inject the decoded user ID into the request pipeline
        req.userId = decoded.id;

        next();
    } catch (error) {
        console.error(`JWT Verification Error: ${error.message}`);
        // Catch both expired tokens and malformed signatures
        return res.status(401).json({ error: 'Invalid or expired authentication session.' });
    }
};

module.exports = { requireAuth };