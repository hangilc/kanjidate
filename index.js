export { KanjiDate, toYoubi, nenRangeOf, Meiji, Taishou, Shouwa, Heisei, Reiwa, Gengou, GengouList, } from "./kanjidate";
export { calcAge } from "./age";
export { lastDayOfMonth, firstDayOfWeek, dateRange, addDays, addMonths, addYears, } from "./manip";
import { JapaneseYear, Gengou, Gregorian, KanjiDate } from "./kanjidate";
import { format as fmt } from "./formatter";
export function toGengou(year, month, day) {
    const jpy = new JapaneseYear(year, month, day);
    if (jpy.era instanceof Gregorian) {
        return { gengou: "西暦", nen: year };
    }
    else {
        return { gengou: jpy.era.getLabel(), nen: jpy.nen };
    }
}
export function fromGengou(gengou, nen) {
    if (nen < 1) {
        throw new Error("Invalid nen: " + nen);
    }
    const g = Gengou.fromString(gengou);
    if (g != null) {
        return g.nenStartYear - 1 + nen;
    }
    const s = Gregorian.fromString(gengou);
    if (s != null) {
        return nen;
    }
    throw new Error("Invalid gengou: " + gengou);
}
export const f1 = "{G}{N}年{M}月{D}日（{W}）";
export const f2 = "{G}{N}年{M}月{D}日";
export const f3 = "{G:a}{N}.{M}.{D}";
export const f4 = "{G}{N:2}年{M:2}月{D:2}日（{W}）";
export const f5 = "{G}{N:2}年{M:2}月{D:2}日";
export const f6 = "{G:a}{N:2}.{M:2}.{D:2}";
export const f7 = "{G}{N}年{M}月{D}日（{W}） {a}{h:12}時{m}分{s}秒";
export const f8 = "{G}{N:2}年{M:2}月{D:2}日（{W}） {a}{h:12,2}時{m:2}分{s:2}秒";
export const f9 = "{G}{N}年{M}月{D}日（{W}） {a}{h:12}時{m}分";
export const f10 = "{G}{N:2}年{M:2}月{D:2}日（{W}） {a}{h:12,2}時{m:2}分";
export const f11 = "{G}{N:z}年{M:z}月{D:z}日";
export const f12 = "{G}{N:z,2}年{M:z,2}月{D:z,2}日";
export const f13 = "{Y}-{M:2}-{D:2}";
export const f14 = "{Y}-{M:2}-{D:2} {h:2}:{m:2}:{s:2}";
export const fSqlDate = f13;
export const fSqlDateTime = f14;
const msgInvalidArg = "Invalid arguments to kanjidate.format";
export function format(...args) {
    switch (args.length) {
        case 0: return fmt(f1, new KanjiDate(new Date()));
        case 1: return format1(args[0]);
        case 2: return format2(args[0], args[1]);
        case 4: return formatN(args[0], args[1], args[2], args[3]);
        case 5: return formatN(args[0], args[1], args[2], args[3], args[4]);
        case 6: return formatN(args[0], args[1], args[2], args[3], args[4], args[5]);
        case 7: return formatN(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        default: throw new Error(msgInvalidArg);
    }
}
function format1(arg) {
    if (typeof arg === "string") {
        const d = KanjiDate.tryFromString(arg);
        if (d === null) {
            return fmt(arg, new KanjiDate(new Date()));
        }
        else {
            return fmt(f1, d);
        }
    }
    else if (arg instanceof Date) {
        return fmt(f1, new KanjiDate(arg));
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
        d = KanjiDate.fromString(arg2);
    }
    else if (arg2 instanceof Date) {
        d = new KanjiDate(arg2);
    }
    else {
        throw new Error(msgInvalidArg);
    }
    return fmt(fmtStr, d);
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
        return fmt(fmtArg, new KanjiDate(new Date(year, month - 1, day, hour, minute, second)));
    }
    catch (ex) {
        console.error(ex);
        throw new Error(msgInvalidArg);
    }
}
