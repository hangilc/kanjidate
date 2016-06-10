"use strict";

var trunc = Math.trunc || function(x){
	if( x >= 0 ){
		return Math.floor(x);
	} else {
		return Math.ceil(x);
	}
};

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

function toGengou(year, month, day){
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

function KanjiDate(year, month, day, hour, minute, second, millisecond){
	this.year = trunc(+year);
	this.month = trunc(+month);
	this.day = trunc(+day);
	this.hour = trunc(+hour);
	this.minute = trunc(+minute);
	this.second = trunc(+second);
	this.millisecond = trunc(+millisecond);
}