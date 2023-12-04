import PostModel from '../models/post.js'
import CommentModel from '../models/comment.js'
import UserModel from '../models/user.js'
import { updateUserLevel } from '../services/exp-service.js'
import { isEventRunning } from '../services/event-service.js'
import { Types } from 'mongoose'

export async function getCommentsByPost(req, res) {
    return res
        .status(200)
        .json(
            await CommentModel.find({ post: req.query.postId }).populate(
                'user',
                '-_id -__v -password -email -role -phone -status -createdAt'
            )
        )
}

export async function commentOnPost(req, res) {
    const user = await UserModel.findById(req.query.userId)

    if (!user) return res.status(404).json({ error: 'User not found' })

    const post = await PostModel.findById(req.query.postId)

    if (!post) return res.status(404).json({ error: 'Post not found' })

    const { content } = req.body

    const comment = await CommentModel.create({
        content,
        post,
        user,
    })

    if (!comment)
        return res.status(400).json({
            error: 'Unable to comment on the post, please try again later!',
        })

    return res.status(201).json({ message: 'Comment created successfully' })
}

export async function upvoteComment(req, res) {
    return (await _updateUserLevelWithVoteInfo(req.params.commentId, 1, 7))
        ? res.status(200).json({ message: 'Success' })
        : res.send(400).json({ error: 'Unable to upvote' })
}

export async function downvoteComment(req, res) {
    return (await _updateUserLevelWithVoteInfo(req.params.commentId, -1, -7))
        ? res.status(200).json({ message: 'Success' })
        : res.send(400).json({ error: 'Unable to downvote' })
}

/**
 *
 * @param {Types.ObjectId | undefined} commentId
 * @param {Number} vote
 * @param {Number} bonus
 * @returns
 */
async function _updateUserLevelWithVoteInfo(commentId, vote, bonus) {
    const comment = await CommentModel.findOne({ _id: commentId })

    const upadteRes = await CommentModel.updateOne(
        { _id: commentId },

        {
            $inc: {
                votes: vote,
            },
        },
        { upsert: false }
    )

    await updateUserLevel(await isEventRunning('FORUM'), comment?.user, bonus)

    if (!upadteRes) return false

    return true
}


export async function deleteComment(req, res) {
    const comment = await CommentModel.findById(req.params.commentId)

    if (!comment) return res.status(404).json({ error: 'Comment not found' })

    const deleteRes = await CommentModel.deleteOne({ _id: req.params.commentId })

    if (!deleteRes) return res.status(400).json({ error: 'Unable to delete comment' })

    return res.status(200).json({ message: 'Comment deleted successfully' })
}
