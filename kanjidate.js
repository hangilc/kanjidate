"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = exports.fSqlDateTime = exports.fSqlDate = exports.f14 = exports.f13 = exports.f12 = exports.f11 = exports.f10 = exports.f9 = exports.f8 = exports.f7 = exports.f6 = exports.f5 = exports.f4 = exports.f3 = exports.f2 = exports.f1 = exports.toYoubi = exports.fromGengou = exports.toGengou = void 0;
var Impl;
(function (Impl) {
    class Kdate {
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
    }
    Impl.Gengou = Gengou;
    class Gregorian {
        constructor() {
            this.identity = "";
        }
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
class Wareki {
    constructor(gengou, nen) {
        this.gengou = gengou;
        this.nen = nen;
    }
}
function toGengou(year, month, day) {
    const d = new Impl.Kdate(year, month, day);
    const w = Impl.toWareki(d);
    if (w instanceof Impl.Wareki) {
        return new Wareki(w.gengou.kanji, w.nen);
    }
    else {
        return new Wareki("西暦", w.year);
    }
}
exports.toGengou = toGengou;
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
exports.fromGengou = fromGengou;
function toYoubi(dayOfWeek) {
    return Impl.toYoubi(dayOfWeek);
}
exports.toYoubi = toYoubi;
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
        case 0: return Impl.format(exports.f1, new Impl.KanjiDate(new Date()));
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
        const d = Impl.KanjiDate.tryFromString(arg);
        if (d === null) {
            return Impl.format(arg, new Impl.KanjiDate(new Date()));
        }
        else {
            return Impl.format(exports.f1, d);
        }
    }
    else if (arg instanceof Date) {
        return Impl.format(exports.f1, new Impl.KanjiDate(arg));
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
