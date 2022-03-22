import Task from "./../models/task.js";
import Project from "../models/project.js";

//! Add task
const addTask = async (req, res) => {
  const { name, dateDelivery, description, priority, project } = req.body;

  const projectResp = await Project.findById(project);

  if (!projectResp) {
    return res.status(404).json({ msg: "Project not exist" });
  }
  if (projectResp.author.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ msg: "You don't have permission to add task" });
  }

  try {
    const task = new Task({
      name,
      dateDelivery,
      description,
      priority,
      project,
      author: req.user._id,
    });
    res.status(200).json({ msg: "Task created", task });
    await task.save();
    projectResp.task.push(task._id);
    await projectResp.save();
  } catch (error) {
    console.log("erro", error);
  }
};

//!get Task
const getTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ msg: "Task not exist" });
  }
  if (task.author.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ msg: "You don't have permission to add task" });
  }

  res.status(200).json(task);
};

//!update Task
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ msg: "Task not exist" });
  }
  if (task.author.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ msg: "You don't have permission to add task" });
  }

  const respUpdate = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(respUpdate);
};

//! delete task
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ msg: "Task not exist" });
  }
  if (task.author.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ msg: "You don't have permission to add task" });
  }

  try {
    const project = await Project.findById(task.project);
    project.task.pull(task._id);

    await Promise.allSettled([
      await project.save(),
      await Task.findByIdAndDelete(req.params.id),
    ]);

    return res.status(200).json({ msg: " task delete" });
  } catch (error) {
    console.log(error);
  }
};

//!chanfe state task
const changeState = async (req, res) => {
  let task = await Task.findById(req.params.id).populate("project").populate("complete");

  if (!task) {
    return res.status(404).json({ msg: "Task not exist" });
  }

  if (
    task.author.toString() !== req.user._id.toString() &&
    !task.project.collaborators.some(
      (col) => col._id.toString() === req.user._id.toString()
    )
  ) {
    return res
      .status(403)
      .json({ msg: "You don't have permission to add task" });
  }

  task = await Task.findByIdAndUpdate(
    req.params.id,
    { state: !task.state, complete: req.user._id },
    { new: true }
  );

  let newTask = await Task.findById(req.params.id).populate("project").populate("complete");
  
  res.json(newTask);
};

export { addTask, getTask, updateTask, deleteTask, changeState };
