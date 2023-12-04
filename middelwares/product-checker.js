import ProductModel from '../models/product.js'

export async function checkIfProductExists(req, res, next) {
    const { id } = req.params ?? req.query

    if ((await ProductModel.findOne({ _id: id })) == null)
        return res.status(404).json({ error: `Product with id ${id} could not be found!` })

    next()
}
