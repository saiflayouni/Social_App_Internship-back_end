import userModel from '../models/user.js'


//get allUsers between dates
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

//getCountUsers by date
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

//getAll users
export async function getAllUsers(req, res) 
{
    
}

//get Alldeactivetd users
export async function getAllDeactivatedUsers(req, res) {
    const users = await userModel.find(
        {
            status: 0
        },
        { password: 0, __v: 0 }
    )
    res.status(users ? 200 : 404).json(users ?? { error: 'Users not found' })
}
