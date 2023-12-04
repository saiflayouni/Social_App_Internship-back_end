// product routes

import { Router } from 'express'
import multer from '../config/multer.js'
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    hideProduct,
    updateWithoutImage,
    getMyProducts,
} from '../controllers/productController.js'
import { checkIfCategoryExists } from '../middelwares/category-checker.js'
import { checkIfProductExists } from '../middelwares/product-checker.js'

const router = Router()

router
    .route('/')
    .get(getProducts)
    .post(checkIfCategoryExists, multer(), createProduct)

router.route('/myProducts').get(getMyProducts)

router.route('/:id').get(getProduct).delete(deleteProduct)

router.route('/update/:id').put(multer, updateProduct)

router.route('/update2/:id').put(checkIfProductExists, updateWithoutImage)

router.route('/hide/:id').put(hideProduct)

export default router
