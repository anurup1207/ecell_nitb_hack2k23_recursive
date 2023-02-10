import { Response } from "express";
import Blogs from "../models/blogModel";
import Simillar from "../models/simillarBlog";
import { IReqAuth } from "../config/interface";
import mongoose from "mongoose";

const Pagination = (req: IReqAuth) => {
  let page = Number(req.query.page) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 4;
  let skip = (page - 1) * limit;
  return { page, limit, skip };
};
const Pagination1 = (req: IReqAuth) => {
  let page = Math.floor(Number(req.query.page) / 3 + 1) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 4;
  let skip = (page - 1) * limit;
  return { page, limit, skip };
};

const blogCtrl = {
  likeBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      const { blog } = req.body;
      await Blogs.findByIdAndUpdate(blog, {
        $inc: { like: 1 },
        $push: { likeuser: req.user._id },
      });
      return res.send("success");
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unlikeBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      const { blog } = req.body;
      await Blogs.findByIdAndUpdate(blog, {
        $inc: { like: -1 },
        $pull: { likeuser: req.user._id },
      });
      return res.send("success");
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  shareBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      const { blog } = req.body;
      const blog1 = await Blogs.findById(blog);
      if (blog1 && !blog1.shareuser.includes(req.user._id)) {
        blog1.shareuser.push(req.user._id);
        blog1.share = blog.share + 1;
      }
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  suggestEdit: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      const { blog } = req.body;
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  report: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      const { blog } = req.body;
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  simillarBlog: async (req: IReqAuth, res: Response) => {
    try {
      const page = Number(req.query.page);
      const skip = page * 8;
      const blog = req.query.blog?.toString();
      const Blogs = await Simillar.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(blog),
          },
        },
        {
          $unwind: "$recommending_list",
        },
        {
          $lookup: {
            from: "blogs",
            localField: "recommending_list",
            foreignField: "_id",
            as: "blog",
          },
        },
        {
          $unwind: "$blog",
        },
        {
          $project: {
            blog: "$blog",
            _id: 0,
          },
        },
        {
          $project: {
            _id: "$blog._id",
            views: "$blog.views",
            user: "$blog.user",
            title: "$blog.title",
            description: "$blog.description",
            thumbnail: "$blog.thumbnail",
            category: "$blog.category",
            createdAt: "$blog.createdAt",
            comment: "$blog.comment",
            like: "$blog.like",
            share: "$blog.share",
          },
        },
        {
          $lookup: {
            from: "users",
            let: {
              user_id: "$user",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$user_id"],
                  },
                },
              },
              {
                $project: {
                  follower: {
                    $size: "$follower",
                  },
                  following: {
                    $size: "$following",
                  },
                  name: 1,
                  avatar: 1,
                  about: 1,
                },
              },
            ],
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $lookup: {
            from: "categories",
            let: {
              user_id: "$category",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$user_id"],
                  },
                },
              },
            ],
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        { $skip: skip },
        { $limit: 8 },
      ]);
      return res.send(Blogs);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default blogCtrl;
