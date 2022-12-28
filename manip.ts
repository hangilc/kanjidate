export function lastDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function firstDayOfWeek(aDay: Date): Date {
  const dow = aDay.getDay();
  return addDays(aDay, -dow);
}

export function dateRange(startDate: Date, n: number): Date[] {
  return [...Array(n)].map((_, i) => addDays(startDate, i));
}

export function addDays(date: Date, n: number): Date {
  let d: number = date.getDate() + n;
  let c = new Date(date);
  c.setDate(d);
  return c;
}

export function addMonths(date: Date, n: number): Date {
  let m: number = date.getMonth() + n;
  let c = new Date(date);
  c.setMonth(m);
  if( c.getDate() !== date.getDate() ){
    c.setDate(0);
  }
  return c;
}

export function addYears(date: Date, n: number): Date {
  let y: number = date.getFullYear() + n;
  let c = new Date(date);
  c.setFullYear(y);
  if( c.getDate() !== date.getDate() ){
    c.setDate(0);
  }
  return c;
}

