import { Request, Response } from "express";


const processImage = (req: Request, res: Response) => {
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    const file = url + "/api/v1/images/" + req.file?.filename;
    res.status(201).json({
      message: "Success",
      file: file,
    });
  } else {
    res.status(400).json("Please upload a valid image")
  }
}

const processFiles = (req: Request, res: Response) => {
  const files: { url: string }[] = [];
  const url = req.protocol + "://" + req.get("host");
  (req.files as Express.Multer.File[])?.forEach(file => {
    const file_url = url + "/api/v1/images/" + file.filename;
    files.push({
      url: file_url,
    });
  })
  res.status(201).json({
    message: "files saved successfully!",
    files,
  });
}

export default processImage;