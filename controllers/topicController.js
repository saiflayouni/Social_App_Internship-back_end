import TopicModel from '../models/topic.js'

export async function getTopics(req, res) {
    return res.status(200).json(await TopicModel.find({}))
}

export async function createTopic(req, res) {
    const t = await TopicModel.create({
        title: req.body.title,
    })

    if (!t) return res.status(400).json({ error: 'Unable to create topic, please try again later!' })

    return res.status(201).json(t)
}
