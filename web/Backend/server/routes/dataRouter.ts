import express from "express";
import auth from "../middleware/auth";
import dataCtrl from "../controllers/dataCtrl";

const router = express.Router();

router.post("/addorganization", auth, dataCtrl.addorganization);


export default router;
