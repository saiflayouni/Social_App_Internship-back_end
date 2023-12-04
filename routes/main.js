import Router from 'express'
import { body } from 'express-validator'
import {
    accountVerificationWithGencode,
    authenticate,
    registerUser,
    resetVerifCode,
    forgetPasswordRequest,
    unsecureChangePassword,
    refreshAccessToken,
    verifyCode,authenticateWithGoogle
} from '../controllers/authController.js'

import {
    checkIfUserAlreadyExists,
    checkUserByEmail,
} from '../middelwares/user-identity-config.js'

const router = Router()

router.route('/').get((req, res) => {
    res.status(200).json({ message: 'Welcome to Nebula Gaming !' })
})

router.route('/login').post(authenticate)
router.route('/logingoogle').post(authenticateWithGoogle)
router.route('/refresh-token').post(refreshAccessToken)
router
    .route('/register')
    .post(
        body('username').isLength({ min: 3, max: 100 }),
        body('password').isLength({ min: 8 }),
        body('role').isAlpha().isLength({ min: 3, max: 7 }),
        body('phone').isMobilePhone('any'),
        body('email').isEmail(),
        checkIfUserAlreadyExists,
        registerUser
    )
router.route('/resetVerif').post(checkUserByEmail, resetVerifCode)
router
    .route('/verifyAccount')
    .post(checkUserByEmail, accountVerificationWithGencode)
router.route('/forgetPasswordReq').post(checkUserByEmail, forgetPasswordRequest)
router.route('/forgetPassword').post(checkUserByEmail, unsecureChangePassword)

router.route('/VerifyCode').post(verifyCode)
router.route('/discordlogin').get((req, res) => {
    res.send(`
    <div style="margin: 300px auto;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: sans-serif;"
    >
        <h3>Welcome to Discord OAuth NodeJS App</h3>
        <p>Click on the below button to get started!</p>
        <a 
            href="https://discord.com/api/oauth2/authorize?client_id=1051808463195492422&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fdiscord&response_type=code&scope=identify%20email"
            style="outline: none;
            padding: 10px;
            border: none;
            font-size: 20px;
            margin-top: 20px;
            border-radius: 8px;
            background: #6D81CD;
            cursor:pointer;
            text-decoration: none;
            color: white;"
        >
        Login with Discord</a>
    </div>
`)
})
export default router
