"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressValidator = require("express-validator");

var _authController = require("../controllers/authController.js");

var _userIdentityConfig = require("../middelwares/user-identity-config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express["default"])();
router.route('/').get(function (req, res) {
  res.status(200).json({
    message: 'Welcome to Nebula Gaming !'
  });
});
router.route('/login').post(_authController.authenticate);
router.route('/logingoogle').post(_authController.authenticateWithGoogle);
router.route('/refresh-token').post(_authController.refreshAccessToken);
router.route('/register').post((0, _expressValidator.body)('username').isLength({
  min: 3,
  max: 100
}), (0, _expressValidator.body)('password').isLength({
  min: 8
}), (0, _expressValidator.body)('role').isAlpha().isLength({
  min: 3,
  max: 7
}), (0, _expressValidator.body)('phone').isMobilePhone('any'), (0, _expressValidator.body)('email').isEmail(), _userIdentityConfig.checkIfUserAlreadyExists, _authController.registerUser);
router.route('/resetVerif').post(_userIdentityConfig.checkUserByEmail, _authController.resetVerifCode);
router.route('/verifyAccount').post(_userIdentityConfig.checkUserByEmail, _authController.accountVerificationWithGencode);
router.route('/forgetPasswordReq').post(_userIdentityConfig.checkUserByEmail, _authController.forgetPasswordRequest);
router.route('/forgetPassword').post(_userIdentityConfig.checkUserByEmail, _authController.unsecureChangePassword);
router.route('/VerifyCode').post(_authController.verifyCode);
router.route('/discordlogin').get(function (req, res) {
  res.send("\n    <div style=\"margin: 300px auto;\n    max-width: 400px;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    font-family: sans-serif;\"\n    >\n        <h3>Welcome to Discord OAuth NodeJS App</h3>\n        <p>Click on the below button to get started!</p>\n        <a \n            href=\"https://discord.com/api/oauth2/authorize?client_id=1051808463195492422&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fdiscord&response_type=code&scope=identify%20email\"\n            style=\"outline: none;\n            padding: 10px;\n            border: none;\n            font-size: 20px;\n            margin-top: 20px;\n            border-radius: 8px;\n            background: #6D81CD;\n            cursor:pointer;\n            text-decoration: none;\n            color: white;\"\n        >\n        Login with Discord</a>\n    </div>\n");
});
var _default = router;
exports["default"] = _default;