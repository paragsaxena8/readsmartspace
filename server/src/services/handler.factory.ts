import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import catchAsync from "../utils/catchAsync";
import { APIFeatures } from "@utils/apiFeatures";

export const getAll = (model: Model<any>, options?) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const excludeFields = {};
    const populateOptions = [];
    let filter = {};
    let query = req.query || {};
    console.log("🚀 ~ returncatchAsync ~ query:", query);
    if (options) {
      if (options.exclude && options.exclude.length > 0) {
        options.exclude.forEach((field) => {
          excludeFields[field] = 0;
        });
      }

      if (options.populate && options.populate.length > 0) {
        for (const field of options.populate) {
          populateOptions.push(field);
        }
      }
    }
    if (Object.keys(query).length > 0) {
      query.id ? (filter = { _id: query.id }) : null;
      query.category ? (filter = { category: query.category }) : null;
      query.user ? (filter = { author: { $eq: { _id: query.user } } }) : null;
      query.search
        ? (filter = { title: { $regex: query.search, $options: "i" } })
        : null;
    }

    const features = new APIFeatures(
      model.find(filter).populate(populateOptions),
      query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const data = await features.query;
    const data = await model
      .find(filter, excludeFields)
      .populate(populateOptions);
    res.status(200).json({
      status: 200,
      data,
    });
  });
};

export const getOne = (model: Model<any>, options?) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params);

    let exceptFields = {};
    if (options && options.exceptFields) {
      options.exceptFields.forEach((field) => {
        exceptFields[field] = 0;
      });
    }
    const data = await model.findById(req.params.id, exceptFields);
    res.status(200).json({
      status: 200,
      data,
    });
  });
};

export const createOne = (model: Model<any>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await model.create(req.body);
    res.status(201).json({
      status: 201,
      data,
    });
  });
};

export const updateOne = (model: Model<any>, options?) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 200,
      data,
    });
  });
};

export const deleteOne = (model: Model<any>, options?) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await model.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  });
};
