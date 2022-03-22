import express from "express";
const projectRouter = express.Router();
import checkAuth from "./../middleware/checkAuth.js";
import {
  getProjects,
  newProject,
  getProject,
  updateProject,
  deleteProject,
  addCollaborators,
  deleteCollaborators,
  searchCollaborators,
} from "../controllers/projectController.js";

projectRouter.get("/", checkAuth, getProjects);
projectRouter.post("/", checkAuth, newProject);
projectRouter.get("/:id", checkAuth, getProject);
projectRouter.put("/:id", checkAuth, updateProject);
projectRouter.delete("/:id", checkAuth, deleteProject);
projectRouter.post("/collaborator", checkAuth, searchCollaborators);
projectRouter.post("/collaborator/:id", checkAuth, addCollaborators);
projectRouter.post("/delete-collaborator/:id", checkAuth, deleteCollaborators);

export default projectRouter;
