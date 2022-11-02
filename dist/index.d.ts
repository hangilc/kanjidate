declare function calcAge(birthday: Date, at?: Date): number;

declare class OrderedDate {
    year: number;
    month: number;
    day: number;
    constructor(year: number, month: number, day: number);
    static ge(a: OrderedDate, b: OrderedDate): boolean;
    static fromDate(date: Date): OrderedDate;
}
declare class Gengou {
    kanji: string;
    alpha: string;
    start: OrderedDate;
    nenStartYear: number;
    constructor(kanji: string, alpha: string, start: OrderedDate, nenStartYear?: number);
    getLabel(): string;
    isMyDate(a: OrderedDate): boolean;
    getNenOf(year: number): number;
    static fromString(s: string): Gengou | null;
}
declare class Gregorian {
    isGregorian: boolean;
    static fromString(s: string): Gregorian | null;
}
declare function toYoubi(dayOfWeek: number): string;
declare class JapaneseYear {
    era: Gengou | Gregorian;
    nen: number;
    constructor(year: number, month: number, day: number);
    static fromDate(date: Date): JapaneseYear;
}
declare class KanjiDate {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    msec: number;
    dayOfWeek: number;
    dayOfWeekAlpha: string;
    japaneseYear: JapaneseYear;
    gengou: string;
    nen: number;
    youbi: string;
    constructor(date: Date);
    static of(year: number, month: number, day: number, hour?: number, minute?: number, second?: number, msecond?: number): KanjiDate;
    static tryFromString(str: string): KanjiDate | null;
    static fromString(str: string): KanjiDate;
}

declare function lastDayOfMonth(year: number, month: number): number;
declare function addDays(date: Date, n: number): Date;
declare function addMonths(date: Date, n: number): Date;
declare function addYears(date: Date, n: number): Date;

interface Wareki {
    gengou: string;
    nen: number;
}
declare function toGengou(year: number, month: number, day: number): Wareki;
declare function fromGengou(gengou: string, nen: number): number;
declare const f1 = "{G}{N}\u5E74{M}\u6708{D}\u65E5\uFF08{W}\uFF09";
declare const f2 = "{G}{N}\u5E74{M}\u6708{D}\u65E5";
declare const f3 = "{G:a}{N}.{M}.{D}";
declare const f4 = "{G}{N:2}\u5E74{M:2}\u6708{D:2}\u65E5\uFF08{W}\uFF09";
declare const f5 = "{G}{N:2}\u5E74{M:2}\u6708{D:2}\u65E5";
declare const f6 = "{G:a}{N:2}.{M:2}.{D:2}";
declare const f7 = "{G}{N}\u5E74{M}\u6708{D}\u65E5\uFF08{W}\uFF09 {a}{h:12}\u6642{m}\u5206{s}\u79D2";
declare const f8 = "{G}{N:2}\u5E74{M:2}\u6708{D:2}\u65E5\uFF08{W}\uFF09 {a}{h:12,2}\u6642{m:2}\u5206{s:2}\u79D2";
declare const f9 = "{G}{N}\u5E74{M}\u6708{D}\u65E5\uFF08{W}\uFF09 {a}{h:12}\u6642{m}\u5206";
declare const f10 = "{G}{N:2}\u5E74{M:2}\u6708{D:2}\u65E5\uFF08{W}\uFF09 {a}{h:12,2}\u6642{m:2}\u5206";
declare const f11 = "{G}{N:z}\u5E74{M:z}\u6708{D:z}\u65E5";
declare const f12 = "{G}{N:z,2}\u5E74{M:z,2}\u6708{D:z,2}\u65E5";
declare const f13 = "{Y}-{M:2}-{D:2}";
declare const f14 = "{Y}-{M:2}-{D:2} {h:2}:{m:2}:{s:2}";
declare const fSqlDate = "{Y}-{M:2}-{D:2}";
declare const fSqlDateTime = "{Y}-{M:2}-{D:2} {h:2}:{m:2}:{s:2}";
declare function format(): string;
declare function format(arg: string | Date): string;
declare function format(fmt: string, date: Date): string;
declare function format(fmt: string, date: string): string;
declare function format(fmt: string, year: number, month: number, day: number, hour?: number, minute?: number, second?: number): string;

export { KanjiDate, Wareki, addDays, addMonths, addYears, calcAge, f1, f10, f11, f12, f13, f14, f2, f3, f4, f5, f6, f7, f8, f9, fSqlDate, fSqlDateTime, format, fromGengou, lastDayOfMonth, toGengou, toYoubi };
