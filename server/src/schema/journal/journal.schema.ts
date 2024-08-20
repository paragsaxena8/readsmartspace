import { Schema, model } from "mongoose";

const journalSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    content: {
        type: String,
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
        type: Buffer
    },
    addedBy: {
        type: String,
        required: [true, "Added by is required"],
    },
    tags: {
        type: [String],
        required: [true, "Tags are required"],
    },
    status: {
        type: String,
        enum: ["draft", "public"],
        default: "draft",
    }
});

export const Journal = model("Journal", journalSchema);