const express = require("express");
const { createCategory, getAllCategory, updateCategory, deleteCategory, getCategoryById } = require("../controller/category-controller.js");

const CategoryRouter = express.Router();

CategoryRouter.post('/', createCategory)
CategoryRouter.get('/', getAllCategory)
CategoryRouter.patch('/:id', updateCategory)
CategoryRouter.delete('/:id', deleteCategory)
CategoryRouter.get('/:id', getCategoryById)


module.exports = CategoryRouter;