"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.substractXFromDate = exports.addXToDate = exports.getYear = exports.getMonth = exports.checkIfTowDaysAreTheSame = exports.checkIfDayIsBetween = void 0;

var _dayjs = _interopRequireDefault(require("dayjs"));

var _isBetween = _interopRequireDefault(require("dayjs/plugin/isBetween.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dayjs["default"].extend(_isBetween["default"]);
/**
 * @param {Date?} day day supplied
 * @param {Date | undefined} startDate begin interval
 * @param {Date | undefined} endDate end interval
 */


var checkIfDayIsBetween = function checkIfDayIsBetween(day, startDate, endDate) {
  return (0, _dayjs["default"])(day).isBetween((0, _dayjs["default"])(startDate), (0, _dayjs["default"])(endDate));
};
/**
 * @param {Date?} day1
 * @param {Date?} day2
 */


exports.checkIfDayIsBetween = checkIfDayIsBetween;

var checkIfTowDaysAreTheSame = function checkIfTowDaysAreTheSame(day1, day2) {
  return (0, _dayjs["default"])(day1).isSame((0, _dayjs["default"])(day2));
};
/**
 * @param {Date} date
 */


exports.checkIfTowDaysAreTheSame = checkIfTowDaysAreTheSame;

var getMonth = function getMonth(date) {
  return (0, _dayjs["default"])(date).month() + 1;
};
/**
 * @param {Date} date
 */


exports.getMonth = getMonth;

var getYear = function getYear(date) {
  return (0, _dayjs["default"])(date).year();
};
/**
 * @param {Date} date
 * @param {String} x
 * @param {Number} quantity
 */


exports.getYear = getYear;

var addXToDate = function addXToDate(date, x, quantity) {
  return (0, _dayjs["default"])(date).add(quantity, x);
};
/**
 * @param {Date} date
 * @param {String} x
 * @param {Number} quantity
 */


exports.addXToDate = addXToDate;

var substractXFromDate = function substractXFromDate(date, x, quantity) {
  return (0, _dayjs["default"])(date).subtract(quantity, x);
};

exports.substractXFromDate = substractXFromDate;