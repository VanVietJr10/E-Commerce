const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("=== DEBUG AUTHORIZE ===");
    console.log("Req User từ Token:", req.user);
    console.log("Allowed Roles:", allowedRoles);

    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "Không tìm thấy role trong token!" });
    }

    const userRole = String(req.user.role).trim().toUpperCase();
    const roles = allowedRoles.map((r) => String(r).trim().toUpperCase());

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: `Quyền '${userRole}' không có quyền truy cập! Cần quyền: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = authorize;
