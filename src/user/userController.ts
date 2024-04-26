import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "./userModel";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //Validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  //Database Call
  const user = await userModel.findOne({ email });

  if (user) {
    const error = createHttpError(400, "Email already exists");
    return next(error);
  }

  //password  hash
  const hashedPassword = bcrypt.hash(password, 10);

  //Process
  //Response
  res.json({ message: "User Created" });
};

export { createUser };
