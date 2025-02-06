const categoryService = require('../services/category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Failed to create category' });
    }
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(404).json({ error: 'Category not found' });
    } else {
      return res.status(500).json({ error: 'Failed to update category' });
    }
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(404).json({ error: 'Category not found' });
    } else {
      return res.status(500).json({ error: 'Failed to delete category' });
    }
  }
};