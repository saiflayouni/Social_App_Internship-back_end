import CategoryModel from '../models/category.js'

export async function checkIfCategoryExists(req, res, next) {
    if ((await CategoryModel.findOne({ _id: req.query.categoryId })) == null)
        return res.status(404).json({
            error: `Category with id ${req.query.categoryId} could not be found!`,

        })

    next()
}
