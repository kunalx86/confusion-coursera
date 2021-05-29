import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import { verifyUser, verifyAdmin } from "src/authenticate";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../../uploads/images`);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("You can upload files of type image"));
    }
    cb(null, true);
  }
})

const router = express.Router();

router.post('/', 
  verifyUser, 
  verifyAdmin, 
  upload.single('imageFile'), 
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.file);
    res.status(200).send(req.file);
  }
)
export default router;