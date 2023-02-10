import express from "express";
import followCtrl from "../controllers/followCtrl";
import auth from "../middleware/auth";

const router = express.Router();

router.post("/follow", auth, followCtrl.addFollowing);
router.patch("/follow", auth, followCtrl.removeFollowing);
router.get("/followerbyauth/:id", auth, followCtrl.sendFollowerlistbyAuth);
router.get("/followingbyauth/:id", auth, followCtrl.sendFollowinglistbyAuth);
router.get("/follower/:id", followCtrl.sendFollowerlist);
router.get("/following/:id", followCtrl.sendFollowinglist);
export default router;
