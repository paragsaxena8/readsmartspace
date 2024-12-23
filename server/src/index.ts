import { connect } from "mongoose";
import "dotenv/config";
import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";
import cors from "cors";

import { protect } from "./controllers/auth/auth.controller";
import {
  blogCategoryRoute,
  blogRoute,
  blogTagsRoutes,
} from "./routes/blogs/blog.routes";
import { reviewRoutes } from "./routes/book-review/book-review.routes";
import { journalRoutes } from "./routes/journal/journal.routes";
import { bookRoutes } from "./routes/book-review/book.routes";
import { authRoutes } from "./routes/auth.route";
import { uploadFile } from "@utils/storage";
import { uploadFileFactory } from "@services/utility.factory";
import { globalErrorHandler } from "@services/error-controller.factory";

const app = express();

// Middleware
app.use(cookieParser());

app.use(cors({ origin: true, credentials: true }));
// body parser middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(compression());
app.use(morgan("dev"));

app.get("/", (_req: any, res: any) => {
  res.send("Hello World!");
  res.end();
});

app.post("/upload", uploadFile.single("file"), uploadFileFactory);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/blogs", blogRoute);
app.use("/api/v1/blog-categories", blogCategoryRoute);
app.use("/api/v1/blog-tags", blogTagsRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/book-reviews", reviewRoutes);
app.use("/api/v1/journals", journalRoutes);

app.use(globalErrorHandler);

// connect to mongodb
const run = async () => {
  try {
    await connect(process.env.DB_SERVER_HOST as string);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Unable to connect to mongoose", error);
  }
};

// Start the server
app.listen(process.env.port, () => {
  console.log(`Server is running on port ${process.env.port}`);
  run();
});
