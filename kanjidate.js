(function(exports){

"use strict";

var trunc = Math.trunc || function(x){
	if( x >= 0 ){
		return Math.floor(x);
	} else {
		return Math.ceil(x);
	}
};

function ge(year1, month1, day1, year2, month2, day2){
	if( year1 > year2 ){
		return true;
	}
	if( year1 < year2 ){
		return false;
	}
	if( month1 > month2 ){
		return true;
	}
	if( month1 < month2 ){
		return false;
	}
	return day1 >= day2;
}

function gengouToAlpha(gengou){
	switch(gengou){
		case "令和": return "Reiwa";
		case "平成": return "Heisei";
		case "昭和": return "Shouwa";
		case "大正": return "Taishou";
		case "明治": return "Meiji";
		default: throw new Error("unknown gengou: " + gengou);
	}
}

function padLeft(str, n, ch){
	var m = n - str.length;
	var pad = "";
	while( m-- > 0 ){
		pad += ch;
	}
	return pad + str;
}

var zenkakuDigits = ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９"];
var alphaDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function isZenkakuDigit(ch){
	return zenkakuDigits.indexOf(ch) >= 0;
}

function isAlphaDigit(ch){
	return alphaDigits.indexOf(ch) >= 0;
}

function alphaDigitToZenkaku(ch){
	var i = alphaDigits.indexOf(ch);
	return i >= 0 ? zenkakuDigits[i] : ch;
}

function isDateObject(obj){
	return obj instanceof Date;
}

function removeOpt(opts, what){
	var result = [];
	for(var i=0;i<opts.length;i++){
		var opt = opts[i];
		if( opt === what ){
			continue;
		} else {
			result.push(opt);
		}
	}
	return result;
}

function toGengou(year, month, day){
	if( ge(year, month, day, 2019, 5, 1) ){
		return { gengou:"令和", nen:year - 2018 };
	}
	if( ge(year, month, day, 1989, 1, 8) ){
		return { gengou:"平成", nen:year - 1988 };
	}
	if( ge(year, month, day, 1926, 12, 25) ){
		return { gengou:"昭和", nen:year - 1925 };
	}
	if( ge(year, month, day, 1912, 7, 30) ){
		return { gengou:"大正", nen:year - 1911 };
	}
	if( ge(year, month, day, 1873, 1, 1) ){
		return { gengou: "明治", nen: year - 1867 };
	}
	return { gengou: "西暦", nen: year };
}

exports.toGengou = toGengou;

function fromGengou(gengou, nen){
    nen = Math.floor(+nen);
    if( nen < 0 ){
    	throw new Error("invalid nen: " + nen);
    }
    switch (gengou) {
        case "令和":
            return 2018 + nen;
        case "平成":
            return 1988 + nen;
        case "昭和":
            return 1925 + nen;
        case "大正":
            return 1911 + nen;
        case "明治":
            return 1867 + nen;
        case "西暦":
            return nen;
        default:
            throw new Error("invalid gengou: " + gengou);
    }
}

exports.fromGengou = fromGengou;

var youbi = ["日", "月", "火", "水", "木", "金", "土"];

function toYoubi(dayOfWeek){
	return youbi[dayOfWeek];
}

exports.toYoubi = toYoubi;

function KanjiDate(date){
	this.year = date.getFullYear();
	this.month = date.getMonth()+1;
	this.day = date.getDate();
	this.hour = date.getHours();
	this.minute = date.getMinutes();
	this.second = date.getSeconds();
	this.msec = date.getMilliseconds();
	this.dayOfWeek = date.getDay();
	var g = toGengou(this.year, this.month, this.day);
	this.gengou = g.gengou;
	this.nen = g.nen;
	this.youbi = youbi[this.dayOfWeek];
}

function KanjiDateExplicit(year, month, day, hour, minute, second, millisecond){
	if( hour === undefined ) hour = 0;
	if( minute === undefined ) minute = 0;
	if( second === undefined ) second = 0;
	if( millisecond === undefined ) millisecond = 0;
	var date = new Date(year, month-1, day, hour, minute, second, millisecond);
	return new KanjiDate(date);
}

function KanjiDateFromString(str){
	var m;
	m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if( m ){
		return KanjiDateExplicit(+m[1], +m[2], +m[3]);
	}
	m = str.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
	if( m ){
		return KanjiDateExplicit(+m[1], +m[2], +m[3], +m[4], +m[5], +m[6]);
	}
	throw new Error("cannot convert to KanjiDate");
}

function parseFormatString(fmtStr){
	var result = [];
	var parts = fmtStr.split(/(\{[^}]+)\}/);
	parts.forEach(function(part){
		if( part === "" ) return;
		if( part[0] === "{" ){
			part = part.substring(1);
			var token = {opts: []};
			var colon = part.indexOf(":");
			if( part.indexOf(":") >= 0 ){
				token.part = part.substring(0, colon);
				var optStr = part.substring(colon+1).trim();
				if( optStr !== "" ){
					if( optStr.indexOf(",") >= 0 ){
						token.opts = optStr.split(/\s*,\s*/);
					} else {
						token.opts = [optStr];
					}
				}
			} else {
				token.part = part;
			}
			result.push(token);
		} else {
			result.push(part);
		}
	});
	return result;
}

var format1 = "{G}{N}年{M}月{D}日（{W}）";
var format2 = "{G}{N}年{M}月{D}日";
var format3 = "{G:a}{N}.{M}.{D}";
var format4 = "{G}{N:2}年{M:2}月{D:2}日（{W}）";
var format5 = "{G}{N:2}年{M:2}月{D:2}日";
var format6 = "{G:a}{N:2}.{M:2}.{D:2}";
var format7 = "{G}{N}年{M}月{D}日（{W}） {a}{h:12}時{m}分{s}秒";
var format8 = "{G}{N:2}年{M:2}月{D:2}日（{W}） {a}{h:12,2}時{m:2}分{s:2}秒";
var format9 = "{G}{N}年{M}月{D}日（{W}） {a}{h:12}時{m}分";
var format10 = "{G}{N:2}年{M:2}月{D:2}日（{W}） {a}{h:12,2}時{m:2}分";
var format11 = "{G}{N:z}年{M:z}月{D:z}日";
var format12 = "{G}{N:z,2}年{M:z,2}月{D:z,2}日";
var format13 = "{Y}-{M:2}-{D:2}";
var format14 = "{Y}-{M:2}-{D:2} {h:2}:{m:2}:{s:2}";

exports.f1 = format1;
exports.f2 = format2;
exports.f3 = format3;
exports.f4 = format4;
exports.f5 = format5;
exports.f6 = format6;
exports.f7 = format7;
exports.f8 = format8;
exports.f9 = format9;
exports.f10 = format10;
exports.f11 = format11;
exports.f12 = format12;
exports.f13 = format13;
exports.f14 = format14;
exports.fSqlDate = format13;
exports.fSqlDateTime = format14;

function gengouPart(kdate, opts){
	var style = "2";
	opts.forEach(function(opt){
		if( ["2", "1", "a", "alpha"].indexOf(opt) >= 0 ){
			style = opt;
		}
	})
	switch(style){
		case "2": return kdate.gengou;
		case "1": return kdate.gengou[0]; 
		case "a": return gengouToAlpha(kdate.gengou)[0]; 
		case "alpha": return gengouToAlpha(kdate.gengou);
		default: return kdate.gengou;
	}
}

function numberPart(num, opts){
	var zenkaku = false;
	var width = 1;
	opts.forEach(function(opt){
		switch(opt){
			case "1": width = 1; break;
			case "2": width = 2; break;
			case "z": zenkaku = true; break;
		}
	});
	var result = num.toString();
	if( zenkaku ){
		result = result.split("").map(alphaDigitToZenkaku).join("");
	}
	if( width > 1 && num < 10 ){
		result = (zenkaku ? "０" : "0") + result;
	}
	return result;
}

function nenPart(kdate, opts){
	if( kdate.nen === 1 && opts.indexOf("g") >= 0 ){
		return "元";
	} else {
		return numberPart(kdate.nen, opts);
	}
}

function youbiPart(kdate, opts){
	var style;
	opts.forEach(function(opt){
		if( ["1", "2", "3", "alpha"].indexOf(opt) >= 0 ){
			style = opt;
		}
	})
	switch(style){
		case "1": return kdate.youbi;
		case "2": return kdate.youbi + "曜";
		case "3": return kdate.youbi + "曜日";
		case "alpha": return dayOfWeek[kdate.dayOfWeek];
		default: return kdate.youbi;
	}
}

function hourPart(hour, opts){
	var ampm = false;
	if( opts.indexOf("12") >= 0 ){
		ampm = true;
		opts = removeOpt(opts, "12");
	}
	if( ampm ){
		hour = hour % 12;
	}
	return numberPart(hour, opts);
}

function ampmPart(kdate, opts){
	var style = "kanji";
	opts.forEach(function(opt){
		switch(opt){
			case "am/pm": style = "am/pm"; break;
			case "AM/PM": style = "AM/PM"; break;
		}
	});
	var am = kdate.hour < 12;
	switch(style){
		case "kanji": return am ? "午前" : "午後";
		case "am/pm": return am ? "am" : "pm";
		case "AM/PM": return am ? "AM" : "PM";
		default : throw new Error("unknown style for AM/PM");
	}
}

function yearPart(year, opts){
	return year.toString();
}

function format(formatStr, kdate){
	var output = [];
	var tokens = parseFormatString(formatStr);
	tokens.forEach(function(token){
		if( typeof token === "string" ){
			output.push(token);
		} else {
			switch(token.part){
				case "G": output.push(gengouPart(kdate, token.opts)); break;
				case "N": output.push(nenPart(kdate, token.opts)); break;
				case "M": output.push(numberPart(kdate.month, token.opts)); break;
				case "D": output.push(numberPart(kdate.day, token.opts)); break;
				case "W": output.push(youbiPart(kdate, token.opts)); break;
				case "h": output.push(hourPart(kdate.hour, token.opts)); break;
				case "m": output.push(numberPart(kdate.minute, token.opts)); break;
				case "s": output.push(numberPart(kdate.second, token.opts)); break;
				case "a": output.push(ampmPart(kdate, token.opts)); break;
				case "Y": output.push(yearPart(kdate.year, token.opts)); break;
			}
		}
	})
	return output.join("");
}

exports.format = function(){
	var narg = arguments.length;
	var formatStr, args, i;
	if( narg === 0 ){
		return format(format1, new KanjiDate(new Date()));
	} else if( narg === 1 ){
		return format(format1, cvt(arguments[0]));
	} else {
		formatStr = arguments[0];
		if( formatStr == null ){
			formatStr = format1;
		}
		args = [];
		for(i=1;i<arguments.length;i++){
			args.push(arguments[i]);
		}
		if( args.length === 1 ){
			return format(formatStr, cvt(args[0]));
		} else {
			return format(formatStr, KanjiDateExplicit.apply(null, args));
		}
	}
	throw new Error("invalid format call");

	function cvt(x){
		if( isDateObject(x) ){
			return new KanjiDate(x);
		} else if( typeof x === "string" ){
			return KanjiDateFromString(x);
		}
		throw new Error("cannot convert to KanjiDate");
	}
}

})(typeof exports === "undefined" ? (window.kanjidate = {}) : exports);