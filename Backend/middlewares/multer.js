// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     const filename = Date.now() + "-" + file.originalname;
//     cb(null, filename);
//   },
// });

// export const upload = multer({
//   storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024 * 5,
//   },
// });



import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.resolve("uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});
