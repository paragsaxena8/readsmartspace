import { NextFunction, Request, Response } from "express";
import { Journal } from "@schema/journal/journal.schema";
import catchAsync from "@utils/catchAsync";
import { getAll, getOne, updateOne, deleteOne } from "@services/handler.factory";

export const getAllJournals = getAll(Journal, {
    exclude: ["__v", "content"],
});

export const getJournal = getOne(Journal, {
    exclude: ["__v"],
});

export const createJournal = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { title, content, addedBy, tags } = req.body;

        const data = await Journal.create({
            title,
            content,
            addedBy,
            tags
        });
        res.status(201).json({
            status: 201,
            data,
        });
    }
);

export const updateJournal = updateOne(Journal);

export const deleteJournal = deleteOne(Journal);