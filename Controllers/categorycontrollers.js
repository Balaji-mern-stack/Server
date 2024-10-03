const Category = require('../Models/categorymodels'); 

exports.create = async (req, res) => {
    try {
        const { category, description } = req.body;

        if (!category || !description) {
            return res.status(400).json({ message: 'Both category and description are required' });
        }

        const newCategory = new Category({ category, description });
        await newCategory.save();

        return res.status(201).json({ message: 'Category created successfully', data: newCategory });
    } catch (err) {
        console.error('Error creating category:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const categories = await Category.find({});
        return res.status(200).json({ message: 'Categories retrieved successfully', data: categories });
    } catch (err) {
        console.error('Error retrieving categories:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json({ message: 'Category retrieved successfully', data: category });
    } catch (err) {
        console.error('Error retrieving category:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, description } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(id, { category, description }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json({ message: 'Category updated successfully', data: updatedCategory });
    } catch (err) {
        console.error('Error updating category:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteone = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json({ message: 'Category deleted successfully', data: deletedCategory });
    } catch (err) {
        console.error('Error deleting category:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
