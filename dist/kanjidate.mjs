// kanjidate.ts
var Impl;
((Impl2) => {
  class Kdate {
    constructor(year, month, day) {
      this.year = year;
      this.month = month;
      this.day = day;
    }
    static ge(a, b) {
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
  Impl2.Kdate = Kdate;
  class Gengou {
    constructor(kanji, alpha, start, nenStartYear = start.year) {
      this.kanji = kanji;
      this.alpha = alpha;
      this.start = start;
      this.nenStartYear = nenStartYear;
    }
    getLabel() {
      return this.kanji;
    }
    isMyDate(a) {
      return Kdate.ge(a, this.start);
    }
    getNenOf(year) {
      return year - this.nenStartYear + 1;
    }
  }
  Impl2.Gengou = Gengou;
  class Gregorian {
    constructor() {
      this.identity = "";
    }
  }
  Impl2.Gregorian = Gregorian;
  const Meiji = new Gengou("\u660E\u6CBB", "Meiji", new Kdate(1873, 1, 1), 1868);
  const Taishou = new Gengou("\u5927\u6B63", "Taishou", new Kdate(1912, 7, 30));
  const Shouwa = new Gengou("\u662D\u548C", "Shouwa", new Kdate(1926, 12, 25));
  const Heisei = new Gengou("\u5E73\u6210", "Heisei", new Kdate(1989, 1, 8));
  const Reiwa = new Gengou("\u4EE4\u548C", "Reiwa", new Kdate(2019, 5, 1));
  const GengouList = [
    Reiwa,
    Heisei,
    Shouwa,
    Taishou,
    Meiji
  ];
  class Wareki2 {
    constructor(gengou, nen) {
      this.gengou = gengou;
      this.nen = nen;
    }
    getLabel() {
      return this.gengou.kanji;
    }
    getNen() {
      return this.nen;
    }
  }
  Impl2.Wareki = Wareki2;
  class Seireki {
    constructor(year) {
      this.year = year;
    }
    getLabel() {
      return "\u897F\u66A6";
    }
    getNen() {
      return this.year;
    }
  }
  Impl2.Seireki = Seireki;
  function toWareki(d) {
    for (let i = 0; i < GengouList.length; i++) {
      const g = GengouList[i];
      if (g.isMyDate(d)) {
        return new Wareki2(g, g.getNenOf(d.year));
      }
    }
    return new Seireki(d.year);
  }
  Impl2.toWareki = toWareki;
  function fromGengou2(gengou, nen) {
    if (nen < 1) {
      throw new Error(`Inalid nen: ${nen}`);
    }
    return nen - 1 + gengou.nenStartYear;
  }
  Impl2.fromGengou = fromGengou2;
  function stringToGengou(s) {
    for (let i = 0; i < GengouList.length; i++) {
      const g = GengouList[i];
      if (g.kanji === s) {
        return g;
      }
    }
    if (s === "\u897F\u66A6") {
      return new Gregorian();
    } else {
      return null;
    }
  }
  Impl2.stringToGengou = stringToGengou;
  const youbi = ["\u65E5", "\u6708", "\u706B", "\u6C34", "\u6728", "\u91D1", "\u571F"];
  const dayOfWeeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function toYoubi2(dayOfWeek) {
    return youbi[dayOfWeek % 7];
  }
  Impl2.toYoubi = toYoubi2;
  class KanjiDate {
    constructor(date) {
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;
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
    static of(year, month, day, hour = 0, minute = 0, second = 0, msecond = 0) {
      var date = new Date(year, month - 1, day, hour, minute, second, msecond);
      return new KanjiDate(date);
    }
    static tryFromString(str) {
      let m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (m) {
        return KanjiDate.of(+m[1], +m[2], +m[3]);
      }
      m = str.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
      if (m) {
        return KanjiDate.of(+m[1], +m[2], +m[3], +m[4], +m[5], +m[6]);
      }
      return null;
    }
    static fromString(str) {
      const d = KanjiDate.tryFromString(str);
      if (d === null) {
        throw new Error("cannot convert to KanjiDate");
      } else {
        return d;
      }
    }
  }
  Impl2.KanjiDate = KanjiDate;
  class FormatToken {
    constructor(part, opts = []) {
      this.part = part;
      this.opts = opts;
    }
  }
  function copyArray(ar) {
    return Object.assign([], ar);
  }
  function removeElementInPlace(ar, item) {
    const i = ar.indexOf(item);
    if (i >= 0) {
      ar.splice(i, 1);
    }
  }
  const zenkakuDigits = ["\uFF10", "\uFF11", "\uFF12", "\uFF13", "\uFF14", "\uFF15", "\uFF16", "\uFF17", "\uFF18", "\uFF19"];
  const alphaDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  function isZenkaku(c) {
    const a = c[0];
    if (zenkakuDigits.indexOf(a) >= 0) {
      return true;
    } else {
      switch (a) {
        case "\u3000":
        case "\u5143":
          return true;
        default:
          return false;
      }
    }
  }
  function isAllZenkaku(s) {
    for (let i = 0; i < s.length; i++) {
      if (!isZenkaku(s[i])) {
        return false;
      }
    }
    return true;
  }
  function toZenkaku(s) {
    return s.split("").map((c) => {
      const i = alphaDigits.indexOf(c);
      if (i >= 0) {
        return zenkakuDigits[i];
      } else {
        switch (c) {
          case " ":
            return "\u3000";
          default:
            return c;
        }
      }
    }).join("");
  }
  function pad(s, reqLen, padStr = "0") {
    const n = reqLen - s.length;
    let result = s;
    for (let i = 0; i < n; i++) {
      result = padStr + result;
    }
    return result;
  }
  const modifierMap = /* @__PURE__ */ new Map([
    ["2", (s) => {
      let padStr;
      if (isAllZenkaku(s)) {
        padStr = "\uFF10";
      } else {
        padStr = "0";
      }
      return pad(s, 2, padStr);
    }],
    ["z", toZenkaku]
  ]);
  class UnknownModifierError {
    constructor(cause) {
      this.cause = cause;
    }
  }
  function applyModifiers(src, mods) {
    let cur = src;
    for (let i = 0; i < mods.length; i++) {
      const m = modifierMap.get(mods[i]);
      if (m == null) {
        return new UnknownModifierError(mods[i]);
      } else {
        cur = m(cur);
      }
    }
    return cur;
  }
  function extractOpt(key, opts) {
    const i = opts.indexOf(key);
    if (i >= 0) {
      opts.splice(i, 1);
      return true;
    } else {
      return false;
    }
  }
  const gengouProcessor = new class {
    process(data, opts) {
      if (extractOpt("1", opts)) {
        return data.gengou[0];
      } else if (extractOpt("2", opts)) {
        return data.gengou;
      } else if (extractOpt("a", opts)) {
        const wareki = data.wareki;
        return wareki.gengou.alpha[0];
      } else if (extractOpt("alpha", opts)) {
        const wareki = data.wareki;
        return wareki.gengou.alpha;
      } else {
        return data.gengou;
      }
    }
  }();
  const nenProcessor = new class {
    process(data, opts) {
      extractOpt("1", opts);
      if (extractOpt("g", opts)) {
        if (data.nen === 1) {
          return "\u5143";
        } else {
          return data.nen.toString();
        }
      } else {
        return data.nen.toString();
      }
    }
  }();
  const monthProcessor = new class {
    process(data, opts) {
      return data.month.toString();
    }
  }();
  const dayProcessor = new class {
    process(data, opts) {
      return data.day.toString();
    }
  }();
  const dowProcessor = new class {
    process(data, opts) {
      if (extractOpt("1", opts)) {
        return data.youbi;
      } else if (extractOpt("2", opts)) {
        return data.youbi + "\u66DC";
      } else if (extractOpt("3", opts)) {
        return data.youbi + "\u66DC\u65E5";
      } else if (extractOpt("alpha", opts)) {
        return data.dayOfWeekAlpha;
      } else {
        {
          return data.youbi;
        }
      }
    }
  }();
  const hourProcessor = new class {
    process(data, opts) {
      if (extractOpt("12", opts)) {
        return (data.hour % 12).toString();
      } else {
        return data.hour.toString();
      }
    }
  }();
  const minuteProcessor = new class {
    process(data, opts) {
      return data.minute.toString();
    }
  }();
  const secondProcessor = new class {
    process(data, opts) {
      return data.second.toString();
    }
  }();
  const ampmProcessor = new class {
    process(data, opts) {
      if (extractOpt("am/pm", opts)) {
        if (data.hour < 12) {
          return "am";
        } else {
          return "pm";
        }
      } else if (extractOpt("AM/PM", opts)) {
        if (data.hour < 12) {
          return "AM";
        } else {
          return "PM";
        }
      } else {
        if (data.hour < 12) {
          return "\u5348\u524D";
        } else {
          return "\u5348\u5F8C";
        }
      }
    }
  }();
  const yearProcessor = new class {
    process(data, opts) {
      return data.year.toString();
    }
  }();
  const processorMap = /* @__PURE__ */ new Map([
    ["G", gengouProcessor],
    ["N", nenProcessor],
    ["M", monthProcessor],
    ["D", dayProcessor],
    ["W", dowProcessor],
    ["Y", yearProcessor],
    ["h", hourProcessor],
    ["m", minuteProcessor],
    ["s", secondProcessor],
    ["a", ampmProcessor]
  ]);
  function parseFormatString(fmtStr) {
    const items = fmtStr.split(/(\{[^}]+)\}/);
    return items.map((item) => {
      if (item === "") {
        return item;
      } else if (item[0] === "{") {
        const iColon = item.indexOf(":");
        if (iColon >= 0) {
          const part = item.substring(1, iColon);
          const optStr = item.substring(iColon + 1).trim();
          if (optStr === "") {
            return new FormatToken(part);
          } else if (optStr.indexOf(",") >= 0) {
            return new FormatToken(part, optStr.split(/\s*,\s*/));
          } else {
            return new FormatToken(part, [optStr]);
          }
        } else {
          return new FormatToken(item.substring(1));
        }
      } else {
        return item;
      }
    });
  }
  function format3(fmtStr, data) {
    return parseFormatString(fmtStr).map((item) => {
      if (item instanceof FormatToken) {
        const proc = processorMap.get(item.part);
        if (!proc) {
          throw new Error(`Unknown format: ${item.part}`);
        }
        const s = proc.process(data, item.opts);
        const result = applyModifiers(s, item.opts);
        if (result instanceof UnknownModifierError) {
          throw new Error(`Invalid option for ${item.part}: ${result.cause}`);
        } else {
          return result;
        }
      } else {
        return item;
      }
    }).join("");
  }
  Impl2.format = format3;
})(Impl || (Impl = {}));
var Wareki = class {
  constructor(gengou, nen) {
    this.gengou = gengou;
    this.nen = nen;
  }
};
function toGengou(year, month, day) {
  const d = new Impl.Kdate(year, month, day);
  const w = Impl.toWareki(d);
  if (w instanceof Impl.Wareki) {
    return new Wareki(w.gengou.kanji, w.nen);
  } else {
    return new Wareki("\u897F\u66A6", w.year);
  }
}
function fromGengou(gengou, nen) {
  const g = Impl.stringToGengou(gengou);
  if (g instanceof Impl.Gengou) {
    return Impl.fromGengou(g, nen);
  } else if (g instanceof Impl.Gregorian) {
    return nen;
  } else {
    throw new Error(`invalid gengou: ${gengou}`);
  }
}
function toYoubi(dayOfWeek) {
  return Impl.toYoubi(dayOfWeek);
}
var f1 = "{G}{N}\u5E74{M}\u6708{D}\u65E5\uFF08{W}\uFF09";
var f2 = "{G}{N}\u5E74{M}\u6708{D}\u65E5";
var f3 = "{G:a}{N}.{M}.{D}";
var f4 = "{G}{N:2}\u5E74{M:2}\u6708{D:2}\u65E5\uFF08{W}\uFF09";
var f5 = "{G}{N:2}\u5E74{M:2}\u6708{D:2}\u65E5";
var f6 = "{G:a}{N:2}.{M:2}.{D:2}";
var f7 = "{G}{N}\u5E74{M}\u6708{D}\u65E5\uFF08{W}\uFF09 {a}{h:12}\u6642{m}\u5206{s}\u79D2";
var f8 = "{G}{N:2}\u5E74{M:2}\u6708{D:2}\u65E5\uFF08{W}\uFF09 {a}{h:12,2}\u6642{m:2}\u5206{s:2}\u79D2";
var f9 = "{G}{N}\u5E74{M}\u6708{D}\u65E5\uFF08{W}\uFF09 {a}{h:12}\u6642{m}\u5206";
var f10 = "{G}{N:2}\u5E74{M:2}\u6708{D:2}\u65E5\uFF08{W}\uFF09 {a}{h:12,2}\u6642{m:2}\u5206";
var f11 = "{G}{N:z}\u5E74{M:z}\u6708{D:z}\u65E5";
var f12 = "{G}{N:z,2}\u5E74{M:z,2}\u6708{D:z,2}\u65E5";
var f13 = "{Y}-{M:2}-{D:2}";
var f14 = "{Y}-{M:2}-{D:2} {h:2}:{m:2}:{s:2}";
var fSqlDate = f13;
var fSqlDateTime = f14;
var msgInvalidArg = "Invalid arguments to kanjidate.format";
function format(...args) {
  switch (args.length) {
    case 0:
      return Impl.format(f1, new Impl.KanjiDate(new Date()));
    case 1:
      return format1(args[0]);
    case 2:
      return format2(args[0], args[1]);
    case 4:
      return formatN(args[0], args[1], args[2], args[3]);
    case 5:
      return formatN(args[0], args[1], args[2], args[3], args[4]);
    case 6:
      return formatN(args[0], args[1], args[2], args[3], args[4], args[5]);
    case 7:
      return formatN(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    default:
      throw new Error(msgInvalidArg);
  }
}
function format1(arg) {
  if (typeof arg === "string") {
    const d = Impl.KanjiDate.tryFromString(arg);
    if (d === null) {
      return Impl.format(arg, new Impl.KanjiDate(new Date()));
    } else {
      return Impl.format(f1, d);
    }
  } else if (arg instanceof Date) {
    return Impl.format(f1, new Impl.KanjiDate(arg));
  } else {
    throw new Error(msgInvalidArg);
  }
}
function format2(arg1, arg2) {
  let fmt;
  if (typeof arg1 === "string") {
    fmt = arg1;
  } else {
    throw new Error(msgInvalidArg);
  }
  let d;
  if (typeof arg2 === "string") {
    d = Impl.KanjiDate.fromString(arg2);
  } else if (arg2 instanceof Date) {
    d = new Impl.KanjiDate(arg2);
  } else {
    throw new Error(msgInvalidArg);
  }
  return Impl.format(fmt, d);
}
function formatN(fmtArg, yearArg, monthArg, dayArg, hourArg, minuteArg, secondArg) {
  try {
    const fmt = fmtArg;
    const year = yearArg;
    const month = monthArg;
    const day = dayArg;
    let hour;
    if (hourArg === void 0) {
      hour = 0;
    } else {
      hour = hourArg;
    }
    let minute;
    if (minuteArg === void 0) {
      minute = 0;
    } else {
      minute = minuteArg;
    }
    let second;
    if (secondArg === void 0) {
      second = 0;
    } else {
      second = secondArg;
    }
    return Impl.format(fmt, new Impl.KanjiDate(
      new Date(year, month - 1, day, hour, minute, second)
    ));
  } catch (ex) {
    console.error(ex);
    throw new Error(msgInvalidArg);
  }
}
export {
  f1,
  f10,
  f11,
  f12,
  f13,
  f14,
  f2,
  f3,
  f4,
  f5,
  f6,
  f7,
  f8,
  f9,
  fSqlDate,
  fSqlDateTime,
  format,
  fromGengou,
  toGengou,
  toYoubi
};
