import { Schema, model } from "mongoose";

const blogSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    min: [10, "Title should be at least 10 characters"],
  },
  slug: {
    type: String,
    required: [true, "Slug is required"],
    unique: true,
  },
  content: {
    type: Array,
    required: [true, "Content is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  featuredImage: {
    type: Buffer,
  },
  categories: {
    type: Schema.Types.ObjectId,
    ref: "BlogCategory",
    required: [true, "Categories is required"],
  },
  tags: {
    type: [Schema.Types.ObjectId],
    ref: "BlogTags",
    required: [true, "Tags is required"],
  },
  status: {
    type: String,
    enum: ["draft", "public"],
    default: "public",
  },
  author: {
    // type: String,
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required"],
  },
  excerpt: {
    type: String,
    min: [20, "Excerpt should be at least 20 characters"],
  },
});

// Pre save middleware before validating
blogSchema.pre("validate", function (next) {
  this.slug =
    typeof this.title === "string"
      ? this.title.split(" ").join("-").toLowerCase()
      : "";
  next();
});

export const Blog = model("Blog", blogSchema);
