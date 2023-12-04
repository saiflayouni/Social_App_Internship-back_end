import OfferJobModel from '../models/offerjob.js'

export async function checkIfOfferExists(req, res, next) {
    if (!(await OfferJobModel.findById(req.params.id))) return res.status(404).json({ error: 'offer not found' })

    next()
}
