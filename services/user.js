const { get } = require('mongoose');
const User = require('../models/User');

const createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

const updateUser = async (userId, updatedData) => {
  return await User.findByIdAndUpdate(userId, updatedData, { new: true });
};

const deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

const getAllUsers = async () => {
    return await User.find();
  };
module.exports = { createUser, updateUser, deleteUser,getAllUsers };
