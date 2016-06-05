function lt(year1, month1, day1, year2, month2, day2){
	if( year1 < year2 ){
		return true;
	}
	if( year1 > year2 ){
		return false;
	}
	if( month1 < month2 ){
		return true;
	}
	if( month1 > month2 ){
		return false;
	}
	return day1 < day2;
}

var assign = Object.assign || function(dst, src){
	var i, obj, key;
	for(i=1;i<arguments.length;i++){
		obj = arguments[i];
		for(key in obj){
			if( obj.hasOwnProperty(key) ){
				dst[key] = obj[key];
			}
		}
	}
	return dst;
}

function Info(year, month, day){
	this.year = Math.floor(+year);
	this.month = Math.floor(+month); 
	this.day = Math.floor(+day);
	if( year <= 0 ){
		throw new Error("invalid year: " + year);
	}
	if( !(month >= 1 && month <= 12) ){
		throw new Error("invalid month");
	}
	if( !(day >= 1 && day <= 31) ){
		throw new Error("invalid day");
	}
}

Info.fromDate = function(date){
	return new Info(date.getFullYear(), date.getMonth()+1, date.getDate());
};

Info.fromTimeStamp = function(ts){
	return Info.fromDate(new Date(ts));
}

Info.fromString = function(str){
	var t = Date.parse(str);
	if( isNaN(t) ){
		throw new Error("cannot parse to date: " + str);
	}
	return Info.fromTimeStamp(t);
}

Info.from = function(what){
	if( typeof what === "number" ){
		return Info.fromTimeStamp(what);
	}
	if( typeof what === "string" ){
		return Info.fromString(what);
	}
	if( typeof what === "object" ){
		if( typeof what.getFullYear === "function" ){
			return Info.fromDate(what);
		}
	}
	throw new Error("cannot convert to date info: " + what);
};

function toGengou(year, month, day){
	var info;
	if( arguments.length === 1 ){
		info = Info.from(arguments[0]);
	} else {
		info = new Info(year, month, day);
	}
	year = info.year;
	month = info.month; 
	day = info.day;
	if( lt(year, month, day, 1868, 10, 23) ){
		return { gengou:"西暦", nen:year };
	}
	if( lt(year, month, day, 1912, 7, 30) ){
		return { gengou:"明治", nen:year - 1867 };
	}
	if( lt(year, month, day, 1926, 12, 25) ){
		return { gengou:"大正", nen:year - 1911 };
	}
	if( lt(year, month, day, 1989, 1, 8) ){
		return { gengou:"昭和", nen:year - 1925 };
	}
	return { gengou:"平成", nen:year - 1988 };
}

exports.toGengou = toGengou;

function fromGengou(gengou, nen){
    nen = Math.floor(+nen);
    if( nen < 0 ){
    	throw new Error("invalid nen: " + nen);
    }
    switch (gengou) {
        case "明治":
            return 1867 + nen;
        case "大正":
            return 1911 + nen;
        case "昭和":
            return 1925 + nen;
        case "平成":
            return 1988 + nen;
        case "西暦":
            return nen;
        default:
            throw new Error("invalid gengou: " + gengou);
    }
}

exports.fromGengou = fromGengou;

var youbi = ["日", "月", "火", "水", "木", "金", "土"];
var dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Ffriday", "Saturday"];

function InfoEx(info){
	this.year = info.year;
	this.month = info.month;
	this.day = info.day;
	var g = toGengou(this.year, this.month, this.day);
	this.gengou = g.gengou;
	this.nen = g.nen;
	var d = new Date(this.year, this.month-1, this.day);
	this.dayOfWeek = d.getDay();
	this.youbi = youbi[this.dayOfWeek];
}

function parseFormatString(fmtStr){
	var result = [];
	var parts = fmtStr.split(/(\{[^}]+)\}/);
	parts.forEach(function(part){
		if( part === "" ) return;
		if( part[0] === "{" ){
			part = part.substring(1);
			var token = {};
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

function toKanji(year, month, day, fmtStr){
	var output = [];
	var info = new InfoEx(new Info(year, month, day));
	var tokens = parseFormatString(fmtStr);
	tokens.forEach(function(token){
		if( typeof token === "string" ){
			output.push(token);
		} else {
			switch(token.part){
				case "G": output.push(gengouPart(info, token.opts)); break;
				case "N": output.push(nenPart(info, token.opts)); break;
				case "M": output.push(numberPart(info.month, token.opts)); break;
				case "D": output.push(numberPart(info.day, token.opts)); break;
				case "Y": output.push(youbiPart(info, token.opts)); break;
			}
		}
	})
	return output.join("");
}
exports.toKanji = toKanji;





function identity(x){
	return x;
}

function toKanjiOrig(year, month, day, opt){
	var info = new InfoEx(new Info(year, month, day));
	if( !opt ){
		return info.gengou + info.nen + "年" + month + "月" + day + "日";
	}
	var format = opt.format || "GN年M月D日";
	var parts = format.split("").map(function(ch){
		switch(ch){
			case "G": return formatGengou(opt.G || "full", info);
			case "N": return formatNen(opt.N || "1", info);
			case "M": return formatMonth(opt.M || identity, info);
			case "D": return formatDay(opt.D || identity, info);
			case "Y": return formatYoubi(opt.Y || identity, info);
			default: return ch;
		}
	});
	return parts.join("");
}


function gengouToAlpha(gengou){
	switch(gengou){
		case "平成": return "Heisei";
		case "昭和": return "Shouwa";
		case "大正": return "Taishou";
		case "明治": return "Meiji";
		default: throw new Error("unknown gengou: " + gengou);
	}
}

function GengouFormat(info){
	this.info = info;
	this.result = info.gengou;
}

assign(GengouFormat.prototype, {
	toString: function(){
		return this.result;
	},
	example: function(ex){
		var gengou = this.result;
		if( ["平成", "昭和", "大正", "明治"].indexOf(ex) >= 0 ){
			this.result = gengou;
		} else if( ["平", "昭", "大", "明"].indexOf(ex) >= 0 ){
			this.result = gengou[0];
		} else if( ["H", "S", "T", "M"].indexOf(ex) >= 0 ){
			this.result = gengouToAlpha(gengou)[0];
		} else if( ["Heisei", "Shouwa", "Taishou", "Meiji"].indexOf(ex) >= 0 ){
			this.result = gengouToAlpha(gengou);
		} else {
			throw new Error("unknown gengou example: " + ex);
		}
		return this;
	}
});

function formatGengou(fmt, info){
	switch(fmt){
		case "full": return info.gengou;
		case "short": return info.gengou[0];
		case "alpha": return gengouToAlpha(info.gengou)[0];
		case "alphaFull": return gengouToAlpha(info.gengou);
		default: throw new Error("unknown gengou example: " + ex);
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

function NumberFormat(info){
	this.info = info;
}

assign(NumberFormat.prototype, {
	toString: function(){
		return this.result.toString();
	},
	zenkaku: function(){
		this.result = this.result.toString().split("").map(alphaDigitToZenkaku).join("");
		return this;
	},
	pad: function(len, ch){
		this.result = padLeft(this.result.toString(), len, ch);
		return this;
	}
});

function inherit(child, parent){
	function f(){ }
	f.prototype = parent.prototype;

	child.prototype = assign(new f(), child.prototype);
}

function NenFormat(info){
	NumberFormat.call(this, info);
	this.result = info.nen;
}

assign(NenFormat.prototype, {
	gannen: function(){
		if( this.info.nen === 1 ){
			this.result = "元";
		}
		return this;
	}
})

inherit(NenFormat, NumberFormat);

function MonthFormat(info){
	NumberFormat.call(this, info);
	this.result = info.month;
}

inherit(MonthFormat, NumberFormat);

function DayFormat(info){
	NumberFormat.call(this, info);
	this.result = info.day;
}

inherit(DayFormat, NumberFormat);

function YoubiFormat(info){
	this.info = info;
	this.result = info.youbi;
	return this;
}

assign(YoubiFormat.prototype, {
	toString: function(){
		return this.result.toString();
	},
	full: function(){
		this.result = this.info.youbi + "曜日";
		return this;
	}
});

function formatNen(fn, info){
	return fn(new NenFormat(info)).toString();
}

function formatMonth(fn, info){
	return fn(new MonthFormat(info)).toString();
}

function formatDay(fn, info){
	return fn(new DayFormat(info)).toString();
}

function formatYoubi(fn, info){
	return fn(new YoubiFormat(info)).toString();
}




function gengouPart(info, opts){
	var result = info.gengou;
	opts = opts || [];
	opts.forEach(function(opt){
		switch(opt){
			case "2": break;
			case "1": result = result[0]; break;
			case "a": result = gengouToAlpha(info.gengou)[0]; break;
		}
	});
	return result;
}

function numberPart(num, opts){
	var zenkaku = false;
	var width = 1;
	var gannen = false;
	if( opts ){
		opts.forEach(function(opt){
			switch(opt){
				case "1": width = 1; break;
				case "2": width = 2; break;
				case "z": zenkaku = true; break;
				case "g": gannen = true; break;
			}
		});
	}
	var result = num.toString();
	if( zenkaku ){
		result = result.split().map(alphaDigitToZenkaku).join("");
	}
	if( width > 1 && num < 10 ){
		result = (zenkaku ? "０" : "0") + result;
	}
	return result;
}

function nenPart(info, opts){
	if( opts && info.nen === 1 && opts.indexOf("g") >= 0 ){
		return "元";
	} else {
		return numberPart(info.nen, opts);
	}
}

function youbiPart(info, opts){
	var style;
	if( opts ){
		opts.forEach(function(opt){
			if( ["1", "2", "3", "alpha"].indexOf(opt) >= 0 ){
				style = opt;
			}
		})
	}
	switch(style){
		case "1": return info.youbi;
		case "2": return info.youbi + "曜";
		case "3": return info.youbi + "曜日";
		case "alpha": return dayOfWeek[info.dayOfWeek];
		default: return info.youbi;
	}
}

console.log(toKanji(1957-31,12,31, "{G}{N}年{M}月{D}日（{Y}）"))
console.log(toKanji(1957,6,2, "{G}{N}年{M}月{D}日（{Y}）"))


