const userService = require('../services/user');
const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getAllUsers = async (req, res) => {
    try {
      res.status(200).json(res.pagination);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
module.exports = { createUser, updateUser, deleteUser,getAllUsers };
