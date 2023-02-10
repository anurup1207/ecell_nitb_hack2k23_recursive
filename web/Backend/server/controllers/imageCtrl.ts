import { Response } from "express";
import Images from "../models/blogimageModel";
import { IReqAuth } from "../config/interface";

const imageCtrl = {
  saveImage: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });

    try {
      const { link, about, blog } = req.body;

      const newImage = new Images({
        user: req.user._id,
        link,
        about,
        blog,
      });
      await newImage.save();
      res.json({ msg: "saved!" });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default imageCtrl;
