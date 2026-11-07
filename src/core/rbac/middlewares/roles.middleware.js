/**
 * Authorization Middleware to restrict route access based on client user role
 * @param {...string} allowedRoles 
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user variable auth middleware se pass ho kar yahan aayega
    if (!req.user || !req.user.role) {
      return res.status(401).json({ success: false, message: 'Unauthorized access. No profile context found.' });
    }

    const userRole = req.user.accountType || req.user.role;
    const hasRole = allowedRoles.includes(userRole);
    if (!hasRole) {
      return res.status(403).json({ success: false, message: 'Forbidden. Your role does not have access to this action.' });
    }

    next();
  };
};

export { authorize };