import userModel from '../models/user.js'
import productModel from '../models/product.js'
import categoryModel from '../models/category.js'

//getAllUsers without password
export async function getAllUsers(req, res) {
    const users = await userModel.find({}, { password: 0, __v: 0 })
    res.status(200).json(users)
}

export async function listMembers(req, res) {
    return res.status(200).json(
        await userModel.find(
            {
                role: 1,
            },
            {
                password: 0,
                role: 0,
            }
        )
    )
}

export async function listCompanies(req, res) {
    return res.status(200).json(
        await userModel.find(
            {
                role: 2,
            },
            {
                password: 0,
                role: 0,
            }
        )
    )
}

export async function disableAccount(req, res) {
    const updateResult = await userModel.updateOne(
        { _id: req.params.id },
        {
            disabledAt: Date.now(),
            status: 0,
        }
    )
    if (updateResult.modifiedCount === 0) return res.status(400).json({ error: 'Could not disable the account !' })
    res.status(200).json({ message: 'Account disabled successfully' })
}

export async function enableAccount(req, res) {
    const updateResult = await userModel.updateOne(
        { _id: req.params.id },
        {
            disabledAt: null,
            status: 1,
        }
    )

    if (updateResult.modifiedCount === 0) return res.status(400).json({ error: 'Could not enable the account !' })
    res.status(200).json({ message: 'Account enabled successfully' })
}

export async function getAllUsersBystartDateAndFinishDate(req, res) {
    const users = await userModel.find(
        {
            createdAt: {
                $gte: new Date(req.query.startDate),
                $lt: new Date(req.query.endDate),
            },
        },
        { password: 0, __v: 0 }
    )
    res.status(users ? 200 : 404).json(users ?? { error: 'Users not found' })
}
export async function getCountUsersBystartDateAndFinishDate(req, res) {
    const users = await userModel.find(
        {
            createdAt: {
                $gte: new Date(req.query.startDate),
                $lt: new Date(req.query.endDate),
            },
        },
        { password: 0, __v: 0 }
    )
    res.status(users ? 200 : 404).json(users.length ?? { error: 'Users not found' })
}

export async function getCountAllUsers(req, res) {
    const users = await userModel.find({}, { password: 0, __v: 0 })
    res.status(users ? 200 : 404).json(users.length ?? { error: 'Users not found' })
}

export async function getCountAllMembers(req, res) {
    const users = await userModel.find({ role: 1 }, { password: 0, __v: 0 })
    res.status(users ? 200 : 404).json(users.length ?? { error: 'Users not found' })
}

export async function getCountAllCompanies(req, res) {
    const users = await userModel.find({ role: 2 }, { password: 0, __v: 0 })
    res.status(users ? 200 : 404).json(users ?? { error: 'Users not found' })
}

export async function getCountAllDisabledUsers(req, res) {
    const users = await userModel.find({ status: 0 }, { password: 0, __v: 0 })
    res.status(users ? 200 : 404).json(users.length ?? { error: 'Users not found' })
}

export async function getCountAllEnabledUsers(req, res) {
    const users = await userModel.find({ status: 1 }, { password: 0, __v: 0 })
    res.status(users ? 200 : 404).json(users.length ?? { error: 'Users not found' })
}

export async function getCountAllDisabledMembers(req, res) {
    const users = await userModel.find({ role: 1, status: 0 }, { password: 0, __v: 0 })
    res.status(users ? 200 : 404).json(users.length ?? { error: 'Users not found' })
}

export async function getCountAllEnabledMembers(req, res) {
    const users = await userModel.find({ role: 1, status: 1 }, { password: 0, __v: 0 })
    res.status(users ? 200 : 404).json(users.length ?? { error: 'Users not found' })
}

export async function getCountAllDisabledCompanies(req, res) {
    const users = await userModel.find({ role: 2, status: 0 }, { password: 0, __v: 0 })
    res.status(users ? 200 : 404).json(users.length ?? { error: 'Users not found' })
}

export async function getCountAllEnabledCompanies(req, res) {
    const users = await userModel.find({ role: 2, status: 1 }, { password: 0, __v: 0 })
    res.status(users ? 200 : 404).json(users.length ?? { error: 'Users not found' })
}

export async function getCountAllDisabledUsersBystartDateAndFinishDate(req, res) {
    const users = await userModel.find(
        {
            createdAt: {
                $gte: new Date(req.query.startDate),
                $lt: new Date(req.query.endDate),
            },
            status: 0,
        },
        { password: 0, __v: 0 }
    )
    res.status(users ? 200 : 404).json(users.length ?? { error: 'Users not found' })
}

export async function getCountAllEnabledUsersBystartDateAndFinishDate(req, res) {
    const users = await userModel.find(
        {
            createdAt: {
                $gte: new Date(req.query.startDate),
                $lt: new Date(req.query.endDate),
            },
            status: 1,
        },
        { password: 0, __v: 0 }
    )
    res.status(users ? 200 : 404).json(users.length ?? { error: 'Users not found' })
}

//----------------- Count All users with roles ---------------------------//

export async function getCountAllMembers2() {
    const users = await userModel.find({ role: 1 }, { password: 0, __v: 0 })
    return users.length
}

//getAllcompanies
export async function getCountAllCompanies2() {
    const users = await userModel.find({ role: 2 }, { password: 0, __v: 0 })
    return users.length
}

//count all users
export async function getCountAllUsers2() {
    const users = await userModel.find({})

    return users.length
}
export async function getAllMethod(req, res) {
    const allUsers = await getCountAllUsers2()
    const allMembers = await getCountAllMembers2()
    const allCompanies = await getCountAllCompanies2()
    const count = {
        countAllUsers: allUsers,
        countAllmembers: allMembers,
        countAllCompanies: allCompanies,
    }
    res.status(200).json(count)
}

//----------------- Count All users with enable disable ---------------------------//

//getCountEnableAccount
export async function getCountEnableAccount2() {
    const users = await userModel.find({ status: 1 }, { password: 0, __v: 0 })
    return users.length
}

//getCountDisableAccount
export async function getCountDisableAccount2() {
    const users = await userModel.find({ status: 0 }, { password: 0, __v: 0 })
    return users.length
}
export async function getCountAllEnableDiscableCount(req, res) {
    const allUsers = await getCountAllUsers2()
    const getCountEnableAccount = await getCountEnableAccount2()
    const getCountDisableAccount = await getCountDisableAccount2()
    const count = {
        countAllUsers: allUsers,
        countEnableAccount: getCountEnableAccount,
        countDisableAccount: getCountDisableAccount,
    }
    res.status(200).json(count)
}

//change role user
export async function changeRoleUser(req, res) {
    const user = await userModel.findOneAndUpdate({ _id: req.params.id }, { role: req.body.role }, { new: true })
    res.status(user ? 200 : 404).json(user ?? { error: 'User not found' })
}
//----------------- Count Al Product ---------------------------//

//count all product
export async function getCountAllProducts() {
    const product = await productModel.find({})
    return product.length
}

//Sum price all product
export async function getSumPriceAllProducts() {
    const product = await productModel.find({})
    let sum = 0
    product.forEach((element) => {
        sum += element.price
    })
    return sum
}

//sum quantity all product
export async function getSumQuantityAllProducts() {
    const product = await productModel.find({})
    let sum = 0
    product.forEach((element) => {
        sum += element.quantity
    })
    return sum
}
//count hidden product
export async function getAllHiddenProducts() {
    const product = await productModel.find({ status: 0 })
    return product.length
}
//----------------- Categori ---------------------------//

export async function getCountAllCategory() {
    const category = await categoryModel.find({})
    return category.length
}

//nomber of product in category
export async function getNumberOfProductInCategory(req, res) {
    const category = await categoryModel.find({ _id: req.params.id })
    const product = await productModel.find({ category: category[0].name })
    res.status(product ? 200 : 404).json(product.length ?? { error: 'product not found' })
}

export async function getAllMethodProducts(req, res) {
    const allProduct = await getCountAllProducts()
    const SumPriceAllProducts = await getSumPriceAllProducts()
    const getSumQuantityAllProduct = await getSumQuantityAllProducts()
    const getAllHiddenProduct = await getAllHiddenProducts()
    const getCountAllCategorys = await getCountAllCategory()
    const count = {
        allProducts: allProduct,
        SumPriceAllProducts: SumPriceAllProducts,
        getSumQuantityAllProduct: getSumQuantityAllProduct,
        getAllHiddenProducts: getAllHiddenProduct,
        getCountAllCategorys: getCountAllCategorys,
    }
    res.status(200).json(count)
}

//count all Category

// get all users
