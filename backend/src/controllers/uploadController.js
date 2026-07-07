import asyncHandler from "../utils/asyncHandler.js";
import { uploadImageBuffer } from "../services/cloudinaryService.js";

export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files?.length) {
    const error = new Error("No files uploaded");
    error.statusCode = 400;
    throw error;
  }

  const uploads = await Promise.all(
    req.files.map((file) => uploadImageBuffer(file.buffer, `${Date.now()}-${file.originalname}`))
  );

  res.status(201).json({
    success: true,
    message: "Images uploaded successfully",
    data: uploads
  });
});

