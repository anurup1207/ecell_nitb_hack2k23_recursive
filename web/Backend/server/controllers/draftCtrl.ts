import { Request, Response } from "express";
import Drafts from "../models/draftModel";
import Blogs from "../models/blogModel";
import { IReqAuth } from "../config/interface";
import mongoose from "mongoose";

const Pagination = (req: IReqAuth) => {
  let page = Number(req.query.page) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 4;
  let skip = (page - 1) * limit;

  return { page, limit, skip };
};

const draftCtrl = {
  createDraft: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });

    try {
      const { title, content, description, thumbnail, category } = req.body;

      var newBlog;
      if (category)
        newBlog = new Drafts({
          user: req.user._id,
          title: title.toLowerCase(),
          content,
          description,
          thumbnail,
          category,
        });
      else
        newBlog = new Drafts({
          user: req.user._id,
          title: title.toLowerCase(),
          content,
          description,
          thumbnail,
        });

      await newBlog.save();
      res.json({
        ...newBlog._doc,
        user: req.user,
      });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getDraftsByUser: async (req: IReqAuth, res: Response) => {
    const { limit, skip } = Pagination(req);
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      const Data = await Drafts.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  user: mongoose.Types.ObjectId(req.params.id),
                },
              },
              // User
              {
                $lookup: {
                  from: "users",
                  let: { user_id: "$user" },
                  pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                    { $project: { password: 0 } },
                  ],
                  as: "user",
                },
              },
              // array -> object
              { $unwind: "$user" },
              // Sorting
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [
              {
                $match: {
                  user: mongoose.Types.ObjectId(req.params.id),
                },
              },
              { $count: "count" },
            ],
          },
        },
        {
          $project: {
            count: { $arrayElemAt: ["$totalCount.count", 0] },
            totalData: 1,
          },
        },
      ]);

      const blogs = Data[0].totalData;
      const count = Data[0].count;

      // Pagination
      let total = 0;

      if (count % limit === 0) {
        total = count / limit;
      } else {
        total = Math.floor(count / limit) + 1;
      }

      res.json({ blogs, total });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateDraft: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });

    try {
      const blog = await Drafts.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        req.body
      );

      if (!blog)
        return res.status(400).json({ msg: "Invalid Authentication." });

      res.json({ msg: "Update Success!", blog });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getDraft: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      let blog = await Drafts.findOne({
        _id: req.params.id,
        user: req.user._id,
      });
      if (!blog) return res.status(400).json({ msg: "Blog does not exist." });
      return res.json(blog);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteDraft: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });

    try {
      // Delete Blog
      const blog = await Drafts.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
      if (!blog)
        return res.status(400).json({ msg: "Invalid Authentication." });
      res.json({ msg: "Delete Success!" });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteDraftcreateBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });

    try {
      // Delete Blog
      const draft = await Drafts.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
      if (!draft) return res.status(400).json({ msg: "No draft found." });
      const blog = new Blogs({
        id: draft._id,
        user: draft.user,
        ...req.body,
      });
      blog.save();
      draft.delete();
      res.json({ msg: "Blog created and draft deleted !" });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default draftCtrl;
