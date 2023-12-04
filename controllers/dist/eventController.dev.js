"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.publishEvent = publishEvent;
exports.getEventsOfMonthAndYear = getEventsOfMonthAndYear;
exports.getForToday = getForToday;

var _event = _interopRequireDefault(require("../models/event.js"));

var _nodeCron = _interopRequireDefault(require("node-cron"));

var _dayjsService = require("../services/dayjs-service.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function publishEvent(req, res) {
  return regeneratorRuntime.async(function publishEvent$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_event["default"].create(req.body));

        case 2:
          if (_context.sent) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: 'Event not created.'
          }));

        case 4:
          res.status(201).json({
            message: 'Event published'
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}

function getEventsOfMonthAndYear(req, res) {
  var month, year, events, eventsOfMonth;
  return regeneratorRuntime.async(function getEventsOfMonthAndYear$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          month = Number.parseInt(req.query.month) || new Date().getMonth() + 1;
          year = Number.parseInt(req.query.year) || new Date().getFullYear();
          _context2.next = 4;
          return regeneratorRuntime.awrap(_event["default"].find());

        case 4:
          events = _context2.sent;
          eventsOfMonth = events.filter(function (event) {
            return ((0, _dayjsService.getMonth)(event.startDateTime) === month || (0, _dayjsService.getMonth)(event.endDateTime) === month) && ((0, _dayjsService.getYear)(event.startDateTime) === year || (0, _dayjsService.getYear)(event.endDateTime) === year);
          });

          if (eventsOfMonth) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: 'No events found.'
          }));

        case 8:
          res.status(200).json(eventsOfMonth);

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function getForToday(req, res) {
  var dateToCheck, events, eventsForToday;
  return regeneratorRuntime.async(function getForToday$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          dateToCheck = req.query.day ? new Date(req.query.day) : new Date();
          _context3.next = 3;
          return regeneratorRuntime.awrap(_event["default"].find({}, {
            __v: 0
          }));

        case 3:
          events = _context3.sent;
          eventsForToday = events.filter(function (event) {
            return (0, _dayjsService.checkIfDayIsBetween)(dateToCheck, event.startDateTime, event.endDateTime);
          });
          res.status(200).json(eventsForToday);

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
}

var task = _nodeCron["default"].schedule('0 30 11 * * *', function expireEvents() {
  var events;
  return regeneratorRuntime.async(function expireEvents$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(_event["default"].find());

        case 2:
          events = _context5.sent;
          events.forEach(function _callee(event) {
            return regeneratorRuntime.async(function _callee$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    if (!(0, _dayjsService.checkIfTowDaysAreTheSame)(null, event.endDateTime)) {
                      _context4.next = 3;
                      break;
                    }

                    _context4.next = 3;
                    return regeneratorRuntime.awrap(_event["default"].findByIdAndDelete(event._id));

                  case 3:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          });

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
});

task.start();