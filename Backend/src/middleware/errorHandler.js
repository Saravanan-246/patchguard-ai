module.exports = (err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  // Mongoose Bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid resource ID",
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value entered",
    });
  }

  // Validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(
      (val) => val.message
    );

    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  // Default
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};