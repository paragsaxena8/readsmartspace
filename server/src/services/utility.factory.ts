import { NextFunction, Request, Response } from 'express';
import catchAsync from '@utils/catchAsync';

export const uploadFileFactory = catchAsync((req: Request, res: Response, next: NextFunction) => {
    const { file } = req;
    if (!file) {
        console.log("No file received");
        return res.status(400).json({
            message: 'Error: No file received, please provide a file'
        });

    } else {
        console.log('file received');
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            return res.status(400).json({
                message: 'File type not supported'
            });
        } else if (file.size > 1000000) {
            return res.status(400).json({
                message: 'File size too large'
            });
        } else if (file.size <= 0) {
            return res.status(400).json({
                message: 'File is empty'
            });
        }
        return res.status(200).json({
            message: 'File uploaded successfully',
            fileName: file.filename
        })
    }
})
