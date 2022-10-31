import { KanjiDate } from "./kanjidate"

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

