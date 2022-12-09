import { isObjectIdOrHexString } from "mongoose";
import Project from "../models/project.model.js";

export const createProject = async (req, res) => {
  const { user, title, type, description, supplies } = req.body;

  const newProject = new Project({
    user,
    title,
    type,
    description,
    supplies,
    steps: [],
    status: 0,
  });

  newProject.save();

  res.status(201).json({ message: "Project Created" });
};

export const findProjectsByUser = async (req, res) => {
  const user = req.params.userId;

  console.log(user);

  await Project.find({ user })
    .then((result) => {
      console.log(result);
      return res.json({ projects: result });
    })
    .catch((err) => {
      console.log(err);
      return res.json({ message: err });
    });
};
