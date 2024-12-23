import { NextFunction, Request, Response } from "express";
import { BlogCategory } from "@schema/blogs/blog-category.schema";
import catchAsync from "@utils/catchAsync";
import {
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "@services/handler.factory";

export const getBlogCategories = getAll(BlogCategory);

export const getBlogCategory = getOne(BlogCategory);

export const createBlogCategory = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { name, description } = req.body;

    const data = await BlogCategory.create({
      name,
      description,
    });
    res.status(201).json({
      status: 201,
      data,
    });
  },
);

export const updateBlogCategory = updateOne(BlogCategory);

export const deleteBlogCategory = deleteOne(BlogCategory);
