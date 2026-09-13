const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Ban khong co quyen thuc hien thao tac nay" });
    }
    next();
  };
};

module.exports = authorize;
