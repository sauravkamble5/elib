import { NextFunction, Request, Response } from "express";
import path from "node:path";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  console.log("files", req.files);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const coverImageType = files.coverImage[0].mimetype.split("/").at(-1);

  const fileName = files.coverImage[0].filename;

  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageType,
    });

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );

    console.log("bookFileUploadResult", bookFileUploadResult);
    console.log("uploadResult", uploadResult);

    const newBook = await bookModel.create({
      title,
      genre,
      author: "662b407514a47376dc0d10c8",
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    //Delete Temp Files
    try {
      await fs.promises.unlink(filePath);
      await fs.promises.unlink(bookFilePath);
    } catch (error) {
      return next(createHttpError(500, "Error while deleting temp files"));
    }

    res.status(201).json({ id: newBook._id });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error while uploading the files"));
  }
};

export { createBook };
