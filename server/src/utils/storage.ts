import multer, { diskStorage } from "multer";

const storage = diskStorage({
  destination: function (req, file, callback) {
    callback(null, "src/uploads");
  },
  filename: function (req, file, callback) {
    file.fieldname = `image-${file.originalname.slice(0, 9)}.png`;
    callback(null, file.fieldname);
  },
});

export const uploadFile = multer({ dest: "../uploads", storage });
