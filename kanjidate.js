"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanjiDate = exports.JapaneseYear = exports.nenRangeOf = exports.GengouList = exports.Reiwa = exports.Heisei = exports.Shouwa = exports.Taishou = exports.Meiji = exports.toYoubi = exports.Gregorian = exports.Gengou = void 0;
__exportStar(require("./age"), exports);
class OrderedDate {
    year;
    month;
    day;
    constructor(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }
    static ge(a, b) {
        const [year1, month1, day1] = [a.year, a.month, a.day];
        const [year2, month2, day2] = [b.year, b.month, b.day];
        if (year1 > year2) {
            return true;
        }
        if (year1 < year2) {
            return false;
        }
        if (month1 > month2) {
            return true;
        }
        if (month1 < month2) {
            return false;
        }
        return day1 >= day2;
    }
    static fromDate(date) {
        return new OrderedDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }
}
class Gengou {
    kanji;
    alpha;
    start;
    nenStartYear;
    constructor(kanji, alpha, start, nenStartYear = start.year) {
        this.kanji = kanji;
        this.alpha = alpha;
        this.start = start;
        this.nenStartYear = nenStartYear;
    }
    getLabel() {
        return this.kanji;
    }
    isMyDate(a) {
        return OrderedDate.ge(a, this.start);
    }
    getNenOf(year) {
        return year - this.nenStartYear + 1;
    }
    static fromString(s) {
        for (let i = 0; i < exports.GengouList.length; i++) {
            const g = exports.GengouList[i];
            if (g.kanji === s) {
                return g;
            }
        }
        return null;
    }
}
exports.Gengou = Gengou;
class Gregorian {
    isGregorian = true;
    static fromString(s) {
        if (s == "西暦") {
            return new Gregorian();
        }
        else {
            return null;
        }
    }
}
exports.Gregorian = Gregorian;
const youbi = ["日", "月", "火", "水", "木", "金", "土"];
const dayOfWeeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function toYoubi(dayOfWeek) {
    return youbi[dayOfWeek % 7];
}
exports.toYoubi = toYoubi;
exports.Meiji = new Gengou("明治", "Meiji", new OrderedDate(1873, 1, 1), 1868);
exports.Taishou = new Gengou("大正", "Taishou", new OrderedDate(1912, 7, 30));
exports.Shouwa = new Gengou("昭和", "Shouwa", new OrderedDate(1926, 12, 25));
exports.Heisei = new Gengou("平成", "Heisei", new OrderedDate(1989, 1, 8));
exports.Reiwa = new Gengou("令和", "Reiwa", new OrderedDate(2019, 5, 1));
exports.GengouList = [
    exports.Reiwa, exports.Heisei, exports.Shouwa, exports.Taishou, exports.Meiji
];
function nenRangeOf(g) {
    const i = exports.GengouList.findIndex(e => e == g);
    if (i == 0) {
        const kd = new KanjiDate(new Date());
        return [1, kd.nen];
    }
    else if (i > 0) {
        const pre = exports.GengouList[i - 1];
        return [1, g.getNenOf(pre.start.year)];
    }
    else {
        throw new Error("Invalid gengou: " + g);
    }
}
exports.nenRangeOf = nenRangeOf;
class JapaneseYear {
    era;
    nen;
    constructor(year, month, day) {
        const od = new OrderedDate(year, month, day);
        for (let i = 0; i < exports.GengouList.length; i++) {
            const g = exports.GengouList[i];
            if (g.isMyDate(od)) {
                this.era = g;
                this.nen = g.getNenOf(od.year);
                return;
            }
        }
        this.era = new Gregorian();
        this.nen = year;
    }
    static fromDate(date) {
        return new JapaneseYear(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }
}
exports.JapaneseYear = JapaneseYear;
class KanjiDate {
    year;
    month;
    day;
    hour;
    minute;
    second;
    msec;
    dayOfWeek;
    dayOfWeekAlpha;
    japaneseYear;
    gengou;
    nen;
    youbi;
    constructor(date) {
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.day = date.getDate();
        this.hour = date.getHours();
        this.minute = date.getMinutes();
        this.second = date.getSeconds();
        this.msec = date.getMilliseconds();
        this.dayOfWeek = date.getDay();
        this.dayOfWeekAlpha = dayOfWeeks[this.dayOfWeek];
        this.japaneseYear = new JapaneseYear(this.year, this.month, this.day);
        if (this.japaneseYear.era instanceof Gregorian) {
            this.gengou = "西暦";
            this.nen = this.year;
        }
        else {
            this.gengou = this.japaneseYear.era.getLabel();
            this.nen = this.japaneseYear.nen;
        }
        this.youbi = youbi[this.dayOfWeek];
    }
    static of(year, month, day, hour = 0, minute = 0, second = 0, msecond = 0) {
        var date = new Date(year, month - 1, day, hour, minute, second, msecond);
        return new KanjiDate(date);
    }
    static tryFromString(str) {
        let m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (m) {
            return KanjiDate.of(+m[1], +m[2], +m[3]);
        }
        m = str.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
        if (m) {
            return KanjiDate.of(+m[1], +m[2], +m[3], +m[4], +m[5], +m[6]);
        }
        return null;
    }
    static fromString(str) {
        const d = KanjiDate.tryFromString(str);
        if (d === null) {
            throw new Error("cannot convert to KanjiDate");
        }
        else {
            return d;
        }
    }
}
exports.KanjiDate = KanjiDate;
var Impl;
(function (Impl) {
    class Kdate {
        year;
        month;
        day;
        constructor(year, month, day) {
            this.year = year;
            this.month = month;
            this.day = day;
        }
        static ge(a, b) {
            const [year1, month1, day1] = [a.year, a.month, a.day];
            const [year2, month2, day2] = [b.year, b.month, b.day];
            if (year1 > year2) {
                return true;
            }
            if (year1 < year2) {
                return false;
            }
            if (month1 > month2) {
                return true;
            }
            if (month1 < month2) {
                return false;
            }
            return day1 >= day2;
        }
    }
    Impl.Kdate = Kdate;
    class Gengou {
        kanji;
        alpha;
        start;
        nenStartYear;
        constructor(kanji, alpha, start, nenStartYear = start.year) {
            this.kanji = kanji;
            this.alpha = alpha;
            this.start = start;
            this.nenStartYear = nenStartYear;
        }
        getLabel() {
            return this.kanji;
        }
        isMyDate(a) {
            return Kdate.ge(a, this.start);
        }
        getNenOf(year) {
            return year - this.nenStartYear + 1;
        }
        static fromString(s) {
            throw new Error("Not implemented");
        }
    }
    Impl.Gengou = Gengou;
    class Gregorian {
        identity = "";
    }
    Impl.Gregorian = Gregorian;
    const Meiji = new Gengou("明治", "Meiji", new Kdate(1873, 1, 1), 1868);
    const Taishou = new Gengou("大正", "Taishou", new Kdate(1912, 7, 30));
    const Shouwa = new Gengou("昭和", "Shouwa", new Kdate(1926, 12, 25));
    const Heisei = new Gengou("平成", "Heisei", new Kdate(1989, 1, 8));
    const Reiwa = new Gengou("令和", "Reiwa", new Kdate(2019, 5, 1));
    const GengouList = [
        Reiwa, Heisei, Shouwa, Taishou, Meiji
    ];
    class Wareki {
        gengou;
        nen;
        constructor(gengou, nen) {
            this.gengou = gengou;
            this.nen = nen;
        }
        getLabel() {
            return this.gengou.kanji;
        }
        getNen() {
            return this.nen;
        }
    }
    Impl.Wareki = Wareki;
    class Seireki {
        year;
        constructor(year) {
            this.year = year;
        }
        getLabel() {
            return "西暦";
        }
        getNen() {
            return this.year;
        }
    }
    Impl.Seireki = Seireki;
    function toWareki(d) {
        for (let i = 0; i < GengouList.length; i++) {
            const g = GengouList[i];
            if (g.isMyDate(d)) {
                return new Wareki(g, g.getNenOf(d.year));
            }
        }
        return new Seireki(d.year);
    }
    Impl.toWareki = toWareki;
    function fromGengou(gengou, nen) {
        if (nen < 1) {
            throw new Error(`Inalid nen: ${nen}`);
        }
        return nen - 1 + gengou.nenStartYear;
    }
    Impl.fromGengou = fromGengou;
    function stringToGengou(s) {
        for (let i = 0; i < GengouList.length; i++) {
            const g = GengouList[i];
            if (g.kanji === s) {
                return g;
            }
        }
        if (s === "西暦") {
            return new Gregorian();
        }
        else {
            return null;
        }
    }
    Impl.stringToGengou = stringToGengou;
    const youbi = ["日", "月", "火", "水", "木", "金", "土"];
    const dayOfWeeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    function toYoubi(dayOfWeek) {
        return youbi[dayOfWeek % 7];
    }
    Impl.toYoubi = toYoubi;
    class KanjiDate {
        year;
        month;
        day;
        hour;
        minute;
        second;
        msec;
        dayOfWeek;
        dayOfWeekAlpha;
        wareki;
        gengou;
        nen;
        youbi;
        constructor(date) {
            this.year = date.getFullYear();
            this.month = date.getMonth() + 1;
            this.day = date.getDate();
            this.hour = date.getHours();
            this.minute = date.getMinutes();
            this.second = date.getSeconds();
            this.msec = date.getMilliseconds();
            this.dayOfWeek = date.getDay();
            this.dayOfWeekAlpha = dayOfWeeks[this.dayOfWeek];
            this.wareki = toWareki(new Kdate(this.year, this.month, this.day));
            this.gengou = this.wareki.getLabel();
            this.nen = this.wareki.getNen();
            this.youbi = youbi[this.dayOfWeek];
        }
        static of(year, month, day, hour = 0, minute = 0, second = 0, msecond = 0) {
            var date = new Date(year, month - 1, day, hour, minute, second, msecond);
            return new KanjiDate(date);
        }
        static tryFromString(str) {
            let m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (m) {
                return KanjiDate.of(+m[1], +m[2], +m[3]);
            }
            m = str.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
            if (m) {
                return KanjiDate.of(+m[1], +m[2], +m[3], +m[4], +m[5], +m[6]);
            }
            return null;
        }
        static fromString(str) {
            const d = KanjiDate.tryFromString(str);
            if (d === null) {
                throw new Error("cannot convert to KanjiDate");
            }
            else {
                return d;
            }
        }
    }
    Impl.KanjiDate = KanjiDate;
    class FormatToken {
        part;
        opts;
        constructor(part, opts = []) {
            this.part = part;
            this.opts = opts;
        }
    }
    function copyArray(ar) {
        return Object.assign([], ar);
    }
    function removeElementInPlace(ar, item) {
        const i = ar.indexOf(item);
        if (i >= 0) {
            ar.splice(i, 1);
        }
    }
    const zenkakuDigits = ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９"];
    const alphaDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    function isZenkaku(c) {
        const a = c[0];
        if (zenkakuDigits.indexOf(a) >= 0) {
            return true;
        }
        else {
            switch (a) {
                case "　":
                case "元": return true;
                default: return false;
            }
        }
    }
    function isAllZenkaku(s) {
        for (let i = 0; i < s.length; i++) {
            if (!isZenkaku(s[i])) {
                return false;
            }
        }
        return true;
    }
    function toZenkaku(s) {
        return s.split("").map(c => {
            const i = alphaDigits.indexOf(c);
            if (i >= 0) {
                return zenkakuDigits[i];
            }
            else {
                switch (c) {
                    case " ": return "　";
                    default: return c;
                }
            }
        }).join("");
    }
    function pad(s, reqLen, padStr = "0") {
        const n = reqLen - s.length;
        let result = s;
        for (let i = 0; i < n; i++) {
            result = padStr + result;
        }
        return result;
    }
    const modifierMap = new Map([
        ["2", s => {
                let padStr;
                if (isAllZenkaku(s)) {
                    padStr = "０";
                }
                else {
                    padStr = "0";
                }
                return pad(s, 2, padStr);
            }],
        ["z", toZenkaku]
    ]);
    class UnknownModifierError {
        cause;
        isUnknownModifier = true;
        constructor(cause) {
            this.cause = cause;
        }
    }
    function applyModifiers(src, mods) {
        let cur = src;
        for (let i = 0; i < mods.length; i++) {
            const m = modifierMap.get(mods[i]);
            if (m == null) {
                return new UnknownModifierError(mods[i]);
            }
            else {
                cur = m(cur);
            }
        }
        return cur;
    }
    function extractOpt(key, opts) {
        const i = opts.indexOf(key);
        if (i >= 0) {
            opts.splice(i, 1);
            return true;
        }
        else {
            return false;
        }
    }
    const gengouProcessor = new class {
        process(data, opts) {
            if (extractOpt("1", opts)) {
                return data.gengou[0];
            }
            else if (extractOpt("2", opts)) {
                return data.gengou;
            }
            else if (extractOpt("a", opts)) {
                const wareki = data.wareki;
                return wareki.gengou.alpha[0];
            }
            else if (extractOpt("alpha", opts)) {
                const wareki = data.wareki;
                return wareki.gengou.alpha;
            }
            else {
                return data.gengou;
            }
        }
    };
    const nenProcessor = new class {
        process(data, opts) {
            extractOpt("1", opts);
            if (extractOpt("g", opts)) {
                if (data.nen === 1) {
                    return "元";
                }
                else {
                    return data.nen.toString();
                }
            }
            else {
                return data.nen.toString();
            }
        }
    };
    const monthProcessor = new class {
        process(data, opts) {
            return data.month.toString();
        }
    };
    const dayProcessor = new class {
        process(data, opts) {
            return data.day.toString();
        }
    };
    const dowProcessor = new class {
        process(data, opts) {
            if (extractOpt("1", opts)) {
                return data.youbi;
            }
            else if (extractOpt("2", opts)) {
                return data.youbi + "曜";
            }
            else if (extractOpt("3", opts)) {
                return data.youbi + "曜日";
            }
            else if (extractOpt("alpha", opts)) {
                return data.dayOfWeekAlpha;
            }
            else {
                {
                    return data.youbi;
                }
            }
        }
    };
    const hourProcessor = new class {
        process(data, opts) {
            if (extractOpt("12", opts)) {
                return (data.hour % 12).toString();
            }
            else {
                return data.hour.toString();
            }
        }
    };
    const minuteProcessor = new class {
        process(data, opts) {
            return data.minute.toString();
        }
    };
    const secondProcessor = new class {
        process(data, opts) {
            return data.second.toString();
        }
    };
    const ampmProcessor = new class {
        process(data, opts) {
            if (extractOpt("am/pm", opts)) {
                if (data.hour < 12) {
                    return "am";
                }
                else {
                    return "pm";
                }
            }
            else if (extractOpt("AM/PM", opts)) {
                if (data.hour < 12) {
                    return "AM";
                }
                else {
                    return "PM";
                }
            }
            else {
                if (data.hour < 12) {
                    return "午前";
                }
                else {
                    return "午後";
                }
            }
        }
    };
    const yearProcessor = new class {
        process(data, opts) {
            return data.year.toString();
        }
    };
    const processorMap = new Map([
        ["G", gengouProcessor],
        ["N", nenProcessor],
        ["M", monthProcessor],
        ["D", dayProcessor],
        ["W", dowProcessor],
        ["Y", yearProcessor],
        ["h", hourProcessor],
        ["m", minuteProcessor],
        ["s", secondProcessor],
        ["a", ampmProcessor],
    ]);
    function parseFormatString(fmtStr) {
        const items = fmtStr.split(/(\{[^}]+)\}/);
        return items.map(item => {
            if (item === "") {
                return item;
            }
            else if (item[0] === "{") {
                const iColon = item.indexOf(":");
                if (iColon >= 0) {
                    const part = item.substring(1, iColon);
                    const optStr = item.substring(iColon + 1).trim();
                    if (optStr === "") {
                        return new FormatToken(part);
                    }
                    else if (optStr.indexOf(",") >= 0) {
                        return new FormatToken(part, optStr.split(/\s*,\s*/));
                    }
                    else {
                        return new FormatToken(part, [optStr]);
                    }
                }
                else {
                    return new FormatToken(item.substring(1));
                }
            }
            else {
                return item;
            }
        });
    }
    function format(fmtStr, data) {
        return parseFormatString(fmtStr).map(item => {
            if (item instanceof FormatToken) {
                const proc = processorMap.get(item.part);
                if (!proc) {
                    throw new Error(`Unknown format: ${item.part}`);
                }
                const s = proc.process(data, item.opts);
                const result = applyModifiers(s, item.opts);
                if (result instanceof UnknownModifierError) {
                    throw new Error(`Invalid option for ${item.part}: ${result.cause}`);
                }
                else {
                    return result;
                }
            }
            else {
                return item;
            }
        }).join("");
    }
    Impl.format = format;
})(Impl || (Impl = {}));
// class Wareki {
//   constructor(
//     public gengou: string,
//     public nen: number
//   ) {}
// }
var Orig;
(function (Orig) {
    // export function toGengou(year: number, month: number, day: number): Wareki {
    //   const d = new Impl.Kdate(year, month, day);
    //   const w = Impl.toWareki(d);
    //   if( w instanceof Impl.Wareki ){
    //     return new Wareki(w.gengou.kanji, w.nen)
    //   } else {
    //     return new Wareki("西暦", w.year);
    //   }
    // }
    function fromGengou(gengou, nen) {
        const g = Impl.stringToGengou(gengou);
        if (g instanceof Impl.Gengou) {
            return Impl.fromGengou(g, nen);
        }
        else if (g instanceof Impl.Gregorian) {
            return nen;
        }
        else {
            throw new Error(`invalid gengou: ${gengou}`);
        }
    }
    Orig.fromGengou = fromGengou;
    // export function toYoubi(dayOfWeek: number): string {
    //   return Impl.toYoubi(dayOfWeek);
    // }
    Orig.f1 = "{G}{N}年{M}月{D}日（{W}）";
    Orig.f2 = "{G}{N}年{M}月{D}日";
    Orig.f3 = "{G:a}{N}.{M}.{D}";
    Orig.f4 = "{G}{N:2}年{M:2}月{D:2}日（{W}）";
    Orig.f5 = "{G}{N:2}年{M:2}月{D:2}日";
    Orig.f6 = "{G:a}{N:2}.{M:2}.{D:2}";
    Orig.f7 = "{G}{N}年{M}月{D}日（{W}） {a}{h:12}時{m}分{s}秒";
    Orig.f8 = "{G}{N:2}年{M:2}月{D:2}日（{W}） {a}{h:12,2}時{m:2}分{s:2}秒";
    Orig.f9 = "{G}{N}年{M}月{D}日（{W}） {a}{h:12}時{m}分";
    Orig.f10 = "{G}{N:2}年{M:2}月{D:2}日（{W}） {a}{h:12,2}時{m:2}分";
    Orig.f11 = "{G}{N:z}年{M:z}月{D:z}日";
    Orig.f12 = "{G}{N:z,2}年{M:z,2}月{D:z,2}日";
    Orig.f13 = "{Y}-{M:2}-{D:2}";
    Orig.f14 = "{Y}-{M:2}-{D:2} {h:2}:{m:2}:{s:2}";
    Orig.fSqlDate = Orig.f13;
    Orig.fSqlDateTime = Orig.f14;
    const msgInvalidArg = "Invalid arguments to kanjidate.format";
    function format(...args) {
        switch (args.length) {
            case 0: return Impl.format(Orig.f1, new Impl.KanjiDate(new Date()));
            case 1: return format1(args[0]);
            case 2: return format2(args[0], args[1]);
            case 4: return formatN(args[0], args[1], args[2], args[3]);
            case 5: return formatN(args[0], args[1], args[2], args[3], args[4]);
            case 6: return formatN(args[0], args[1], args[2], args[3], args[4], args[5]);
            case 7: return formatN(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            default: throw new Error(msgInvalidArg);
        }
    }
    Orig.format = format;
    function format1(arg) {
        if (typeof arg === "string") {
            const d = Impl.KanjiDate.tryFromString(arg);
            if (d === null) {
                return Impl.format(arg, new Impl.KanjiDate(new Date()));
            }
            else {
                return Impl.format(Orig.f1, d);
            }
        }
        else if (arg instanceof Date) {
            return Impl.format(Orig.f1, new Impl.KanjiDate(arg));
        }
        else {
            throw new Error(msgInvalidArg);
        }
    }
    function format2(arg1, arg2) {
        let fmt;
        if (typeof arg1 === "string") {
            fmt = arg1;
        }
        else {
            throw new Error(msgInvalidArg);
        }
        let d;
        if (typeof arg2 === "string") {
            d = Impl.KanjiDate.fromString(arg2);
        }
        else if (arg2 instanceof Date) {
            d = new Impl.KanjiDate(arg2);
        }
        else {
            throw new Error(msgInvalidArg);
        }
        return Impl.format(fmt, d);
    }
    function formatN(fmtArg, yearArg, monthArg, dayArg, hourArg, minuteArg, secondArg) {
        try {
            const fmt = fmtArg;
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
            return Impl.format(fmt, new Impl.KanjiDate(new Date(year, month - 1, day, hour, minute, second)));
        }
        catch (ex) {
            console.error(ex);
            throw new Error(msgInvalidArg);
        }
    }
})(Orig || (Orig = {}));
