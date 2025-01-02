export function lastDayOfMonth(year, month) {
    return new Date(year, month, 0).getDate();
}
export function firstDayOfWeek(aDay) {
    const dow = aDay.getDay();
    return addDays(aDay, -dow);
}
export function dateRange(startDate, n) {
    return [...Array(n)].map((_, i) => addDays(startDate, i));
}
export function addDays(date, n) {
    let d = date.getDate() + n;
    let c = new Date(date);
    c.setDate(d);
    return c;
}
export function addMonths(date, n) {
    let m = date.getMonth() + n;
    let c = new Date(date);
    c.setMonth(m);
    if (c.getDate() !== date.getDate()) {
        c.setDate(0);
    }
    return c;
}
export function addYears(date, n) {
    let y = date.getFullYear() + n;
    let c = new Date(date);
    c.setFullYear(y);
    if (c.getDate() !== date.getDate()) {
        c.setDate(0);
    }
    return c;
}
