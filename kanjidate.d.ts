export * from "./age";
export * from "./manip";
export * from "./formatter";
declare class OrderedDate {
    year: number;
    month: number;
    day: number;
    constructor(year: number, month: number, day: number);
    static ge(a: OrderedDate, b: OrderedDate): boolean;
    static fromDate(date: Date): OrderedDate;
}
export declare class Gengou {
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
export declare class Gregorian {
    isGregorian: boolean;
    static fromString(s: string): Gregorian | null;
}
export declare function toYoubi(dayOfWeek: number): string;
export declare const Meiji: Gengou;
export declare const Taishou: Gengou;
export declare const Shouwa: Gengou;
export declare const Heisei: Gengou;
export declare const Reiwa: Gengou;
export declare const GengouList: Array<Gengou>;
export declare function nenRangeOf(g: Gengou): [number, number];
export declare class JapaneseYear {
    era: Gengou | Gregorian;
    nen: number;
    constructor(year: number, month: number, day: number);
    static fromDate(date: Date): JapaneseYear;
}
export declare class KanjiDate {
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
