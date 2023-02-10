import express from "express";
import auth from "../middleware/auth";
import dataCtrl from "../controllers/dataCtrl";

const router = express.Router();

router.post("/preferance", auth, dataCtrl.setPreferance);
router.post("/addcountry", auth, dataCtrl.addcountry);
router.get("/searchcountry", dataCtrl.searchcountry);
router.post("/addstate", auth, dataCtrl.addstate);
router.get("/searchstate", dataCtrl.searchstate);
router.post("/addcity", auth, dataCtrl.addcity);
router.get("/searchcity", dataCtrl.searchcity);
router.post("/addwork", auth, dataCtrl.addwork);
router.get("/searchwork", dataCtrl.searchwork);
router.post("/addaspire", auth, dataCtrl.addwork);
router.get("/searchaspire", dataCtrl.searchwork);
router.post("/addorganization", auth, dataCtrl.addorganization);
router.get("/searchorganization", dataCtrl.searchorganization);
router.post("/updateotherinfo", auth, dataCtrl.updateOtherinfo);
router.post("/updatelocation", auth, dataCtrl.updateLocation);


export default router;
