import { Schema, model } from "mongoose";

const tagSchema = new Schema({
  name: {
    type: String,
    required: [true, "Tag name is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const BlogTags = model("BlogTags", tagSchema);
