import OfferJobModel from '../models/offerjob.js'
import UserModel from '../models/user.js'

//add offre job with upload jobPhoto with multer
export async function addOfferjob(req, res) {
    const {
        jobTitle,
        jobDescription,
        jobAdress,
        jobType,
        jobStartDate,
        jobEndDate,
        jobPosition,
        jobWebsite,
        jobEmail,
    } = req.body

    const { companyId } = req.query

    const company = await UserModel.findOne({
        _id: companyId,
        role: 2,
    })

    const postedAt=Date.now()
    if (!company) {
        return res.status(404).json({
            message: `Company could not be found!`,
        })
    }

    const createdRes = await OfferJobModel.create({
        jobTitle,
        jobDescription,
        jobAdress,
        jobType,
        jobStartDate,
        jobEndDate,
        jobPosition,
        jobWebsite,
        jobEmail,
        postedAt,
        company,
    })

    if (!createdRes)
        return res.status(500).json({ error: 'Offer could not be created!' })

    res.status(201).json({ message: 'Offer created successfully!' })
}

//get all offre job with users without password
export async function getAllOffrejob(req, res) {
    const offrejob = await OfferJobModel.find()
        .populate('company', '-password')
        .sort({ postedAt: -1 })
        .exec()

    if (!offrejob)
        return res.status(500).json({ error: 'Offer could not be found!' })

    res.status(200).json(offrejob)
}
//get offre job by id
export async function getOffrejobById(req, res) {
    const jobOffer = await OfferJobModel.findOne({_id:req.params.id}).populate('company', "+name +photo") // hedhi tjiblk array raw :) nikom el mac

    return !jobOffer
        ? res.status(404).json({ error: 'offer not found' })
        : res.status(200).json(jobOffer)
}

//delete offre job
export async function deleteOffrejob(req, res) {
    const delResult = await OfferJobModel.deleteOne({ _id: req.params.id })

    return delResult.deletedCount === 0
        ? res.status(404).json({ error: 'Offer could not be found!' })
        : res.status(200).json({ message: 'Offer deleted successfully!' })
}

//update offre job
export async function updateOffrejob(req, res) {
    const updateResult = await OfferJobModel.updateOne(
        {
            _id: req.params.id,
        },
        req.body
    )

    return updateResult.modifiedCount === 0
        ? res.status(500).json({ error: 'offre job could not be updated!' })
        : res.status(200).json({ message: 'Job ad updated successfully!' })
}

