"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendTemplatedEmail = exports.sendEmail = void 0;

var _nodemailer = require("nodemailer");

var _default = require("../config/default.js");

var _ejs = _interopRequireDefault(require("ejs"));

var _pather = _interopRequireDefault(require("./pather.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var transporter = (0, _nodemailer.createTransport)({
  // @ts-ignore
  host: _default.SMTP_HOST,
  port: _default.SMTP_PORT,
  secure: !_default.__DEV__,
  auth: {
    user: _default.SMTP_USER,
    pass: _default.SMTP_PASSWORD
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

var sendEmail = function sendEmail(to, subject, body) {
  var resp = {};
  transporter.sendMail({
    from: _default.SMTP_USER,
    to: to,
    subject: subject,
    text: body
  }, function (error) {
    resp = {
      error: error
    };
  });
  return resp;
};

exports.sendEmail = sendEmail;

var sendTemplatedEmail = function sendTemplatedEmail(to, subject, code) {
  var resp, template, path, content;
  return regeneratorRuntime.async(function sendTemplatedEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          resp = {};
          template = '../public/emails/code-email.ejs';
          path = (0, _pather["default"])(template);
          _context.next = 5;
          return regeneratorRuntime.awrap(_ejs["default"].renderFile(path, {
            code: code
          }, {
            async: true
          }));

        case 5:
          content = _context.sent;

          if (content) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", {
            error: 'Error reading template!'
          });

        case 8:
          transporter.sendMail({
            from: _default.SMTP_USER,
            to: to,
            subject: subject,
            html: content
          }, function (error) {
            resp = {
              error: error
            };
          });
          return _context.abrupt("return", resp);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.sendTemplatedEmail = sendTemplatedEmail;