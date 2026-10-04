const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🟢 1. Thêm dấu cách sau "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Chưa đăng nhập hoặc thiếu Token!" });
    }

    const token = authHeader.split(" ")[1];

    // 🟢 2. Thêm Fallback Secret Key phòng trường hợp Render chưa nạp .env
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_key",
    );

    req.user = decoded;
    next();
  } catch (e) {
    // 🟢 3. Đã sửa e.message (thay vì error.message)
    console.error("Lỗi xác thực Token:", e.message);

    return res
      .status(403)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

module.exports = authenticate;
