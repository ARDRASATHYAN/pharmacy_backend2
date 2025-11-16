// middleware/roleMiddleware.js
module.exports = function(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
};



// const auth = require('./middleware/authMiddleware');
// const permit = require('./middleware/roleMiddleware');

// router.get('/admin-only', auth, permit(['Admin']), adminController.foo);