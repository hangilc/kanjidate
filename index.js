"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = exports.fSqlDateTime = exports.fSqlDate = exports.f14 = exports.f13 = exports.f12 = exports.f11 = exports.f10 = exports.f9 = exports.f8 = exports.f7 = exports.f6 = exports.f5 = exports.f4 = exports.f3 = exports.f2 = exports.f1 = exports.fromGengou = exports.toGengou = exports.addYears = exports.addMonths = exports.addDays = exports.dateRange = exports.firstDayOfWeek = exports.lastDayOfMonth = exports.calcAge = exports.GengouList = exports.Gengou = exports.Reiwa = exports.Heisei = exports.Shouwa = exports.Taishou = exports.Meiji = exports.nenRangeOf = exports.toYoubi = exports.KanjiDate = void 0;
var kanjidate_1 = require("./kanjidate");
Object.defineProperty(exports, "KanjiDate", { enumerable: true, get: function () { return kanjidate_1.KanjiDate; } });
Object.defineProperty(exports, "toYoubi", { enumerable: true, get: function () { return kanjidate_1.toYoubi; } });
Object.defineProperty(exports, "nenRangeOf", { enumerable: true, get: function () { return kanjidate_1.nenRangeOf; } });
Object.defineProperty(exports, "Meiji", { enumerable: true, get: function () { return kanjidate_1.Meiji; } });
Object.defineProperty(exports, "Taishou", { enumerable: true, get: function () { return kanjidate_1.Taishou; } });
Object.defineProperty(exports, "Shouwa", { enumerable: true, get: function () { return kanjidate_1.Shouwa; } });
Object.defineProperty(exports, "Heisei", { enumerable: true, get: function () { return kanjidate_1.Heisei; } });
Object.defineProperty(exports, "Reiwa", { enumerable: true, get: function () { return kanjidate_1.Reiwa; } });
Object.defineProperty(exports, "Gengou", { enumerable: true, get: function () { return kanjidate_1.Gengou; } });
Object.defineProperty(exports, "GengouList", { enumerable: true, get: function () { return kanjidate_1.GengouList; } });
var age_1 = require("./age");
Object.defineProperty(exports, "calcAge", { enumerable: true, get: function () { return age_1.calcAge; } });
var manip_1 = require("./manip");
Object.defineProperty(exports, "lastDayOfMonth", { enumerable: true, get: function () { return manip_1.lastDayOfMonth; } });
Object.defineProperty(exports, "firstDayOfWeek", { enumerable: true, get: function () { return manip_1.firstDayOfWeek; } });
Object.defineProperty(exports, "dateRange", { enumerable: true, get: function () { return manip_1.dateRange; } });
Object.defineProperty(exports, "addDays", { enumerable: true, get: function () { return manip_1.addDays; } });
Object.defineProperty(exports, "addMonths", { enumerable: true, get: function () { return manip_1.addMonths; } });
Object.defineProperty(exports, "addYears", { enumerable: true, get: function () { return manip_1.addYears; } });
const kanjidate_2 = require("./kanjidate");
const formatter_1 = require("./formatter");
function toGengou(year, month, day) {
    const jpy = new kanjidate_2.JapaneseYear(year, month, day);
    if (jpy.era instanceof kanjidate_2.Gregorian) {
        return { gengou: "西暦", nen: year };
    }
    else {
        return { gengou: jpy.era.getLabel(), nen: jpy.nen };
    }
}
exports.toGengou = toGengou;
function fromGengou(gengou, nen) {
    if (nen < 1) {
        throw new Error("Invalid nen: " + nen);
    }
    const g = kanjidate_2.Gengou.fromString(gengou);
    if (g != null) {
        return g.nenStartYear - 1 + nen;
    }
    const s = kanjidate_2.Gregorian.fromString(gengou);
    if (s != null) {
        return nen;
    }
    throw new Error("Invalid gengou: " + gengou);
}
exports.fromGengou = fromGengou;
exports.f1 = "{G}{N}年{M}月{D}日（{W}）";
exports.f2 = "{G}{N}年{M}月{D}日";
exports.f3 = "{G:a}{N}.{M}.{D}";
exports.f4 = "{G}{N:2}年{M:2}月{D:2}日（{W}）";
exports.f5 = "{G}{N:2}年{M:2}月{D:2}日";
exports.f6 = "{G:a}{N:2}.{M:2}.{D:2}";
exports.f7 = "{G}{N}年{M}月{D}日（{W}） {a}{h:12}時{m}分{s}秒";
exports.f8 = "{G}{N:2}年{M:2}月{D:2}日（{W}） {a}{h:12,2}時{m:2}分{s:2}秒";
exports.f9 = "{G}{N}年{M}月{D}日（{W}） {a}{h:12}時{m}分";
exports.f10 = "{G}{N:2}年{M:2}月{D:2}日（{W}） {a}{h:12,2}時{m:2}分";
exports.f11 = "{G}{N:z}年{M:z}月{D:z}日";
exports.f12 = "{G}{N:z,2}年{M:z,2}月{D:z,2}日";
exports.f13 = "{Y}-{M:2}-{D:2}";
exports.f14 = "{Y}-{M:2}-{D:2} {h:2}:{m:2}:{s:2}";
exports.fSqlDate = exports.f13;
exports.fSqlDateTime = exports.f14;
const msgInvalidArg = "Invalid arguments to kanjidate.format";
function format(...args) {
    switch (args.length) {
        case 0: return (0, formatter_1.format)(exports.f1, new kanjidate_2.KanjiDate(new Date()));
        case 1: return format1(args[0]);
        case 2: return format2(args[0], args[1]);
        case 4: return formatN(args[0], args[1], args[2], args[3]);
        case 5: return formatN(args[0], args[1], args[2], args[3], args[4]);
        case 6: return formatN(args[0], args[1], args[2], args[3], args[4], args[5]);
        case 7: return formatN(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        default: throw new Error(msgInvalidArg);
    }
}
exports.format = format;
function format1(arg) {
    if (typeof arg === "string") {
        const d = kanjidate_2.KanjiDate.tryFromString(arg);
        if (d === null) {
            return (0, formatter_1.format)(arg, new kanjidate_2.KanjiDate(new Date()));
        }
        else {
            return (0, formatter_1.format)(exports.f1, d);
        }
    }
    else if (arg instanceof Date) {
        return (0, formatter_1.format)(exports.f1, new kanjidate_2.KanjiDate(arg));
    }
    else {
        throw new Error(msgInvalidArg);
    }
}
function format2(arg1, arg2) {
    let fmtStr;
    if (typeof arg1 === "string") {
        fmtStr = arg1;
    }
    else {
        throw new Error(msgInvalidArg);
    }
    let d;
    if (typeof arg2 === "string") {
        d = kanjidate_2.KanjiDate.fromString(arg2);
    }
    else if (arg2 instanceof Date) {
        d = new kanjidate_2.KanjiDate(arg2);
    }
    else {
        throw new Error(msgInvalidArg);
    }
    return (0, formatter_1.format)(fmtStr, d);
}
function formatN(fmtArg, yearArg, monthArg, dayArg, hourArg, minuteArg, secondArg) {
    try {
        const year = yearArg;
        const month = monthArg;
        const day = dayArg;
        let hour;
        if (hourArg === undefined) {
            hour = 0;
        }
        else {
            hour = hourArg;
        }
        let minute;
        if (minuteArg === undefined) {
            minute = 0;
        }
        else {
            minute = minuteArg;
        }
        let second;
        if (secondArg === undefined) {
            second = 0;
        }
        else {
            second = secondArg;
        }
        return (0, formatter_1.format)(fmtArg, new kanjidate_2.KanjiDate(new Date(year, month - 1, day, hour, minute, second)));
    }
    catch (ex) {
        console.error(ex);
        throw new Error(msgInvalidArg);
    }
}
