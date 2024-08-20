import { Router } from "express";
import { createReview, deleteReview, getAllReviews, getReview, updateReview } from "@controllers/book-reviews/book-review.controller";


export const reviewRoutes = Router();

reviewRoutes.route("/").get(getAllReviews).post(createReview);
reviewRoutes
  .route("/:id")
  .get(getReview)
  .patch(updateReview)
  .delete(deleteReview);