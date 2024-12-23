import { NextFunction, Request, Response } from "express";
import catchAsync from "@utils/catchAsync";
import {
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "@services/handler.factory";
import { BlogTags } from "@schema/blogs/blog-tags.schema";

export const getBlogTags = getAll(BlogTags, {
  exclude: ["__v"],
});

export const getBlogTag = getOne(BlogTags);

export const createBlogTags = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { name } = req.body;

    const data = await BlogTags.create({
      name,
    });
    res.status(201).json({
      status: 201,
      data,
    });
  }
);

export const updateBlogTag = updateOne(BlogTags);

export const deleteBlogTag = deleteOne(BlogTags);
