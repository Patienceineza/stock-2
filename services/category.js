const Category = require('../models/Category');

const getCategories = async () => {
  return await Category.find().populate('parent');
};

const createCategory = async (categoryData) => {
  const newCategory = new Category(categoryData);
  return await newCategory.save();
};

const updateCategory = async (id, categoryData) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new Error('Category not found');
  }

  Object.assign(category, categoryData);
  return await category.save();
};

const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new Error('Category not found');
  }

  return await category.remove();
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };