import { NextFunction, Request, Response } from "express";
import catchAsync from "@utils/catchAsync";
import { Book } from "@schema/book-review/book.schema";
import {
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "@services/handler.factory";

export const getBooks = getAll(Book);

export const getBook = getOne(Book);

export const createBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, author, description, rating, published, publisher } =
      req.body;

    const data = await Book.create({
      title,
      author,
      description,
      rating,
      published,
      publisher,
    });
    res.status(201).json({
      status: 201,
      data,
    });
  }
);

export const updateBook = updateOne(Book);

export const deleteBook = deleteOne(Book);

export const bookSearch = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        status: 400,
        message: "Please provide a title",
      });
    }

    const data = await Book.find(
      {
        title: { $regex: title, $options: "i" },
      },
      { title: 1 }
    );
    res.status(200).json({
      status: 200,
      data,
    });
  }
);
