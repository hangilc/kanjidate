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

function toGengou(year, month, day){
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