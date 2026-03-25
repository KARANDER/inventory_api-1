const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    // req.user is attached by the existing authMiddleware
    const userPermissions = req.user?.permissions;

    // Support both single permission (string) and multiple permissions (array)
    const permissionsToCheck = Array.isArray(requiredPermission)
      ? requiredPermission
      : [requiredPermission];

    // Check if the user has ANY of the required permissions
    const hasPermission = userPermissions && permissionsToCheck.some(perm => userPermissions.includes(perm));

    if (hasPermission) {
      next(); // Permission granted, proceed to the controller
    } else {
      res.status(403).json({
        success: false,
        message: "Forbidden: You don't have permission to access this resource."
      });
    }
  };
};

module.exports = checkPermission;