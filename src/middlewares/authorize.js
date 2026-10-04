const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "Không tìm thấy thông tin quyền người dùng!" });
    }

    // Chuyển tất cả về chữ HOA để so sánh không bị sai lệch (ví dụ: "admin" -> "ADMIN")
    const userRole = String(req.user.role).toUpperCase();
    const roles = allowedRoles.map((r) => String(r).toUpperCase());

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "Bạn không có quyền thực hiện thao tác này!",
      });
    }

    next();
  };
};

module.exports = authorize;
