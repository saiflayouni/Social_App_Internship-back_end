"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _gencode = _interopRequireDefault(require("../models/gencode.js"));

var _mailer = require("./mailer.js");

var _dayjs = _interopRequireDefault(require("dayjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @param {String} email
 */
function _callee(email) {
  var code, codeModel, _ref, error;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          code = Math.floor(Math.random() * 9000 + 1000);
          _context.next = 3;
          return regeneratorRuntime.awrap(_gencode["default"].updateOne({
            email: email
          }, {
            code: code,
            expiredAt: (0, _dayjs["default"])(Date.now()).add(15, 'minute').add(1, 'hour'),
            email: email
          }, {
            upsert: true
          }));

        case 3:
          codeModel = _context.sent;

          if (codeModel) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", {
            status: 500,
            error: 'Error creating code.'
          });

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap((0, _mailer.sendTemplatedEmail)(email, 'Verification', code));

        case 8:
          _ref = _context.sent;
          error = _ref.error;
          return _context.abrupt("return", error ? {
            status: 500,
            error: error
          } : {
            status: 200,
            message: 'Code generated successfully, please check your email.'
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
}