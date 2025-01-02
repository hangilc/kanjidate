import { KanjiDate, Gengou } from "./kanjidate"

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

class FormatToken {
  constructor(
    public part: string,
    public opts: Array<string> = []
  ) {}
}

interface IProcessor {
  process(date: KanjiDate, opts: Array<string>): string;
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
      if( data.japaneseYear.era instanceof Gengou ) {
        return data.japaneseYear.era.alpha[0];
      } else {
        throw new Error("Invalid gengou: " + data.gengou);
      }
    } else if( extractOpt("alpha", opts) ){
      if( data.japaneseYear.era instanceof Gengou ) {
        return data.japaneseYear.era.alpha;
      } else {
        throw new Error("Invalid gengou: " + data.gengou);
      }
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

class UnknownModifierError extends Error {
  public isUnknownModifier: boolean = true;

  constructor(
    public cause: string
  ) { super(); }
}

function applyModifiers(src: string, mods: Array<string>): 
    string | UnknownModifierError {
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

export function format(fmtStr: string, src: KanjiDate | string | Date): string {
  let data: KanjiDate;
  if( typeof src === "string" ){
    data = KanjiDate.fromString(src);
  } else if( src instanceof Date ){
    data = new KanjiDate(src);
  } else {
    data = src;
  }
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

