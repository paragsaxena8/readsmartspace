import { NextFunction, Request, Response } from "express";
import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "@services/handler.factory";
import { Blog } from "@schema/blogs/blog.schema";
import catchAsync from "@utils/catchAsync";

// Get all blogs
export const getAllBlog = getAll(Blog, {
  exclude: ["content", "__v"],
});

// Get single blog
export const getBlog = getOne(Blog, {
  exclude: ["content", "__v"]
});

// Create blog
export const createBlog = catchAsync(
  async (req: Request | any, res: Response, next: NextFunction) => {
    console.log(req.body);

    const { title, author, content, categories, tags } = req.body;
    let featuredImage = null;
    if (req.file) {
      featuredImage = {
        data: req.file.buffer.toString("base64"),
        conentType: "image/png",
      };
    }

    const data = await Blog.create({
      title,
      author,
      content,
      categories,
      featuredImage,
      tags,
    });
    res.status(201).json({
      status: "success",
      data,
    });
  }
);

// Update blog
export const updateBlog = updateOne(Blog);

// Delete blog
export const deleteBlog = deleteOne(Blog);
