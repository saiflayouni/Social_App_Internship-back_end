import CategoryModel from '../models/category.js'

export async function getCategories(req, res) {
    return res.status(200).json(await CategoryModel.find({ status: 1 }))
}

export async function getCategory(req, res) {
    const { name } = req.query

    const category = await CategoryModel.findOne({ name: name, status: 1 })

    return category != null
        ? res.status(200).json(category)
        : res.status(404).json({
              message: `Caregory with name ${name} could not be found!`,
          })
}

export async function addCategory(req, res) {
    const creationResult = await CategoryModel.create({
        name: req.body.name,
        status: req.body.status,
    })

    if (!creationResult) return res.status(500).json({ error: 'Category could not be created!' })

    return res.status(201).json({ message: 'Category created successfully!' })
}

export async function updateCategory(req, res) {
    const updateResult = await CategoryModel.updateOne(
        { _id: req.params.id },
        { name: req.body.name },
        { upsert: false }
    )

    if (updateResult.modifiedCount === 0) return res.status(400).json({ error: 'Could not update the category!' })

    return res.status(200).json({ message: 'Category updated successfully!' })
}

export async function deleteCategory(req, res) {
    const deleteResult = await CategoryModel.deleteOne({ _id: req.params.id })

    if (deleteResult.deletedCount === 0) return res.status(400).json({ error: 'Could not delete the category!' })

    return res.status(200).json({ message: 'Category deleted successfully!' })
}

export async function hideCategory(req, res) {
    const updateResult = await CategoryModel.updateOne({ _id: req.params.id }, { status: 0 })

    if (updateResult.modifiedCount === 0) return res.status(400).json({ error: 'Could not hide the category!' })

    return res.status(200).json({ message: 'Category hidden successfully!' })
}
