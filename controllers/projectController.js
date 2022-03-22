import Project from "../models/project.js";
import User from "../models/user.js";

const getProjects = async (req, res) => {
  try {
    const resp = await Project.find({
      $or: [
        { collaborators: { $in: req.user._id } },
        { author: { $in: req.user._id } },
      ],
    });

    res.status(200).json({ projects: resp });
  } catch (error) {
    res.status(400).json({ msg: `Error ${error}` });
  }
};

//! create new project
const newProject = async (req, res) => {
  const { name, description, client, dateDelivery } = req.body;

  try {
    const project = new Project({
      name,
      description,
      client,
      dateDelivery,
      author: req.user._id,
    });

    await project.save();

    res
      .status(200)
      .json({ msg: "Project created successfully", body: project });
  } catch (error) {
    res.status(400).json({ msg: "Could not create" });
  }
};

//!get one project

const getProject = async (req, res) => {
    //* get projects by id
  try {
    const resp = await Project.findById(req.params.id)
      .populate({path: "task", populate: {path: "complete", select: "name"}})
      .populate("collaborators", "name email");

    if (!resp) {
      return res.status(404).json({ msg: "project not found" });
    }

    // verify if the project have user or collaborators permitted
    if (
      resp.author.toString() !== req.user._id.toString() &&
      !resp.collaborators.some(
        (col) => col._id.toString() === req.user._id.toString()
      )
    ) {
      return res.status(404).json({ msg: "project not found" });
    }

    return res.status(200).json({ project: resp });
  } catch (error) {
    res.status(400).json({ msg: `Error ${error}` });
  }
};

//! update project

const updateProject = async (req, res) => {
  try {
    const resp = await Project.findById(req.params.id);

    if (!resp) {
      return res.status(404).json({ msg: "project not found" });
    }

    if (resp.author.toString() !== req.user._id.toString()) {
      return res.status(404).json({ msg: "project not found" });
    }

    const update = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.status(200).json({ project: update });
  } catch (error) {
    res.status(400).json({ msg: `Error ${error}` });
  }
};

//!delete project

const deleteProject = async (req, res) => {
  try {
    const resp = await Project.findById(req.params.id);

    if (!resp) {
      return res.status(404).json({ msg: "project not found" });
    }

    if (resp.author.toString() !== req.user._id.toString()) {
      return res.status(404).json({ msg: "permission denied" });
    }

    await Project.findByIdAndDelete(req.params.id);

    return res.status(200).json({ msg: "Project deleted" });
  } catch (error) {
    res.status(400).json({ msg: `Error ${error}` });
  }
};

//! search Collaborator
const searchCollaborators = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select(
    "-password -token -__v -updatedAt -createdAt -confirmed"
  );
  if (!user) {
    return res.status(404).json({ msg: "User is not find" });
  }
  return res.status(200).json(user);
};

//! add collaborator
const addCollaborators = async (req, res) => {
  //*verify if project exists
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ msg: "Project is no find" });
  }

  //* if you are not the author you cannot add collaborator
  if (project.author.toString() !== req.user._id.toString()) {
    return res.status(400).json({ msg: "Action not allowed" });
  }

  //* find user
  const { email } = req.body;

  const user = await User.findOne({ email }).select(
    "-password -token -__v -updatedAt -createdAt -confirmed"
  );
  if (!user) {
    return res.status(404).json({ msg: "User is not find" });
  }

  //* the author cannot be added as a collaborator
  if (project.author.toString() === user._id.toString()) {
    return res
      .status(400)
      .json({ msg: "The creator of the project cannot be a collaborator" });
  }

  //* the collaborator already exists
  if (project.collaborators.includes(user._id)) {
    return res.status(400).json({ msg: "The collaborator already exist" });
  }

  project.collaborators.push(user._id);
  project.save();
  return res
    .status(200)
    .json({ msg: "The collaborator was added successfully" });
};

//! delete colaborator
const deleteCollaborators = async (req, res) => {
  //*verify if project exists
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ msg: "Project is no find" });
  }

  project.collaborators.pull(req.body.id);
  await project.save();

  return res.status(200).json({ msg: "Colaborator deleted" });
};

export {
  searchCollaborators,
  getProjects,
  newProject,
  getProject,
  updateProject,
  deleteProject,
  addCollaborators,
  deleteCollaborators,
};
