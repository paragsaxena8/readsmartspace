import { Request, Response, NextFunction } from "express";
import { BookReview } from "@schema/book-review/book-review.schema";
import catchAsync from "@utils/catchAsync";
import { getAll, getOne, updateOne, deleteOne } from "@services/handler.factory";

export const getAllReviews = getAll(BookReview, {
  exclude: ["__v"],
  populate: [{
    path: "bookId",
    select: "title",
  }]
});

export const getReview = getOne(BookReview);

export const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookId, reviewer, rating, reviewText, recommended } = req.body;

    const data = await BookReview.create({
      bookId,
      reviewer,
      rating,
      reviewText,
      recommended,
    });
    res.status(201).json({
      status: 201,
      data,
    });
  }
);

export const updateReview = updateOne(BookReview);

export const deleteReview = deleteOne(BookReview);
