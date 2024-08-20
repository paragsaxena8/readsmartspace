import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
    },
    description: {
        type: String
    },
    slug: {
        type: String,
        required: [true, "Slug is required"],
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Pre save middleware before validating
categorySchema.pre("validate", function (next) {
    this.slug = typeof this.name === 'string' ? this.name.split(" ").join("-").toLowerCase() : '';
    next();
});

export const BlogCategory = model("BlogCategory", categorySchema);