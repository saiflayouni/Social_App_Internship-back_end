import ProductModel from '../models/product.js'
import CategoryModel from '../models/category.js'
import UserModel from '../models/user.js'
import { deletImage } from '../services/imageDel.js'

export async function getProducts(req, res) {
    const pageSize = 10
    const page = req.query.page ?? 1
    const contents = await ProductModel.find(
        { status: 1 },
        {
            __v: 0,
        }
    ).populate('category', '-__v -status')
    .populate('publisher', '-_id -__v -status -password -name -createdAd -disabledAt -role -level -photo -exp')

    return res.status(200).json({
        page: Number.parseInt(page),
        pageSize: 10,
        total: contents.length,
        pages: Math.ceil(contents.length / pageSize),
        products: contents.slice((page - 1) * pageSize, page * pageSize),
    })
}

export async function getMyProducts(req, res) {
    const { userId } = req.query
    const pageSize = 10
    const page = req.query.page ?? 1
    const user = await UserModel.findOne({ _id: userId })

    if (user == null) {
        return res.status(404).json({
            error: `User with id ${userId} could not be found!`,
        })
    }
    
    const contents =  await ProductModel.find(
            { publisher: user },
            {
                __v: 0,
                publisher: 0,
            }
        ).populate('category', '-__v -status')

    return res.status(200).json({
        page: Number.parseInt(page),
        pageSize: 10,
        total: contents.length,
        pages: Math.ceil(contents.length / pageSize),
        products: contents.slice((page - 1) * pageSize, page * pageSize),
    })
}

export async function getProduct(req, res) {
    const product = await ProductModel.findOne(
        {
            _id: req.params.id,
            status: 1,
        },
        {
            __v: 0,
        }
    )
        .populate('category', '-__v -status')
        .populate('publisher', '-_id -__v -status -password -name -createdAd -disabledAt -role -level -photo -exp')

    return product != null
        ? res.status(200).json(product)
        : res.status(404).json({
              message: `Product could not be found!`,
          })
}

export async function createProduct(req, res) {
    const category = await CategoryModel.findOne({ _id: req.query.categoryId })
    
    console.log(req.body)

    const publisher = await UserModel.findOne({ _id: req.body.publisher })
    
    try {

        await ProductModel.create({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: category,
            quantity: req.body.quantity,
            image: `${req.file.filename}`,
            status: 1,
            publisher: publisher,
        })
    
    } catch(err) {
        console.log(err)
        return res.status(500).json({ error: 'Product could not be created!' })
    }

    return res.status(201).json({ message: 'Product created successfully!' })
}

export async function updateProduct(req, res) {
    const productPhoto = await ProductModel.findOne({ _id: req.params.id }, { image: 1 })

    if (productPhoto == null)
        return res.status(404).json({
            error: `Product with id ${req.params.id} could not be found!`,
        })

    const category = await CategoryModel.findOne({
        name: req.query.categoryName,
    })

    if (category == null)
        return res.status(404).json({
            error: `Category with name ${req.query.categoryName} could not be found!`,
        })

    const updateResult = await ProductModel.updateOne(
        { _id: req.params.id },
        {
            category: category,
            quantity: req.body.quantity,
            name: req.body.name,
            price: req.body.price,
            image: `${req.file.filename}`,
            description: req.body.description,
        },
        { upsert: false }
    )

    if (updateResult.modifiedCount == 0) {
        return res.status(500).json({ error: 'Could not update the product!' })
    }

    deletImage(productPhoto?.image, async (err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not update the product!' })
        }

        res.status(200).json({ message: 'Product updated successfully!' })
    })
}

export async function updateWithoutImage(req, res) {
    const category = await CategoryModel.findOne({
        name: req.query.categoryName,
    })

    if (category == null)
        return res.status(404).json({
            error: `Category with name ${req.query.categoryName} could not be found!`,
        })

    const updateResult = await ProductModel.updateOne(
        { _id: req.params.id },
        {
            category: category,
            quantity: req.body.quantity,
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
        },
        { upsert: false }
    )

    if (updateResult.modifiedCount == 0) return res.status(500).json({ error: 'Could not update the product!' })

    res.status(200).json({ message: 'Product updated successfully!' })
}

export async function deleteProduct(req, res) {
    const productPhoto = await ProductModel.findOne({ _id: req.params.id }, { image: 1 })

    if (productPhoto == null) return res.status(404).json({ error: 'Product could not be found!' })

    const deleteResult = await ProductModel.deleteOne({ _id: req.params.id })

    if (deleteResult.deletedCount == 0) {
        return res.status(500).json({ error: 'Could not delete the product!' })
    }

    deletImage(productPhoto?.image, async (err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not delete the product!' })
        }

        res.status(200).json({
            message: 'Product deleted successfully!',
        })
    })
}

export async function hideProduct(req, res) {
    const hideResult = await ProductModel.updateOne({ _id: req.params.id }, { status: 0 })

    if (hideResult.modifiedCount == 0) {
        return res.status(401).json({ error: 'Could not hide the product!' })
    }

    res.status(200).json({ message: 'Product hidden successfully!' })
}

//update  photo product
export async function updatePhotoProduct(req, res) {
    const productPhoto = await ProductModel.findOne({ _id: req.params.id }, { image: 1 })

    if (productPhoto == null)
        return res.status(404).json({
            error: `Product with id ${req.params.id} could not be found!`,
        })

    const updateResult = await ProductModel.updateOne(
        { _id: req.params.id },
        {
            image: `${req.file.filename}`,
        },
        { upsert: false }
    )

    if (updateResult.modifiedCount == 0) {
        return res.status(500).json({ error: 'Could not update the product!' })
    }

    deletImage(productPhoto?.image, async (err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not update the product!' })
        }

        res.status(200).json({ message: 'Product updated successfully!' })
    })
}
