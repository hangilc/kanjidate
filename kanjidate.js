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

function toDateData(year, month, day){
	year = Math.floor(+year);
	month = Math.floor(+month); 
	day = Math.floor(+day);
	if( year <= 0 ){
		throw new Error("invalid year: " + year);
	}
	if( !(month >= 1 && month <= 12) ){
		throw new Error("invalid month");
	}
	if( !(day >= 1 && day <= 31) ){
		throw new Error("invalid day");
	}
	return {
		year: year,
		month: month,
		day: day
	}
}

function toDateData1(date){
	var m, t, d;
	if( typeof date === "string" ){
		t = Date.parse(date);
		if( !isNaN(t) ){
			d = new Date(t);
			return toDateData(d.getFullYear(), d.getMonth()+1, d.getDate());
		}
	} else if( typeof date === "object" ){
		if( typeof date.getFullYear === "function" ){
			return toDateData(date.getFullYear(), date.getMonth()+1, date.getDate());
		}
	}
	throw new Error("invalid date: " + date);
}

function toGengou(year, month, day){
	var data;
	if( arguments.length === 1 ){
		data = toDateData1(arguments[0]);
	} else {
		data = toDateData(year, month, day);
	}
	year = data.year;
	month = data.month; 
	day = data.day;
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

function toKanji(year, month, day, opt){
	var g = toGengou(year, month, day);
	if( !opt ){
		return g.gengou + g.nen + "年" + month + "月" + day + "日";
	}
	var format = opt.format || "GN年M月D日";
	var parts = format.split("").map(function(ch){
		switch(ch){
			case "G": return formatGengou(opt.G, g.gengou);
			case "N": return formatNen(opt.N, g.nen);
			default: return ch;
		}
	});
	return parts.join("");
}

exports.toKanji = toKanji;

function gengouToAlpha(gengou){
	switch(gengou){
		case "平成": return "Heisei";
		case "昭和": return "Shouwa";
		case "大正": return "Taishou";
		case "明治": return "Meiji";
		default: throw new Error("unknown gengou: " + gengou);
	}
}

function formatGengou(style, gengou){
	style = style || "平成";
	if( ["平成", "昭和", "大正", "明治"].indexOf(style) >= 0 ){
		return gengou;
	}
	if( ["平", "昭", "大", "明"].indexOf(style) >= 0 ){
		return gengou[0];
	}
	if( ["H", "S", "T", "M"].indexOf(style) >= 0 ){
		return gengouToAlpha(gengou)[0];
	}
	if( ["Heisei", "Shouwa", "Taishou", "Meiji"].indexOf(style) >= 0 ){
		return gengouToAlpha(gengou);
	}
	if( typeof style === "function" ){
		return style(gengou);
	}
	throw new Error("unknown gengou style: " + style);
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

function formatNen(style, nen){
	style = style || "1";
	var styleChars = style.split("");
	var nenStr = nen.toString();
	var retval;
	if( styleChars.every(isZenkakuDigit) ){
		retval = styleChars.map(alphaDigitToZenkaku).join("");
		if( style[0] === "０" ){
			return padLeft(retval, style.length, style[0]);
		} else {
			return retval;
		}
	}
	if( styleChars.every(isAlphaDigit) ){
		if( style[0] === "0" ){
			return padLeft(nenStr, style.length, style[0]);
		} else {
			return nenStr;
		}
	}
	throw new Error("unknown nen style: " + style);
}