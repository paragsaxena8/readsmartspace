import { Router } from "express";
import { getAllBlog, createBlog, getBlog, updateBlog, deleteBlog } from "@controllers/blogs/blogs.controller";
import { createBlogCategory, deleteBlogCategory, getBlogCategories, updateBlogCategory } from "@controllers/blogs/blog-category.controller";


export const blogRoute = Router();
export const blogCategoryRoute = Router();

blogRoute.route("/").get(getAllBlog).post(createBlog);
blogRoute
    .route("/:id")
    .get(getBlog)
    .patch(updateBlog)
    .delete(deleteBlog);

blogCategoryRoute.route("/").get(getBlogCategories).post(createBlogCategory);
blogCategoryRoute
    .route("/:id")
    .get(getBlogCategories)
    .patch(updateBlogCategory)
    .delete(deleteBlogCategory);