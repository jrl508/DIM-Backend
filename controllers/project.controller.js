import Project from "../models/project.model.js";

export const createProject = async (req, res) => {
  console.log("CREATE PROJECT CALLED");
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
