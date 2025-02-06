const Category = require('../models/Category');


exports.createCategory = async (req, res) => {
    try {
        const { name, parentCategory } = req.body;
        const category = new Category({ name, parentCategory });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('parentCategory');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, parentCategory } = req.body;

        const category = await Category.findById(id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        category.name = name || category.name;
        category.parentCategory = parentCategory || category.parentCategory;

        await category.save();
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};