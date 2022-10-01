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
  
    isMyDate(a: Kdate): boolean {
      return Kdate.ge(a, this.start);
    }
  
    getNenOf(year: number): number {
      return year - this.nenStartYear + 1;
    }
  }

  export class Gregorian { }
  
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
  
  export class Wareki {
    constructor(
      public gengou: Gengou, 
      public nen: number
    ) { }
  }

  export class Seireki {
    constructor(
      public year: number
    ) {}
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
    return nen - 1 + gengou.nenStartYear;
  }

  export function stringToGengou(s: string): Gengou | Gregorian {
    for(let i=0;i<GengouList.length;i++){
      const g = GengouList[i];
      if( g.kanji === s ){
        return g;
      }
    }
    return new Gregorian();
  }
  
  const youbi = ["日", "月", "火", "水", "木", "金", "土"];
  const dayOfWeeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  export function toYoubi(dayOfWeek: number) {
    return youbi[dayOfWeek % 7];
  }

  export class KanjiDate{
    public year: number;
    public month: number;
    public day: number;
    public hour: number;
    public minute: number;
    public second: number;
    public msec: number;
    public dayOfWeek: number;
    public dayOfWeekAlpha: string;
    public gengou: Gengou | Gregorian;
    public nen: number;
    public youbi: string;

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
      var g = toGengou(this.year, this.month, this.day);
      this.gengou = g.gengou;
      this.nen = g.nen;
      this.youbi = youbi[this.dayOfWeek];
    }

    static of(year: number, month: number, day: number, 
      hour: number = 0, minute: number = 0, second: number = 0, msecond: number = 0): KanjiDate {
        var date = new Date(year, month-1, day, hour, minute, second, msecond);
        return new KanjiDate(date);
      }

    static fromString(str: string){
        let m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if( m ){
          return KanjiDate.of(+m[1], +m[2], +m[3]);
        }
        m = str.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
        if( m ){
          return KanjiDate.of(+m[1], +m[2], +m[3], +m[4], +m[5], +m[6]);
        }
        throw new Error("cannot convert to KanjiDate");
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
      const g = data.gengou as Gengou;
      if( extractOpt("1", opts) ){
        return g.kanji[0];
      } else if( extractOpt("2", opts) ){
        return g.kanji;
      } else if( extractOpt("a", opts) ){
        return g.alpha[0];
      } else if( extractOpt("alpha", opts) ){
        return g.alpha;
      } else {
        return g.kanji;
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

  const processorMap: Map<string, IProcessor> = new Map([
    ["G", gengouProcessor],
    ["N", nenProcessor],
    ["M", monthProcessor],
    ["D", dayProcessor],
    ["W", dowProcessor],
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

  function format(fmtStr: string, data: KanjiDate): string {
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
  } else {
    return nen;
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


// // function gengouToAlpha(gengou: string): string {
// //   switch (gengou) {
// //     case "令和": return "Reiwa";
// //     case "平成": return "Heisei";
// //     case "昭和": return "Shouwa";
// //     case "大正": return "Taishou";
// //     case "明治": return "Meiji";
// //     default: throw new Error("unknown gengou: " + gengou);
// //   }
// // }

// function padLeft(str: string, n: number, ch: string): string {
//   let m = n - str.length;
//   let pad = "";
//   while (m-- > 0) {
//     pad += ch;
//   }
//   return pad + str;
// }


// function isZenkakuDigit(ch: string) {
//   return zenkakuDigits.indexOf(ch) >= 0;
// }

// function isAlphaDigit(ch: string) {
//   return alphaDigits.indexOf(ch) >= 0;
// }

// function alphaDigitToZenkaku(ch: string) {
//   const i = alphaDigits.indexOf(ch);
//   return i >= 0 ? zenkakuDigits[i] : ch;
// }

// function isDateObject(obj: any): boolean {
//   return obj instanceof Date;
// }

// function removeOpt(opts: Array<string>, what: string): Array<string> {
//   const result: Array<string> = [];
//   for (let i = 0; i < opts.length; i++) {
//     const opt = opts[i];
//     if (opt === what) {
//       continue;
//     } else {
//       result.push(opt);
//     }
//   }
//   return result;
// }

// /////////////////////////////////////////////




// exports.toYoubi = toYoubi;

// function KanjiDate(date) {
//   this.year = date.getFullYear();
//   this.month = date.getMonth() + 1;
//   this.day = date.getDate();
//   this.hour = date.getHours();
//   this.minute = date.getMinutes();
//   this.second = date.getSeconds();
//   this.msec = date.getMilliseconds();
//   this.dayOfWeek = date.getDay();
//   var g = toGengou(this.year, this.month, this.day);
//   this.gengou = g.gengou;
//   this.nen = g.nen;
//   this.youbi = youbi[this.dayOfWeek];
// }

// function KanjiDateExplicit(year, month, day, hour, minute, second, millisecond) {
//   if (hour === undefined) hour = 0;
//   if (minute === undefined) minute = 0;
//   if (second === undefined) second = 0;
//   if (millisecond === undefined) millisecond = 0;
//   var date = new Date(year, month - 1, day, hour, minute, second, millisecond);
//   return new KanjiDate(date);
// }

// function KanjiDateFromString(str) {
//   var m;
//   m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
//   if (m) {
//     return KanjiDateExplicit(+m[1], +m[2], +m[3]);
//   }
//   m = str.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
//   if (m) {
//     return KanjiDateExplicit(+m[1], +m[2], +m[3], +m[4], +m[5], +m[6]);
//   }
//   throw new Error("cannot convert to KanjiDate");
// }

// function parseFormatString(fmtStr) {
//   var result = [];
//   var parts = fmtStr.split(/(\{[^}]+)\}/);
//   parts.forEach(function (part) {
//     if (part === "") return;
//     if (part[0] === "{") {
//       part = part.substring(1);
//       var token = { opts: [] };
//       var colon = part.indexOf(":");
//       if (part.indexOf(":") >= 0) {
//         token.part = part.substring(0, colon);
//         var optStr = part.substring(colon + 1).trim();
//         if (optStr !== "") {
//           if (optStr.indexOf(",") >= 0) {
//             token.opts = optStr.split(/\s*,\s*/);
//           } else {
//             token.opts = [optStr];
//           }
//         }
//       } else {
//         token.part = part;
//       }
//       result.push(token);
//     } else {
//       result.push(part);
//     }
//   });
//   return result;
// }

// var format1 = "{G}{N}年{M}月{D}日（{W}）";
// var format2 = "{G}{N}年{M}月{D}日";
// var format3 = "{G:a}{N}.{M}.{D}";
// var format4 = "{G}{N:2}年{M:2}月{D:2}日（{W}）";
// var format5 = "{G}{N:2}年{M:2}月{D:2}日";
// var format6 = "{G:a}{N:2}.{M:2}.{D:2}";
// var format7 = "{G}{N}年{M}月{D}日（{W}） {a}{h:12}時{m}分{s}秒";
// var format8 = "{G}{N:2}年{M:2}月{D:2}日（{W}） {a}{h:12,2}時{m:2}分{s:2}秒";
// var format9 = "{G}{N}年{M}月{D}日（{W}） {a}{h:12}時{m}分";
// var format10 = "{G}{N:2}年{M:2}月{D:2}日（{W}） {a}{h:12,2}時{m:2}分";
// var format11 = "{G}{N:z}年{M:z}月{D:z}日";
// var format12 = "{G}{N:z,2}年{M:z,2}月{D:z,2}日";
// var format13 = "{Y}-{M:2}-{D:2}";
// var format14 = "{Y}-{M:2}-{D:2} {h:2}:{m:2}:{s:2}";

// exports.f1 = format1;
// exports.f2 = format2;
// exports.f3 = format3;
// exports.f4 = format4;
// exports.f5 = format5;
// exports.f6 = format6;
// exports.f7 = format7;
// exports.f8 = format8;
// exports.f9 = format9;
// exports.f10 = format10;
// exports.f11 = format11;
// exports.f12 = format12;
// exports.f13 = format13;
// exports.f14 = format14;
// exports.fSqlDate = format13;
// exports.fSqlDateTime = format14;

// function gengouPart(kdate, opts) {
//   var style = "2";
//   opts.forEach(function (opt) {
//     if (["2", "1", "a", "alpha"].indexOf(opt) >= 0) {
//       style = opt;
//     }
//   })
//   switch (style) {
//     case "2": return kdate.gengou;
//     case "1": return kdate.gengou[0];
//     case "a": return gengouToAlpha(kdate.gengou)[0];
//     case "alpha": return gengouToAlpha(kdate.gengou);
//     default: return kdate.gengou;
//   }
// }

// function numberPart(num, opts) {
//   var zenkaku = false;
//   var width = 1;
//   opts.forEach(function (opt) {
//     switch (opt) {
//       case "1": width = 1; break;
//       case "2": width = 2; break;
//       case "z": zenkaku = true; break;
//     }
//   });
//   var result = num.toString();
//   if (zenkaku) {
//     result = result.split("").map(alphaDigitToZenkaku).join("");
//   }
//   if (width > 1 && num < 10) {
//     result = (zenkaku ? "０" : "0") + result;
//   }
//   return result;
// }

// function nenPart(kdate, opts) {
//   if (kdate.nen === 1 && opts.indexOf("g") >= 0) {
//     return "元";
//   } else {
//     return numberPart(kdate.nen, opts);
//   }
// }

// function youbiPart(kdate, opts) {
//   var style;
//   opts.forEach(function (opt) {
//     if (["1", "2", "3", "alpha"].indexOf(opt) >= 0) {
//       style = opt;
//     }
//   })
//   switch (style) {
//     case "1": return kdate.youbi;
//     case "2": return kdate.youbi + "曜";
//     case "3": return kdate.youbi + "曜日";
//     case "alpha": return dayOfWeek[kdate.dayOfWeek];
//     default: return kdate.youbi;
//   }
// }

// function hourPart(hour, opts) {
//   var ampm = false;
//   if (opts.indexOf("12") >= 0) {
//     ampm = true;
//     opts = removeOpt(opts, "12");
//   }
//   if (ampm) {
//     hour = hour % 12;
//   }
//   return numberPart(hour, opts);
// }

// function ampmPart(kdate, opts) {
//   var style = "kanji";
//   opts.forEach(function (opt) {
//     switch (opt) {
//       case "am/pm": style = "am/pm"; break;
//       case "AM/PM": style = "AM/PM"; break;
//     }
//   });
//   var am = kdate.hour < 12;
//   switch (style) {
//     case "kanji": return am ? "午前" : "午後";
//     case "am/pm": return am ? "am" : "pm";
//     case "AM/PM": return am ? "AM" : "PM";
//     default: throw new Error("unknown style for AM/PM");
//   }
// }

// function yearPart(year, opts) {
//   return year.toString();
// }

// function format(formatStr, kdate) {
//   var output = [];
//   var tokens = parseFormatString(formatStr);
//   tokens.forEach(function (token) {
//     if (typeof token === "string") {
//       output.push(token);
//     } else {
//       switch (token.part) {
//         case "G": output.push(gengouPart(kdate, token.opts)); break;
//         case "N": output.push(nenPart(kdate, token.opts)); break;
//         case "M": output.push(numberPart(kdate.month, token.opts)); break;
//         case "D": output.push(numberPart(kdate.day, token.opts)); break;
//         case "W": output.push(youbiPart(kdate, token.opts)); break;
//         case "h": output.push(hourPart(kdate.hour, token.opts)); break;
//         case "m": output.push(numberPart(kdate.minute, token.opts)); break;
//         case "s": output.push(numberPart(kdate.second, token.opts)); break;
//         case "a": output.push(ampmPart(kdate, token.opts)); break;
//         case "Y": output.push(yearPart(kdate.year, token.opts)); break;
//       }
//     }
//   })
//   return output.join("");
// }

// exports.format = function () {
//   var narg = arguments.length;
//   var formatStr, args, i;
//   if (narg === 0) {
//     return format(format1, new KanjiDate(new Date()));
//   } else if (narg === 1) {
//     return format(format1, cvt(arguments[0]));
//   } else {
//     formatStr = arguments[0];
//     if (formatStr == null) {
//       formatStr = format1;
//     }
//     args = [];
//     for (i = 1; i < arguments.length; i++) {
//       args.push(arguments[i]);
//     }
//     if (args.length === 1) {
//       return format(formatStr, cvt(args[0]));
//     } else {
//       return format(formatStr, KanjiDateExplicit.apply(null, args));
//     }
//   }
//   throw new Error("invalid format call");

//   function cvt(x) {
//     if (isDateObject(x)) {
//       return new KanjiDate(x);
//     } else if (typeof x === "string") {
//       return KanjiDateFromString(x);
//     }
//     throw new Error("cannot convert to KanjiDate");
//   }

