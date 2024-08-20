import { Schema, model } from "mongoose";
let SummarizerManager = require("node-summarizer").SummarizerManager;

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
    type: String,
    required: [true, "Content is required"],
    min: [50, "Content should be at least 50 characters"],
  },
  shortSummary: {
    type: String,
    max: 20,
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
    // type: [Schema.Types.ObjectId],
    // ref: "BlogCategory",
    type: [String],
    required: [true, "Categories is required"],
  },
  tags: {
    type: [String],
    required: [true, "Tags is required"],
  },
  status: {
    type: String,
    enum: ["draft", "public"],
    default: "public",
  },
  author: {
    // type: Schema.Types.ObjectId,
    // ref: "User",
    type: String,
    required: [true, "Author is required"],
  },
  excerpt: {
    type: String,
    required: [true, "Excerpt is required"],
    min: [20, "Excerpt should be at least 20 characters"],
  },
});

// Pre save middleware before validating
blogSchema.pre("validate", function (next) {
  this.slug =
    typeof this.title === "string"
      ? this.title.split(" ").join("-").toLowerCase()
      : "";

  let Summarizer = new SummarizerManager(this.content, 1);
  let summary = Summarizer.getSummaryByFrequency().summary;
  this.excerpt = summary;
  console.log(summary);
  next();
});

export const Blog = model("Blog", blogSchema);
