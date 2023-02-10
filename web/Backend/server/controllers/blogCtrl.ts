import { Request, Response } from "express";
import Drafts from "../models/draftModel";
import Blogs from "../models/blogModel";
import Comments from "../models/commentModel";
import Preferances from "../models/preferanceModel";
import { IReqAuth } from "../config/interface";
import mongoose from "mongoose";
import notificationCtrl from "./noticeCtrl";

const Pagination = (req: IReqAuth) => {
  let page = Number(req.query.page) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 8;
  let skip = (page - 1) * limit;
  return { page, limit, skip };
};
const Pagination1 = (req: IReqAuth) => {
  let page = Math.floor(Number(req.query.page) / 3 + 1) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 8;
  let skip = (page - 1) * limit;
  return { page, limit, skip };
};

const blogCtrl = {
  createBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      const { title, content, description, thumbnail, category } = req.body;
      const newBlog = new Blogs({
        user: req.user._id,
        title: title.toLowerCase(),
        content,
        description,
        thumbnail,
        category,
      });
      await newBlog.save();
      req.user.blogcount = req.user.blogcount + 1;
      req.user.save();
      res.json({
        ...newBlog._doc,
        user: req.user,
      });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getHomeBlogs: async (req: Request, res: Response) => {
    const { limit, skip } = Pagination(req) || { 8: 0 };
    try {
      if (true) {
        let Data = await Blogs.aggregate([
          {
            $facet: {
              totalData: [
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
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
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                  },
                },
                {
                  $unwind: "$category",
                },
                {
                  $project: {
                    __v: 0,
                    earn: 0,
                    commentuser: 0,
                    likeuser: 0,
                    shareuser: 0,
                    content: 0,
                  },
                },
              ],
              totalCount: [
                {
                  $match: {},
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
      } else {
        let Data = await Blogs.aggregate([
          {
            $search: {
              index: "bogs_search",
              text: {
                query: [
                  "Raksha Bandhan",
                  "raksha bandhan ",
                  "rakshabandhan",
                  "rakhi",
                ],
                path: {
                  wildcard: "*",
                },
                fuzzy: {},
              },
            },
          },
          {
            $lookup: {
              from: "users",
              let: { user_id: "$user" },
              pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },

                {
                  $project: {
                    password: 0,
                    referer: 0,
                    type: 0,
                    rf_token: 0,
                  },
                },
              ],
              as: "user",
            },
          },
          // array -> object
          { $unwind: "$user" },
          // { $match: { $expr: { $eq: ["$user.role", "garnet"] } } },
          // Sorting
          { $limit: 8 },
          {
            $project: {
              earn: 0,
            },
          },
        ]);

        res.json({ blogs: Data, total: 150 });
      }
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getHomeBlogsBySearch: async (req: IReqAuth, res: Response) => {
    const { limit, skip } = Pagination1(req) || { 8: 0 };
    if (!req.user) return res.json({ blogs: [], total: 150 });
    try {
      const user = await Preferances.findById(req.user._id);
      if (!user?.interest) return res.json({ blogs: [], total: 150 });
      const Data = await Blogs.aggregate([
        {
          $search: {
            index: "bogs_search",
            text: {
              query: user.interest,
              path: {
                wildcard: "*",
              },
              fuzzy: {},
            },
          },
        },
        { $skip: skip },
        { $limit: limit },
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
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $project: {
            __v: 0,
            earn: 0,
            commentuser: 0,
            likeuser: 0,
            shareuser: 0,
          },
        },
      ]);
      res.json({ blogs: Data, total: 150 });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getHomeBlogsByCategory: async (req: IReqAuth, res: Response) => {
    const { limit, skip } = Pagination1(req) || { 5: 0 };
    if (!req.user) return res.json({ blogs: [], total: 150 });
    try {
      const user = await Preferances.findById(req.user._id);
      if (!user || !user.interest) return res.json({ blogs: [], total: 150 });
      const Data = await Blogs.aggregate([
        // Sorting
        { $sort: { createdAt: -1 } },
        {
          $match: { $expr: { $in: ["$category", user.categoryid] } },
        },
        { $skip: skip },
        { $limit: limit },
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
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $project: {
            __v: 0,
            earn: 0,
            commentuser: 0,
            likeuser: 0,
            shareuser: 0,
          },
        },
      ]);
      res.json({ blogs: Data, total: 150 });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getBlogsByCategorySearchbyauth: async (req: IReqAuth, res: Response) => {
    const { limit, skip } = Pagination(req) || { 8: 0 };
    if (!req.user) return res.json({ blogs: [], total: 0 });
    try {
      const Data = await Blogs.aggregate([
        {
          $search: {
            index: "bogs_search",
            text: {
              query: req.query.search,
              path: {
                wildcard: "*",
              },
              fuzzy: {},
            },
            count: {
              type: "total",
            },
          },
        },
        {
          $project: {
            meta: "$$SEARCH_META",
            like: 1,
            share: 1,
            title: 1,
            content: 1,
            createdAt: 1,
            comment: 1,
            thumbnail: 1,
            description: 1,
            user: 1,
            views: 1,
            category: 1,
          },
        },
        { $skip: skip },
        { $limit: limit },
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
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
      ]);
      const total = Data.length > 0 ? Data[0].meta.count.total : 0;
      res.json({ blogs: Data, total });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getBlogsByCategorySearch: async (req: Request, res: Response) => {
    const { limit, skip } = Pagination(req) || { 8: 0 };
    try {
      const Data = await Blogs.aggregate([
        {
          $search: {
            index: "bogs_search",
            text: {
              query: req.query.search,
              path: {
                wildcard: "*",
              },
              fuzzy: {},
            },
            count: {
              type: "total",
            },
          },
        },
        {
          $project: {
            meta: "$$SEARCH_META",
            like: 1,
            share: 1,
            title: 1,
            content: 1,
            createdAt: 1,
            comment: 1,
            thumbnail: 1,
            description: 1,
            user: 1,
            views: 1,
            category: 1,
          },
        },
        { $skip: skip },
        { $limit: limit },
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
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
      ]);
      const total = Data.length > 0 ? Data[0].meta.count.total : 0;
      res.json({ blogs: Data, total });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getHomeBlogsByFollow: async (req: IReqAuth, res: Response) => {
    const { limit, skip } = Pagination1(req) || { 8: 0 };
    if (!req.user) return res.json({ blogs: [], total: 150 });
    try {
      // const user = await Users.findById(req.user._id);
      // if (!user) return res.json({ blogs: [], total: 150 });
      const Data = await Blogs.aggregate([
        {
          $match: { $expr: { $in: ["$user", req.user.following] } },
        },
        // Sorting
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
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
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $project: {
            __v: 0,
            earn: 0,
            commentuser: 0,
            likeuser: 0,
            shareuser: 0,
          },
        },
      ]);
      res.json({ blogs: Data, total: 150 });
    } catch (error: any) {
      return res.status(800).json({ msg: error.message });
    }
  },
  getBlogsByCategory: async (req: Request, res: Response) => {
    const { limit, skip } = Pagination(req) || { 8: 0 };
    try {
      const Data = await Blogs.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  category: mongoose.Types.ObjectId(req.params.id),
                },
              },
              // User
              {
                $lookup: {
                  from: "users",
                  let: { user_id: "$user" },
                  pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                    {
                      $project: {
                        password: 0,
                        referer: 0,
                        type: 0,
                        rf_token: 0,
                      },
                    },
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
              {
                $project: {
                  earn: 0,
                },
              },
            ],
            totalCount: [
              {
                $match: {
                  category: mongoose.Types.ObjectId(req.params.id),
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
  getBlogsByUser: async (req: Request, res: Response) => {
    const { limit, skip } = Pagination(req);
    try {
      const Data = await Blogs.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  user: mongoose.Types.ObjectId(req.params.id),
                },
              },
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
              {
                $lookup: {
                  from: "categories",
                  localField: "category",
                  foreignField: "_id",
                  as: "category",
                },
              },
              {
                $unwind: "$category",
              },
              {
                $project: {
                  earn: 0,
                },
              },
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

      res.json({ blogs, total: count });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getBlogsByUserbyauth: async (req: IReqAuth, res: Response) => {
    const { limit, skip } = Pagination(req);
    try {
      const Data = await Blogs.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  user: mongoose.Types.ObjectId(req.params.id),
                },
              },
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

      res.json({ blogs, total: count });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getBlogbyauth: async (req: IReqAuth, res: Response) => {
    if (!req.user) return res.json();
    try {
      let blog = await Blogs.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.params.id),
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
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $project: {
            __v: 0,
            earn: 0,
            commentuser: 0,
            shareuser: 0,
          },
        },
      ]);
      if (!blog) return res.status(400).json({ msg: "Blog does not exist." });
      res.json(blog[0]);
      const newBlog = await Blogs.findByIdAndUpdate(blog[0]._id, {
        views: blog[0].views + 1,
      });
      if (blog[0].views === 20) {
        notificationCtrl.addNotification(
          blog[0].user,
          "Your blog is trending 🎉",
          " Your Blog : " +
            blog[0].title +
            " reached a milestone of " +
            blog[0].views +
            " views. Keep sharing and earning.",
          "/blog/" + blog[0]._id
        );
      }
      if (blog[0].views && blog[0].views % 100 === 0) {
        notificationCtrl.addNotification(
          blog[0].user,
          "Your blog is trending 🎉",
          " Your Blog : " +
            blog[0].title +
            " reached a milestone of " +
            blog[0].views +
            " views. Keep sharing and earning.",
          "/blog/" + blog[0]._id
        );
      }
      return;
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getBlog: async (req: Request, res: Response) => {
    try {
      let blog = await Blogs.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.params.id),
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
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $project: {
            __v: 0,
            earn: 0,
            commentuser: 0,
            shareuser: 0,
          },
        },
      ]);
      if (!blog) return res.status(400).json({ msg: "Blog does not exist." });
      res.json(blog[0]);
      const newBlog = await Blogs.findByIdAndUpdate(blog[0]._id, {
        views: blog[0].views + 1,
      });
      if (blog[0].views === 20) {
        notificationCtrl.addNotification(
          blog[0].user,
          "Your blog is trending 🎉",
          " Your Blog : " +
            blog[0].title +
            " reached a milestone of " +
            blog[0].views +
            " views. Keep sharing and earning.",
          "/blog/" + blog[0]._id
        );
      }
      if (blog[0].views % 100 === 0 && blog[0].views > 0) {
        notificationCtrl.addNotification(
          blog[0].user,
          "Your blog is trending 🎉",
          " Your Blog : " +
            blog[0].title +
            " reached a milestone of " +
            blog[0].views +
            " views. Keep sharing and earning.",
          "/blog/" + blog[0]._id
        );
      }
      return;
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });

    try {
      const blog = await Blogs.findOneAndUpdate(
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
  deleteBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });

    try {
      // Delete Blog
      const blog = await Blogs.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!blog)
        return res.status(400).json({ msg: "Invalid Authentication." });

      // Delete Comments
      await Comments.deleteMany({ blog_id: blog._id });

      res.json({ msg: "Delete Success!" });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createDraftdeleteBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      const draft = await Blogs.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
      if (!draft) return res.status(400).json({ msg: "No draft found." });
      const blog = new Drafts({
        id: draft._id,
        user: draft.user,
        ...req.body,
      });
      blog.save();
      // draft.delete();
      res.json({ msg: "Blog created and draft deleted !" });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  searchBlogs: async (req: Request, res: Response) => {
    try {
      const blogs = await Blogs.aggregate([
        {
          $search: {
            index: "bogs_search",
            text: {
              query: req.query.title,
              path: {
                wildcard: "*",
              },
              fuzzy: {},
            },
          },
        },
        { $limit: 8 },
        {
          $project: {
            earn: 0,
          },
        },
      ]);

      if (!blogs.length) return res.status(400).json({ msg: "No Blogs." });
      res.json(blogs);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default blogCtrl;
