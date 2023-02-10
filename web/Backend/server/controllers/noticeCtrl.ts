import { Response } from "express";
import { IReqAuth } from "../config/interface";
import Users from "../models/userModel";
import Notice from "../models/noticeModel";

const Pagination = (req: IReqAuth) => {
  let page = Number(req.query.page) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 4;
  let skip = (page - 1) * limit;
  return { page, limit, skip };
};

const notificationCtrl = {
  getNotification: async (req: IReqAuth, res: Response) => {
    try {
      const notice = await Notice.aggregate([
        {
          $match: {
            user: req.user?._id,
          },
        },
        { $sort: { createdAt: -1 } },
        {
          $limit: 20,
        },
        {
          $project: {
            _id: 0,
            user: 0,
          },
        },
      ]);
      res.send({ notice });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  notificationRead: async (req: IReqAuth, res: Response) => {
    try {
      const notifications = await Users.findOneAndUpdate(
        {
          _id: req.user?._id,
        },
        {
          notice: false,
        }
      );
      res.send("updated");
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addNotification: async (
    user: string,
    msg: string,
    desc: string,
    url?: string
  ) => {
    console.log("run");
    const notice = new Notice({ user, msg, desc, url });
    const note = await notice.save();
    console.log(note);
    const notifications = await Users.findOneAndUpdate(
      {
        _id: user,
      },
      {
        notice: true,
      }
    );
    return;
  },
};

export default notificationCtrl;
