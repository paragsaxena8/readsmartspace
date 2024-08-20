import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    required: [true, "Please select a book to review"],
    ref: "Book", // Reference to the Book model
  },
  reviewer: {
    type: String,
    required: [true, "Please provide your name"],
  },
  rating: {
    type: Number,
    required: [true, "Please provide a rating"],
    min: 1,
    max: 5, // Adjust as needed for your rating scale
  },
  reviewText: {
    type: String,
    required: [true, "Please provide a review"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reviewTitle: {
    type: String,
  },
  recommended: {
    type: Boolean,
    required: [true, "Please specify if you recommend the book or not"],
  },
});

export const BookReview = model("BookReview", reviewSchema);
