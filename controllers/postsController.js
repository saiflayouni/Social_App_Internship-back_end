import { Types } from 'mongoose'
import TopicModel from '../models/topic.js'
import PostModel from '../models/post.js'
import UserModel from '../models/user.js'
import { isEventRunning } from '../services/event-service.js'
import { updateUserLevel } from '../services/exp-service.js'

export async function getPostsByTopic(req, res) {
    return res
        .status(200)
        .json(
            await PostModel.find({ topic: req.query.topic }, { __v: 0 })
                .populate('user', '-_id -__v -password -email -role -phone -status -createdAt')
                .populate('topic', '-__v')
        )
}

export async function getOnePost(req, res) {
    const post = await PostModel.findOne({ _id: req.query.postId }, { __v: 0 })

    if (!post) return res.status(404).json({ error: 'Post not found' })

    return res.status(200).json(post)
}

export async function createPost(req, res) {
    const user = await UserModel.findById(req.query.userId)

    if (!user) return res.status(404).json({ error: 'User not found' })

    let topic = await TopicModel.findOne({ title: req.query.topic })

    if (!topic) {
        const newTopic = await TopicModel.create({
            title: req.query.topic,
        })

        if (!newTopic)
            return res.status(400).json({
                error: 'Unable to create topic, please try again later!',
            })

        topic = newTopic
    }

    const { title, content, image } = req.body

    const post = await PostModel.create({
        title,
        content,
        image,
        user,
        topic,
    })

    if (!post)
        return res.status(400).json({
            error: 'Unable to publish your post, please try again later!',
        })

    return res.status(201).json(post)
}

export async function likePost(req, res) {
    return (await _updateUserExpWithLikeInfo(req.params.postId, 1, 10))
        ? res.status(200).json({ message: 'Success' })
        : res.status(400).json({ error: 'Error' })
}

export async function dislikePost(req, res) {
    return (await _updateUserExpWithLikeInfo(req.params.postId, -1, -10))
        ? res.status(200).json({ message: 'Success' })
        : res.status(400).json({ error: 'Error' })
}

/**
 * @param {Types.ObjectId | undefined} postId
 * @param {Number} likes
 * @param {Number} bonus
 */
async function _updateUserExpWithLikeInfo(postId, likes, bonus) {
    const post = await PostModel.findOne({ _id: postId })

    const upadteRes = await PostModel.updateOne(
        { _id: postId },

        {
            $inc: {
                likes: likes,
            },
        },
        { upsert: false }
    )

    if (!upadteRes) return false

    await updateUserLevel(await isEventRunning('FORUM'), post?.user, bonus)

    return true
}
// get post by date
export async function getPostsByDate(req, res) {
    return res
        .status(200)
        .json(
            await PostModel.find({}, { __v: 0 })
                .populate('user', '-_id -__v -password -email -role -phone -status -createdAt')
                .populate('topic', '-__v')
                .sort({ createdAt: -1 })
        )
}