import { Request, Response } from "express";
import { IReqAuth } from "../config/interface";
import Users from "../models/userModel";
import notificationCtrl from "./noticeCtrl";
import mongoose from "mongoose";
const Pagination = (req: IReqAuth) => {
  let page = Number(req.query.page) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 8;
  let skip = (page - 1) * limit;
  return { page, limit, skip };
};

const followCtrl = {
  addFollowing: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      const addfollowing = req.body.id;
      const user = await Users.findOne({ _id: req.user._id });
      if (user) {
        user.following = user.following.concat(addfollowing);
        user.save();
      }
      const follow1 = await Users.findOne({ _id: addfollowing });
      if (follow1) {
        follow1.follower = follow1.follower.concat(req.user._id);
        notificationCtrl.addNotification(
          follow1._id,
          "Follower Update.",
          user?.name + " started following you.",
          "/profile/" + user?._id
        );
        if (follow1.follower.length === 20 || follow1.follower.length === 21)
          follow1.role = "garnet";
        if (follow1.follower.length === 500) follow1.role = "scholar";
        follow1.save();
      }
      return res.status(200).send(user?.notice);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  removeFollowing: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });

    try {
      const removefollowing = JSON.stringify(req.body.id);
      const user = await Users.findOne({ _id: req.user._id });

      if (user) {
        user.following = user.following.filter((following) => {
          return JSON.stringify(following) !== removefollowing;
        });
        await user.save();
      }
      const follow1 = await Users.findOne({ _id: req.body.id });
      if (follow1) {
        follow1.follower = follow1.follower.filter((follower) => {
          return JSON.stringify(follower) !== JSON.stringify(req.user?._id);
        });
        await follow1.save();
      }
      return res.status(200).send(user?.notice);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  sendFollowerlist: async (req: Request, res: Response) => {
    const { limit, skip } = Pagination(req);
    try {
      const Followers = await Users.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.params.id),
          },
        },
        {
          $unwind: "$follower",
        },
        {
          $project: {
            follower: 1,
            _id: 0,
          },
        },

        {
          $lookup: {
            from: "users",
            let: {
              user_id: "$follower",
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
          $project: {
            _id: "$follower",
            avatar: "$user.avatar",
            name: "$user.name",
            follower: "$user.follower",
            following: "$user.following",
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);
      return res.json(Followers);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  sendFollowinglist: async (req: Request, res: Response) => {
    const { limit, skip } = Pagination(req);
    try {
      const Following = await Users.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.params.id),
          },
        },
        {
          $unwind: "$following",
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: "users",
            let: {
              user_id: "$following",
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
          $project: {
            _id: "$following",
            avatar: "$user.avatar",
            name: "$user.name",
            follower: "$user.follower",
            following: "$user.following",
          },
        },
      ]);
      return res.json(Following);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  sendFollowerlistbyAuth: async (req: IReqAuth, res: Response) => {
    const { limit, skip } = Pagination(req);
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      const Follower = await Users.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.params.id),
          },
        },
        {
          $unwind: "$follower",
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: "users",
            let: {
              user_id: "$follower",
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
          $project: {
            _id: "$follower",
            avatar: "$user.avatar",
            name: "$user.name",
            follower: "$user.follower",
            following: "$user.following",
          },
        },
      ]);
      return res.json(Follower);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  sendFollowinglistbyAuth: async (req: IReqAuth, res: Response) => {
    const { limit, skip } = Pagination(req);
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      const Following = await Users.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.params.id),
          },
        },
        {
          $unwind: "$following",
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: "users",
            let: {
              user_id: "$following",
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
          $project: {
            _id: "$user._id",
            avatar: "$user.avatar",
            name: "$user.name",
            follower: "$user.follower",
            following: "$user.following",
          },
        },
      ]);
      return res.json(Following);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default followCtrl;
