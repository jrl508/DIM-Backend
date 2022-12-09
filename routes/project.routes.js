import express from "express";
import {
  createProject,
  findProjectsByUser,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/create", createProject);

router.get("/:userId", findProjectsByUser);

export default router;
