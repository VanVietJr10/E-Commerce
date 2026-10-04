const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      console.log(
        "❌ Authorize Fail: Không tìm thấy req.user hoặc req.user.role",
      );
      return res.status(403).json({ message: "Không có thông tin quyền hạn!" });
    }

    // Chuyển tất cả về chữ HOA để so sánh không bị sai lệch (ví dụ: "admin" -> "ADMIN")
    const userRole = String(req.user.role).trim().toUpperCase();
    const roles = allowedRoles.map((r) => String(r).trim().toUpperCase());

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "Bạn không có quyền thực hiện thao tác này!",
      });
    }

    next();
  };
};

module.exports = authorize;
