import express from "express";
import notificationCtrl from "../controllers/noticeCtrl";
import auth from "../middleware/auth";
const router = express.Router();

router.get("/notification", auth, notificationCtrl.getNotification);
router.patch("/notification", auth, notificationCtrl.notificationRead);

export default router;