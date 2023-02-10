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
  IGgPayload,
  IUserParams,
  IReqAuth,
} from "../config/interface";
import { OAuth2Client } from "google-auth-library";
import notificationCtrl from "./noticeCtrl";
import Preferances from "../models/preferanceModel";

const client = new OAuth2Client(`${process.env.MAIL_CLIENT_ID}`);
const CLIENT_URL = `${process.env.BASE_URL}`;

const authCtrl = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, account, password, referer } = req.body;

      const user = await Users.findOne({ account });
      if (user)
        return res
          .status(400)
          .json({ msg: "Email or Phone number already exists." });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = { name, account, password: passwordHash, referer };

      const active_token = generateActiveToken({ newUser });

      const url = `${CLIENT_URL}/active/${active_token}`;

      if (validateEmail(account)) {
        sendMail(account, url, "Verify your email address");
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
      if (newuser.referer !== "")
        notificationCtrl.addNotification(
          newuser.referer,
          "Referal Update 🎁🎁.",
          "Hii! " +
            newuser.name +
            " have joined using your refral link tell him to write his first blog to earn referal reward both.",
          "/profile/" + newuser._id
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
  refreshToken: async (req: Request, res: Response) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: "Please login now!" });

      const decoded = <IDecodedToken>(
        jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)
      );
      if (!decoded.id)
        return res.status(400).json({ msg: "Please login now!" });

      const user = await Users.findById(decoded.id).select(
        "-password +rf_token"
      );
      if (!user)
        return res.status(400).json({ msg: "This account does not exist." });

      if (rf_token !== user.rf_token)
        return res.status(400).json({ msg: "Please login now!" });

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

      const pref = await Preferances.findOne({
        _id: user._id,
      }).select(["-_id", "-interest", "-categoryid"]);

      return res.json({
        msg: "Login Success!",
        access_token,
        user: { ...client[0], ...pref },
      });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  googleLogin: async (req: Request, res: Response) => {
    try {
      const { id_token } = req.body;
      const referer = req.body.referer?.referer;

      const verify = await client.verifyIdToken({
        idToken: id_token,
        audience: `${process.env.MAIL_CLIENT_ID}`,
      });

      const { email, email_verified, name, picture } = <IGgPayload>(
        verify.getPayload()
      );

      if (!email_verified)
        return res.status(500).json({ msg: "Email verification failed." });

      const password = email + " @ 67 love u baby@ #";
      const passwordHash = await bcrypt.hash(password, 12);

      const user = await Users.findOne({ account: email });

      if (user) {
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

        const pref = await Preferances.findOne({
          _id: user._id,
        }).select(["-_id", "-interest", "-categoryid"]);

        return res.json({
          msg: "Login Success!",
          access_token,
          user: { ...client[0], ...pref },
        });
      } else {
        const user = {
          name: name.slice(0, 29),
          account: email,
          password: passwordHash,
          avatar: picture,
          type: "google",
          referer: referer,
        };
        registerUser(user, res);
      }
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
  const isMatch = await bcrypt.compare(password, user.password);

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

  const pref = await Preferances.findOne({
    _id: user._id,
  }).select(["-_id", "-interest", "-categoryid"]);

  return res.json({
    msg: "Login Success!",
    access_token,
    user: { ...client[0], ...pref },
  });
};

const registerUser = async (user: IUserParams, res: Response) => {
  const newUser = new Users(user);

  const access_token = generateAccessToken({ id: newUser._id });
  const refresh_token = generateRefreshToken({ id: newUser._id }, res);

  newUser.rf_token = refresh_token;
  const regUser = await newUser.save();
  notificationCtrl.addNotification(
    regUser._id,
    "Welcome! to Pediageeks world.",
    "Hii! " +
      " " +
      regUser.name +
      " on behalf of whole pediageek team we welcome you to the platform. Create your First blog and earn 200-250 Rs. on evry 1000 Views on your blog."
  );
  if (regUser.referer !== "")
    notificationCtrl.addNotification(
      regUser.referer,
      "Referal Update 🎁🎁.",
      "Hii! " +
        regUser.name +
        " have joined using your refral link tell him to write his first blog to earn referal reward both.",
      "/profile/" + regUser._id
    );
  res.json({
    msg: "Registration success!",
    access_token,

    user: { ...regUser._doc, password: "" },
  });
};

export default authCtrl;
