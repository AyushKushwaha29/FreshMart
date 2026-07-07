import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../config/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sanitizeFilename = (filename) => filename.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");

const hasCloudinaryConfig = () => {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
};

const uploadBuffer = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });

    stream.end(buffer);
  });

export const uploadImageBuffer = async (buffer, filename) => {
  const safeFilename = sanitizeFilename(filename);

  if (!hasCloudinaryConfig()) {
    const targetDir = path.resolve(__dirname, "../../tmp/uploads");
    await fs.mkdir(targetDir, { recursive: true });

    const targetPath = path.join(targetDir, safeFilename);
    await fs.writeFile(targetPath, buffer);

    const publicUrl = `${process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`}/uploads/${safeFilename}`;
    return {
      url: publicUrl,
      publicId: safeFilename
    };
  }

  const result = await uploadBuffer(buffer, {
    folder: "freshmart/products",
    public_id: safeFilename.replace(/\.[^.]+$/, ""),
    resource_type: "image"
  });

  return {
    url: result.secure_url,
    publicId: result.public_id
  };
};

export const uploadPdfBuffer = async (buffer, filename) => {
  const safeFilename = sanitizeFilename(filename);

  if (!hasCloudinaryConfig()) {
    const targetDir = path.resolve(__dirname, "../../tmp/invoices");
    await fs.mkdir(targetDir, { recursive: true });

    const targetPath = path.join(targetDir, safeFilename);
    await fs.writeFile(targetPath, buffer);

    return `${process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`}/invoices/${safeFilename}`;
  }

  const result = await uploadBuffer(buffer, {
    folder: "freshmart/invoices",
    public_id: safeFilename.replace(/\.pdf$/i, ""),
    resource_type: "raw",
    format: "pdf"
  });

  return result.secure_url;
};
