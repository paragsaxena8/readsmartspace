import { Router } from "express";
import {
  bookSearch,
  createBook,
  deleteBook,
  getBook,
  getBooks,
  updateBook,
} from "@controllers/book-reviews/book.controller";

export const bookRoutes = Router();

bookRoutes.route("/search").get(bookSearch);
bookRoutes.route("/").get(getBooks).post(createBook);
bookRoutes.route("/:id").get(getBook).patch(updateBook).delete(deleteBook);
