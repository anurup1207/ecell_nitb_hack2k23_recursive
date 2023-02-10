import { Request, Response } from "express";
import { IReqAuth } from "../config/interface";
import Preferances from "../models/preferanceModel";
import Users from "../models/userModel";
import Countries from "../models/countryModel";
import Cities from "../models/cityModel";
import States from "../models/stateModel";
import Works from "../models/workModel";
import bcrypt from "bcrypt";
import Organizations from "../models/organization";

const dataCtrl = {
  setPreferance: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      const { interests, categoryid } = req.body;
      await Preferances.findOneAndUpdate(
        { _id: req.user._id },
        { interest: interests, categoryid: categoryid },
        { upsert: true, new: true }
      );
      await Users.findOneAndUpdate({ _id: req.user._id }, { preferance: true });
      return res.status(200).json({ msg: "Updated Successfully." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addcountry: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      const { work } = req.body;
      const countri = new Countries({ name: work, user: req.user._id });
      const saved = countri.save();
      res.json(saved);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  searchcountry: async (req: IReqAuth, res: Response) => {
    try {
      let countries = await Countries.find({
        //updated only to convert to lower case.
        name: { $regex: `${req.query.country}`.toLocaleLowerCase() },
      }).limit(10);
      res.json(countries);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addcity: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      const { work } = req.body;
      const countri = new Cities({ name: work, user: req.user._id });
      const saved = countri.save();
      res.json(saved);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  searchcity: async (req: IReqAuth, res: Response) => {
    try {
      let cities = await Cities.find({
        //updated only to convert to lower case.
        name: { $regex: `${req.query.city}`.toLocaleLowerCase() },
      }).limit(10);
      res.json(cities);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addstate: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      const { work } = req.body;
      const countri = new States({ name: work, user: req.user._id });
      const saved = countri.save();
      res.json(saved);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  searchstate: async (req: IReqAuth, res: Response) => {
    try {
      let states = await States.find({
        //updated only to convert to lower case.
        name: { $regex: `${req.query.state}`.toLocaleLowerCase() },
      }).limit(10);

      res.json(states);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addwork: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      const { work } = req.body;
      const countri = new Works({ name: work, user: req.user._id });
      const saved = await countri.save();
      res.json(saved);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  searchwork: async (req: Request, res: Response) => {
    try {
      const works = await Works.find({
        //updated only to convert to lower case.
        name: { $regex: `${req.query.work}`.toLocaleLowerCase() },
      }).limit(10);
      console.log(works);
      res.json(works);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateOtherinfo: async (req: IReqAuth, res: Response) => {
    try {
      const works = await Preferances.findOneAndUpdate(
        { _id: req.user?._id },
        {
          work: req.body.work,
          aspire: req.body.aspire,
          birthday: req.body.birthday,
          gender: req.body.gender,
          organization: req.body.organization,
        },
        {
          upsert: true,
        }
      );
      res.json({ msg: "Information Update Success!" });
    } catch (error) {}
  },
  updateLocation: async (req: IReqAuth, res: Response) => {
    try {
      const works = await Preferances.findOneAndUpdate(
        { _id: req.user?._id },
        {
          locality: req.body.locality,
          city: req.body.city,
          state: req.body.state,
          country: req.body.country,
        },
        {
          upsert: true,
        }
      );
      res.json({ msg: "Location Update Success!" });
    } catch (error) {}
  },
  addorganization: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      let { work } = req.body;
      work = work.toLocaleLowerCase();
      const countri = new Organizations({ name: work, user: req.user._id });
      const saved = countri.save();
      res.json(saved);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  searchorganization: async (req: IReqAuth, res: Response) => {
    try {
      const countries = await Organizations.find({
        //updated only to convert to lower case.
        name: { $regex: `${req.query.organization}`.toLocaleLowerCase() },
      }).limit(10);
      res.json(countries);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
export default dataCtrl;
