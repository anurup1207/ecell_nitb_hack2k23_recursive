import { Request, Response } from "express";
import Users from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  generateActiveToken,
  generateAccessToken,
  generateRefreshToken,
} from "../config/generateToken";
import sendMail from "../config/sendMail";
import { validateEmail } from "../middleware/vaild";
import {
  IDecodedToken,
  IUser,
  IUserParams,
  IReqAuth,
} from "../config/interface";
import { OAuth2Client } from "google-auth-library";
import notificationCtrl from "./noticeCtrl";

const client = new OAuth2Client(`${process.env.MAIL_CLIENT_ID}`);
const CLIENT_URL = `${process.env.BASE_URL}`;

const authCtrl = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, accountno, email , uidai } = req.body;

      const user = await Users.findOne({ email });
      if (user)
        return res
          .status(400)
          .json({ msg: "Email or Phone number already exists." });

      // const passwordHash = await bcrypt.hash(password, 12);

      const newUser = { name, accountno, email , uidai };

      const active_token = generateActiveToken({ newUser });

      const url = `${CLIENT_URL}/active/${active_token}`;

      if (validateEmail(email)) {
        sendMail(email, url, "Verify your email address");
        return res.json({ msg: "Success! Please check your email." });
      }
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  activeAccount: async (req: Request, res: Response) => {
    try {
      const { active_token } = req.body;

      const decoded = <IDecodedToken>(
        jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)
      );

      const { newUser } = decoded;

      if (!newUser)
        return res.status(400).json({ msg: "Invalid authentication." });

      const user = await Users.findOne({ account: newUser.account });
      if (user) return res.status(400).json({ msg: "Account already exists." });

      const new_user = new Users(newUser);

      const newuser = await new_user.save();

      notificationCtrl.addNotification(
        newuser._id,
        "Welcome! to Pediageeks world.",
        "Hii! " +
          " " +
          newuser.name +
          "on behalf of whole pediageek team we welcome you to the platform.Try each and every feature on platform make your own brand on the platform."
      );
      res.json({ msg: "Account has been activated!" });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { account, password } = req.body;

      const user = await Users.findOne({ account });
      if (!user)
        return res.status(400).json({ msg: "This account does not exits." });

      // if user exists
      loginUser(user, password, res);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });

    try {
      res.clearCookie("refreshtoken", { path: `/api/refresh_token` });

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          rf_token: "",
        }
      );

      return res.json({ msg: "Logged out!" });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { account } = req.body;

      const user = await Users.findOne({ account });
      if (!user)
        return res.status(400).json({ msg: "This account does not exist." });

      if (user.type !== "register")
        return res.status(400).json({
          msg: `Quick login account with ${user.type} can't use this function.`,
        });

      const access_token = generateAccessToken({ id: user._id });

      const url = `${CLIENT_URL}/reset_password/${access_token}`;

      if (validateEmail(account)) {
        sendMail(account, url, "Forgot password?");
        return res.json({ msg: "Success! Please check your email." });
      }
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const loginUser = async (user: IUser, password: string, res: Response) => {
  const isMatch = true; //here to call python api for validation

  if (!isMatch) {
    let msgError =
      user.type === "register"
        ? "Password is incorrect."
        : `Password is incorrect. This account login with ${user.type}`;

    return res.status(400).json({ msg: msgError });
  }

  const access_token = generateAccessToken({ id: user._id });
  const refresh_token = generateRefreshToken({ id: user._id }, res);

  await Users.findOneAndUpdate(
    { _id: user._id },
    {
      rf_token: refresh_token,
    }
  );
  const client = await Users.aggregate([
    {
      $match: {
        _id: user._id,
      },
    },
    {
      $project: {
        avatar: 1,
        role: 1,
        type: 1,
        name: 1,
        account: 1,
        password: "",
        createdAt: 1,
        updatedAt: 1,
        rf_token: 1,
        about: 1,
        follower: {
          $size: "$follower",
        },
        following: {
          $size: "$following",
        },
        blogcount: 1,
        referer: 1,
        notice: 1,
        preferance: 1,
        followinglist: "$following",
      },
    },
  ]);

  return res.json({
    msg: "Login Success!",
    access_token,
    user: client[0],
  });
};

const registerUser = async (user: IUserParams, res: Response) => {
  const newUser = new Users(user);

  const access_token = generateAccessToken({ id: newUser._id });
  const refresh_token = generateRefreshToken({ id: newUser._id }, res);

  const regUser = await newUser.save();
  notificationCtrl.addNotification(
    regUser._id,
    "Welcome! to Pediageeks world.",
    "Hii! " +
      " " +
      regUser.name +
      " on behalf of whole pediageek team we welcome you to the platform. Create your First blog and earn 200-250 Rs. on evry 1000 Views on your blog."
  );
  res.json({
    msg: "Registration success!",
    access_token,

    user: { ...regUser._doc, password: "" },
  });
};

export default authCtrl;
