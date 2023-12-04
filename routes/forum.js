import { Router } from 'express'

import {
    commentOnPost,
    getCommentsByPost,
    upvoteComment,
    downvoteComment,
} from '../controllers/commentsController.js'
import {
    getPostsByTopic,
    createPost,
    likePost,
    dislikePost,
} from '../controllers/postsController.js'
import { getTopics, createTopic } from '../controllers/topicController.js'

const router = Router()

router.route('/topics').get(getTopics).post(createTopic)

router.route('/posts/like/:postId').put(likePost)
router.route('/posts/dislike/:postId').put(dislikePost)
router.route('/posts').get(getPostsByTopic).post(createPost)

router.route('/comments/up/:commentId').put(upvoteComment)
router.route('/comments/down/:commentId').put(downvoteComment)
router.route('/comments').post(commentOnPost).get(getCommentsByPost)

export default router
