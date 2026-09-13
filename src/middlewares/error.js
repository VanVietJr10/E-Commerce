const { success } = require("zod");

const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name == "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Du lieu khong hop le",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Loi may chu noi bo",
  });
};

module.exports = errorHandler;
