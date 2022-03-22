import express from "express";
import checkAuth from "../middleware/checkAuth.js";

import {
  addTask,
  getTask,
  updateTask,
  deleteTask,
  changeState,
} from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.post("/", checkAuth, addTask);
taskRouter.get("/:id", checkAuth, getTask);
taskRouter.put("/:id", checkAuth, updateTask);
taskRouter.delete("/:id", checkAuth, deleteTask);
taskRouter.put("/state/:id", checkAuth, changeState);

export default taskRouter;
