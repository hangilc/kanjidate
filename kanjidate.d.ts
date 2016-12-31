export interface GengouNen {
	gengou: string;
	nen: number;
}
export function format(): string;
export function format(date: Date): string;
export function format(sqlDate: string): string;
export function format(fmt: string, year: number, month: number, day: number): string;
export function format(fmt: string, year: number, month: number, day: number,
	hour: number, minute: number, second: number): string;
export function format(fmt: string, date: Date): string;
export function format(fmt: string, sqlDate: string): string;
export function toGengou(year: number, month: number, day: number): GengouNen;
export function fromGengou(gengou: string, nen: number): number;
export function toYoubi(dayOfWeek: number): string;
export const f1: string;
export const f2: string;
export const f3: string;
export const f4: string;
export const f5: string;
export const f6: string;
export const f7: string;
export const f8: string;
export const f9: string;
export const f10: string;
export const f11: string;
export const f12: string;
export const f13: string;
export const f14: string;
export const fSqlDate: string;
export const fSqlDateTime: string;
