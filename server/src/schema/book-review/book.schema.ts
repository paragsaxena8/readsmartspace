import { Schema, model } from "mongoose";

const bookSchema = new Schema({
  isbn: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    min: [10, "Title should be at least 10 characters"],
  },
  subtitle: {
    type: String,
  },
  author: {
    type: [String],
    required: [true, "Author is required"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  published: {
    type: Date,
    default: Date.now,
  },
  pages: {
    type: Number,
  },
  featureImage: {
    type: String,
    required: true,
    default: "default.jpg",
  },
  publisher: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
    enum: [0, 1, 2, 3, 4, 5],
  },
  tags: {
    type: [String],
    required: true,
  },
});

export const Book = model("Book", bookSchema);
