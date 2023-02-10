import { Request, Response } from "express";
import { IReqAuth } from "../config/interface";
import Users from "../models/userModel";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userCtrl = {
  updateUser: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });

    try {
      const { avatar, name, about, paytm } = req.body;

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          avatar,
          name,
          paytm,
          about,
        }
      );
      res.json({ msg: "Update Success!" });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });

    if (req.user.type !== "register")
      return res.status(400).json({
        msg: `Quick login account with ${req.user.type} can't use this function.`,
      });

    try {
      const { password } = req.body;
      const passwordHash = await bcrypt.hash(password, 12);

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          password: passwordHash,
        }
      );

      res.json({ msg: "Reset Password Success!" });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req: Request, res: Response) => {
    try {
      const user = await Users.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.params.id),
          },
        },
        {
          $project: {
            avatar: 1,
            role: 1,
            name: 1,
            account: 1,
            about: 1,
            createdAt: 1,
            updatedAt: 1,
            follower: {
              $size: "$follower",
            },
            following: {
              $size: "$following",
            },
            blogcount: 1,
          },
        },
      ]);
      if (!user[0]) return res.status(404).json({ msg: "Invalid ID." });
      res.json(user[0]);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserbyauth: async (req: IReqAuth, res: Response) => {
    if (!req.user) return res.json();
    try {
      const user = await Users.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.params.id),
          },
        },
        {
          $project: {
            avatar: 1,
            role: 1,
            name: 1,
            account: 1,
            about: 1,
            createdAt: 1,
            updatedAt: 1,
            follower: {
              $size: "$follower",
            },
            following: {
              $size: "$following",
            },
            blogcount: 1,
          },
        },
      ]);
      if (!user[0]) return res.status(404).json({ msg: "Invalid ID." });
      res.json(user[0]);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },

  searchUsersbyauth: async (req: IReqAuth, res: Response) => {
    if (!req.user) return res.json();
    try {
      const users = await Users.aggregate([
        {
          $search: {
            index: "user_search",
            text: {
              query: req.query.title,
              path: {
                wildcard: "*",
              },
              fuzzy: {},
            },
          },
        },
        {
          $project: {
            avatar: 1,
            role: 1,
            name: 1,
            about: 1,
            follower: {
              $size: "$follower",
            },
            following: {
              $size: "$following",
            },
            blogcount: 1,
          },
        },
        { $limit: 8 },
      ]);

      if (!users.length)
        return res.status(400).json({ msg: "No Users with this name." });
      res.json(users);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  searchUsers: async (req: Request, res: Response) => {
    try {
      const users = await Users.aggregate([
        {
          $search: {
            index: "user_search",
            text: {
              query: req.query.title,
              path: {
                wildcard: "*",
              },
              fuzzy: {},
            },
          },
        },
        {
          $project: {
            avatar: 1,
            role: 1,
            name: 1,
            about: 1,
            follower: {
              $size: "$follower",
            },
            following: {
              $size: "$following",
            },
            blogcount: 1,
          },
        },
        { $limit: 8 },
      ]);

      if (!users.length)
        return res.status(400).json({ msg: "No Users with this name." });
      res.json(users);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
export default userCtrl;
