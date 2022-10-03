interface GengouNen {
	gengou: string;
	nen: number;
}
declare function format(): string;
declare function format(date: Date): string;
declare function format(sqlDate: string): string;
declare function format(fmt: string, year: number, month: number, day: number): string;
declare function format(fmt: string, year: number, month: number, day: number,
	hour: number, minute: number, second: number): string;
declare function format(fmt: string, date: Date): string;
declare function format(fmt: string, sqlDate: string): string;
declare function toGengou(year: number, month: number, day: number): GengouNen;
declare function fromGengou(gengou: string, nen: number): number;
declare function toYoubi(dayOfWeek: number): string;
declare const f1: string;
declare const f2: string;
declare const f3: string;
declare const f4: string;
declare const f5: string;
declare const f6: string;
declare const f7: string;
declare const f8: string;
declare const f9: string;
declare const f10: string;
declare const f11: string;
declare const f12: string;
declare const f13: string;
declare const f14: string;
declare const fSqlDate: string;
declare const fSqlDateTime: string;

export { GengouNen, f1, f10, f11, f12, f13, f14, f2, f3, f4, f5, f6, f7, f8, f9, fSqlDate, fSqlDateTime, format, fromGengou, toGengou, toYoubi };
