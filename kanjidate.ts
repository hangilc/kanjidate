namespace Impl {
  export class Kdate {
    constructor(
      public year: number,
      public month: number,
      public day: number 
    ) {}
  
    static ge(a: Kdate, b: Kdate): boolean {
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

  export class Gengou {
    constructor(
      public kanji: string,
      public alpha: string,
      public start: Kdate,
      public nenStartYear: number = start.year
    ) { }

    getLabel(): string {
      return this.kanji;
    }

    isMyDate(a: Kdate): boolean {
      return Kdate.ge(a, this.start);
    }
  
    getNenOf(year: number): number {
      return year - this.nenStartYear + 1;
    }
  }

  export class Gregorian {
    private identity: string = "";
  }
  
  const Meiji: Gengou = 
    new Gengou("明治", "Meiji", new Kdate(1873, 1, 1), 1868);
  const Taishou: Gengou =
    new Gengou("大正", "Taishou", new Kdate(1912, 7, 30))
  const Shouwa: Gengou = 
    new Gengou("昭和", "Shouwa", new Kdate(1926, 12, 25))
  const Heisei: Gengou =
    new Gengou("平成", "Heisei", new Kdate(1989, 1, 8));
  const Reiwa: Gengou =
    new Gengou("令和", "Reiwa", new Kdate(2019, 5, 1))
  
  const GengouList: Array<Gengou> = [
    Reiwa, Heisei, Shouwa, Taishou, Meiji
  ]
  
  export interface LabeledYear {
    getLabel(): string;
    getNen(): number;
  }
  
  export class Wareki implements LabeledYear {
    constructor(
      public gengou: Gengou, 
      public nen: number
    ) { }

    getLabel(): string {
      return this.gengou.kanji;
    }

    getNen(): number {
      return this.nen;
    }
  }

  export class Seireki implements LabeledYear {
    constructor(
      public year: number
    ) {}

    getLabel(): string {
      return "西暦";
    }

    getNen(): number {
      return this.year;
    }

  }
  
  export function toWareki(d: Kdate): Wareki | Seireki {
    for(let i=0;i<GengouList.length;i++){
      const g = GengouList[i];
      if( g.isMyDate(d) ){
        return new Wareki(g, g.getNenOf(d.year));
      }
    }
    return new Seireki(d.year);
  }

  export function fromGengou(gengou: Gengou, nen: number): number {
    if( nen < 1 ){
      throw new Error(`Inalid nen: ${nen}`);
    }
    return nen - 1 + gengou.nenStartYear;
  }

  export function stringToGengou(s: string): Gengou | Gregorian | null {
    for(let i=0;i<GengouList.length;i++){
      const g = GengouList[i];
      if( g.kanji === s ){
        return g;
      }
    }
    if( s === "西暦" ){
      return new Gregorian();
    } else {
      return null;
    }
  }
  
  const youbi = ["日", "月", "火", "水", "木", "金", "土"];
  const dayOfWeeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  export function toYoubi(dayOfWeek: number) {
    return youbi[dayOfWeek % 7];
  }

  export class KanjiDate{
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    msec: number;
    dayOfWeek: number;
    dayOfWeekAlpha: string;
    wareki: LabeledYear;
    gengou: string;
    nen: number;
    youbi: string;

    constructor(date: Date) {
      this.year = date.getFullYear();
      this.month = date.getMonth()+1;
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

    static of(year: number, month: number, day: number, 
      hour: number = 0, minute: number = 0, second: number = 0, msecond: number = 0): KanjiDate {
        var date = new Date(year, month-1, day, hour, minute, second, msecond);
        return new KanjiDate(date);
    }

    static tryFromString(str: string): KanjiDate | null {
        let m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if( m ){
          return KanjiDate.of(+m[1], +m[2], +m[3]);
        }
        m = str.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
        if( m ){
          return KanjiDate.of(+m[1], +m[2], +m[3], +m[4], +m[5], +m[6]);
        }
        return null;
    }

    static fromString(str: string): KanjiDate {
      const d = KanjiDate.tryFromString(str);
      if( d === null ){
        throw new Error("cannot convert to KanjiDate");
      } else {
        return d;
      }
    }
  }

  class FormatToken {
    constructor(
      public part: string,
      public opts: Array<string> = []
    ) {}
  }

  interface IProcessor {
    process(date: Kdate, opts: Array<string>): string;
  }

  function copyArray<T>(ar: Array<T>): Array<T> {
    return Object.assign([], ar);
  }

  function removeElementInPlace<T>(ar: Array<T>, item: T): void {
    const i = ar.indexOf(item);
    if( i >= 0 ) {
      ar.splice(i, 1);
    }
  }

  const zenkakuDigits = ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９"];
  const alphaDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  function isZenkaku(c: string): boolean {
    const a = c[0];
    if( zenkakuDigits.indexOf(a) >= 0 ){
      return true;
    } else {
      switch(a){
        case "　": case "元": return true;
        default: return false;
      }
    }
  }

  function isAllZenkaku(s: string): boolean {
    for(let i=0;i<s.length;i++){
      if( !isZenkaku(s[i])){
        return false;
      }
    }
    return true;
  }

  function toZenkaku(s: string): string {
    return s.split("").map(c => {
      const i = alphaDigits.indexOf(c);
      if( i >= 0 ) {
        return zenkakuDigits[i];
      } else {
        switch(c){
          case " ":return "　";
          default: return c;
        }
      }
    }).join("");
  }

  function pad(s: string, reqLen: number, padStr: string = "0"): string {
    const n = reqLen - s.length;
    let result = s;
    for(let i=0;i<n;i++){
      result = padStr + result;
    }
    return result;
  }

  const modifierMap = new Map<string, (s: string) => string>([
    ["2", s => {
      let padStr: string
      if( isAllZenkaku(s) ){
        padStr = "０";
      } else {
        padStr = "0";
      }
      return pad(s, 2, padStr);
    }],
    ["z", toZenkaku]
  ]);

  class UnknownModifierError {
    constructor(
      public cause: string
    ) {}
  }

  function applyModifiers(src: string, mods: Array<string>): string | UnknownModifierError {
    let cur = src;
    for(let i=0;i<mods.length;i++) {
      const m = modifierMap.get(mods[i]);
      if( m == null ){
        return new UnknownModifierError(mods[i]);
      } else {
        cur = m(cur);
      }
    }
    return cur;
  }

  function extractOpt(key: string, opts: Array<string>): boolean {
    const i = opts.indexOf(key);
    if( i >= 0 ) {
      opts.splice(i, 1);
      return true;
    } else {
      return false;
    }
  }

  const gengouProcessor: IProcessor = new class implements IProcessor {
    process(data: KanjiDate, opts: Array<string>): string {
      if( extractOpt("1", opts) ){
        return data.gengou[0];
      } else if( extractOpt("2", opts) ){
        return data.gengou;
      } else if( extractOpt("a", opts) ){
        const wareki: Impl.Wareki = data.wareki as Wareki;
        return wareki.gengou.alpha[0];
      } else if( extractOpt("alpha", opts) ){
        const wareki: Impl.Wareki = data.wareki as Wareki;
        return wareki.gengou.alpha;
      } else {
        return data.gengou;
      }
    }
  };

  const nenProcessor: IProcessor = new class implements IProcessor {
    process(data: KanjiDate, opts: Array<string>): string {
      extractOpt("1", opts);
      if( extractOpt("g", opts) ){
        if( data.nen === 1 ){
          return "元";
        } else {
          return data.nen.toString();
        }
      } else {
        return data.nen.toString();
      }
    }
  }

  const monthProcessor: IProcessor = new class implements IProcessor {
    process(data: KanjiDate, opts: Array<string>): string {
      return data.month.toString();
    }
  }

  const dayProcessor: IProcessor = new class implements IProcessor {
    process(data: KanjiDate, opts: Array<string>): string {
      return data.day.toString();
    }
  }

  const dowProcessor: IProcessor = new class implements IProcessor {
    process(data: KanjiDate, opts: Array<string>): string {
      if( extractOpt("1", opts) ){
        return data.youbi;
      } else if( extractOpt("2", opts) ){
        return data.youbi + "曜";
      } else if( extractOpt("3", opts) ){
        return data.youbi + "曜日";
      } else if( extractOpt("alpha", opts) ){
        return data.dayOfWeekAlpha;
      } else {{
        return data.youbi;
      }}
    }
  }

  const hourProcessor: IProcessor = new class implements IProcessor {
    process(data: KanjiDate, opts: Array<string>): string {
      if( extractOpt("12", opts) ){
        return (data.hour % 12).toString();
      } else {
        return data.hour.toString();
      }
    }
  }

  const minuteProcessor: IProcessor = new class implements IProcessor {
    process(data: KanjiDate, opts: Array<string>): string {
      return data.minute.toString();
    }
  }

  const secondProcessor: IProcessor = new class implements IProcessor {
    process(data: KanjiDate, opts: Array<string>): string {
      return data.second.toString();
    }
  }

  const ampmProcessor: IProcessor = new class implements IProcessor {
    process(data: KanjiDate, opts: Array<string>): string {
      if( extractOpt("am/pm", opts) ){
        if( data.hour < 12 ){
          return "am";
        } else {
          return "pm";
        }
      } else if( extractOpt("AM/PM", opts) ){
        if( data.hour < 12 ){
          return "AM";
        } else {
          return "PM";
        }
      } else {
        if( data.hour < 12 ){
          return "午前";
        } else {
          return "午後";
        }
      }
    }
  }

  const yearProcessor: IProcessor = new class implements IProcessor {
    process(data: KanjiDate, opts: Array<string>): string {
      return data.year.toString();
    }
  }

  const processorMap: Map<string, IProcessor> = new Map([
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

  function parseFormatString(fmtStr: string): Array<FormatToken | string> {
    const items: Array<string> = fmtStr.split(/(\{[^}]+)\}/);
    return items.map(item => {
      if( item === "" ){
        return item;
      } else if( item[0] === "{" ) {
        const iColon = item.indexOf(":");
        if( iColon >= 0 ) {
          const part = item.substring(1, iColon);
          const optStr = item.substring(iColon+1).trim();
          if( optStr === "" ){
            return new FormatToken(part);
          } else if( optStr.indexOf(",") >= 0 ){
            return new FormatToken(part, optStr.split(/\s*,\s*/));
          } else {
            return new FormatToken(part, [optStr])
          }
        } else {
          return new FormatToken(item.substring(1));
        }
      } else {
        return item;
      }
    });
  }

  export function format(fmtStr: string, data: KanjiDate): string {
    return parseFormatString(fmtStr).map(item => {
      if( item instanceof FormatToken ){
        const proc = processorMap.get(item.part);
        if( !proc ){
          throw new Error(`Unknown format: ${item.part}`)
        }
        const s = proc.process(data, item.opts);
        const result = applyModifiers(s, item.opts);
        if( result instanceof UnknownModifierError ){
          throw new Error(`Invalid option for ${item.part}: ${result.cause}`);
        } else {
          return result;
        }
      } else {
        return item;
      }
    }).join("");
  }
}

class Wareki {
  constructor(
    public gengou: string,
    public nen: number
  ) {}
}


export function toGengou(year: number, month: number, day: number): Wareki {
  const d = new Impl.Kdate(year, month, day);
  const w = Impl.toWareki(d);
  if( w instanceof Impl.Wareki ){
    return new Wareki(w.gengou.kanji, w.nen)
  } else {
    return new Wareki("西暦", w.year);
  }
}

export function fromGengou(gengou: string, nen: number): number {
  const g = Impl.stringToGengou(gengou);
  if( g instanceof Impl.Gengou ){
    return Impl.fromGengou(g, nen);
  } else if( g instanceof Impl.Gregorian ){
    return nen;
  } else {
    throw new Error(`invalid gengou: ${gengou}`);
  }
}

export function toYoubi(dayOfWeek: number): string {
  return Impl.toYoubi(dayOfWeek);
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

export function format(): string;
export function format(arg: string | Date): string;
export function format(fmt: string, date: Date): string;
export function format(fmt: string, date: string): string;
export function format(fmt: string, year: number, month: number, day: number,
  hour?: number, minute?: number, second?: number): string;
export function format(...args: any[]): string {
  switch(args.length){
    case 0: return Impl.format(f1, new Impl.KanjiDate(new Date()));
    case 1: return format1(args[0]);
    case 2: return format2(args[0], args[1]);
    case 4: return formatN(args[0], args[1], args[2], args[3]);
    case 5: return formatN(args[0], args[1], args[2], args[3], args[4]);
    case 6: return formatN(args[0], args[1], args[2], args[3], args[4], args[5]);
    case 7: return formatN(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    default: throw new Error(msgInvalidArg);
  }
}

function format1(arg: any): string{
  if( typeof arg === "string" ){
    const d = Impl.KanjiDate.tryFromString(arg);
    if( d === null ){
      return Impl.format(arg, new Impl.KanjiDate(new Date()));
    } else {
      return Impl.format(f1, d);
    }
  } else if( arg instanceof Date ){
    return Impl.format(f1, new Impl.KanjiDate(arg));
  } else {
    throw new Error(msgInvalidArg);
  }
}

function format2(arg1: any, arg2: any): string {
  let fmt: string
  if( typeof arg1 === "string" ){
    fmt = arg1;
  } else {
    throw new Error(msgInvalidArg);
  }
  let d: Impl.KanjiDate;
  if( typeof arg2 === "string" ){
    d = Impl.KanjiDate.fromString(arg2);
  } else if( arg2 instanceof Date ){
    d = new Impl.KanjiDate(arg2);
  } else {
    throw new Error(msgInvalidArg);
  }
  return Impl.format(fmt, d);
}

function formatN(fmtArg: any, yearArg: any, monthArg: any, dayArg: any,
  hourArg?: any, minuteArg?: any, secondArg?: any): string {
    try {
      const fmt: string = fmtArg as string;
      const year: number = yearArg as number;
      const month: number = monthArg as number;
      const day: number = dayArg as number;
      let hour: number;
      if( hourArg === undefined ){
        hour = 0;
      } else {
        hour = hourArg as number;
      }
      let minute: number;
      if( minuteArg === undefined ){
        minute = 0;
      } else {
        minute = minuteArg as number;
      }
      let second: number;
      if( secondArg === undefined ){
        second = 0;
      } else {
        second = secondArg as number;
      }
      return Impl.format(fmt, new Impl.KanjiDate(
        new Date(year, month - 1, day, hour, minute, second)
      ));
    } catch(ex) {
      console.error(ex);
      throw new Error(msgInvalidArg);
    }
  }
