"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addYears = exports.addMonths = exports.addDays = exports.dateRange = exports.firstDayOfWeek = exports.lastDayOfMonth = void 0;
function lastDayOfMonth(year, month) {
    return new Date(year, month, 0).getDate();
}
exports.lastDayOfMonth = lastDayOfMonth;
function firstDayOfWeek(aDay) {
    const dow = aDay.getDay();
    return addDays(aDay, -dow);
}
exports.firstDayOfWeek = firstDayOfWeek;
function dateRange(startDate, n) {
    return [...Array(n)].map((_, i) => addDays(startDate, i));
}
exports.dateRange = dateRange;
function addDays(date, n) {
    let d = date.getDate() + n;
    let c = new Date(date);
    c.setDate(d);
    return c;
}
exports.addDays = addDays;
function addMonths(date, n) {
    let m = date.getMonth() + n;
    let c = new Date(date);
    c.setMonth(m);
    if (c.getDate() !== date.getDate()) {
        c.setDate(0);
    }
    return c;
}
exports.addMonths = addMonths;
function addYears(date, n) {
    let y = date.getFullYear() + n;
    let c = new Date(date);
    c.setFullYear(y);
    if (c.getDate() !== date.getDate()) {
        c.setDate(0);
    }
    return c;
}
exports.addYears = addYears;
