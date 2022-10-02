var expect = expect || require("chai").expect;
var kanjidate = kanjidate || require("../kanjidate.js");

describe("convert to gengou", function(){
	it("calculates gengou from year, month and day", function(){
		expect(kanjidate.toGengou(2019, 5, 1)).to.eql({gengou: "令和", nen: 1})
	});
	it("calculates gengou from year, month and day", function(){
		expect(kanjidate.toGengou(2019, 4, 30)).to.eql({gengou: "平成", nen: 31})
		expect(kanjidate.toGengou(2016, 6, 1)).to.eql({gengou: "平成", nen: 28})
	});
	it("calculate gengou from year, month and day", function(){
		expect(kanjidate.toGengou(1957, 6, 2)).to.eql({gengou: "昭和", nen: 32})
	});
	it("calculate gengou from year, month and day", function(){
		expect(kanjidate.toGengou(1914, 10, 23)).to.eql({gengou: "大正", nen: 3})
	});
	it("calculate gengou from year, month and day", function(){
		expect(kanjidate.toGengou(1879, 9, 12)).to.eql({gengou: "明治", nen: 12})
	});
	it("calculate gengou from year, month and day", function(){
		expect(kanjidate.toGengou(1857, 9, 12)).to.eql({gengou: "西暦", nen: 1857})
	});
});

describe("convert from gengou", function(){
	it("calculate year from gengou and nen", function(){
		expect(kanjidate.fromGengou("令和", 1)).equal(2019);
	});
	it("calculate year from gengou and nen", function(){
		expect(kanjidate.fromGengou("平成", 30)).equal(2018);
		expect(kanjidate.fromGengou("平成", 28)).equal(2016);
	});
	it("calculate year from gengou and nen", function(){
		expect(kanjidate.fromGengou("昭和", 32)).equal(1957);
	});
	it("calculate year from gengou and nen", function(){
		expect(kanjidate.fromGengou("大正", 3)).equal(1914);
	});
	it("calculate year from gengou and nen", function(){
		expect(kanjidate.fromGengou("明治", 12)).equal(1879);
	});
	it("calculate year from gengou and nen", function(){
		expect(kanjidate.fromGengou("西暦", 1857)).equal(1857);
	});
	it("calculate year from gengou and nen", function(){
		expect(function(){ return kanjidate.fromGengou("元号", 32); }).to.throw("invalid gengou: 元号");
	});
	it("calculate year from gengou and nen", function(){
		expect(function(){ return kanjidate.fromGengou("平成", -3); }).to.throw(Error);
	});
});

describe("convert day of week to youbi", function(){
	it("convert Sunday", function(){
		expect(kanjidate.toYoubi(0)).equal("日")
	})
	it("convert Monday", function(){
		expect(kanjidate.toYoubi(1)).equal("月")
	})
	it("convert Tuesday", function(){
		expect(kanjidate.toYoubi(2)).equal("火")
	})
	it("convert Wednesday", function(){
		expect(kanjidate.toYoubi(3)).equal("水")
	})
	it("convert Thursday", function(){
		expect(kanjidate.toYoubi(4)).equal("木")
	})
	it("convert Friday", function(){
		expect(kanjidate.toYoubi(5)).equal("金")
	})
	it("convert Saturday", function(){
		expect(kanjidate.toYoubi(6)).equal("土")
	})
})

describe("format date with default format", function(){
	it("format today with default format (1)", function(){
		// may fail if tested around 00:00:00
		var d = new Date();
		var g = kanjidate.toGengou(d.getFullYear(), d.getMonth()+1, d.getDate());
		var s = g.gengou + g.nen + "年" + (d.getMonth()+1) + "月" + d.getDate() + "日" + "（" + kanjidate.toYoubi(d.getDay()) + "）";
		expect(kanjidate.format()).equal(s);
	});
	it("format date with default format (2)", function(){
		var d = new Date(2016, 6-1, 14);
		expect(kanjidate.format(d)).equal("平成28年6月14日（火）");
	});
	it("format date represented by string with default format", function(){
		expect(kanjidate.format("2016-06-14")).equal("平成28年6月14日（火）");
	})
	it("format date represented by string with default format", function(){
		expect(kanjidate.format("2016-06-14 13:04:21")).equal("平成28年6月14日（火）");
	})
});

describe("format date with format string", function(){
	it("format Date (1)", function(){
		expect(kanjidate.format("{G}{N}年{M}月{D}日（{W}）", new Date(2016, 6-1, 14))).equal("平成28年6月14日（火）");
	})
	it("format Date (2)", function(){
		expect(kanjidate.format("{G}{N}年{M}月{D}日（{W}）", "2016-06-14")).equal("平成28年6月14日（火）");
	})
	it("format Date (3)", function(){
		expect(kanjidate.format("{G}{N}年{M}月{D}日（{W}）", 2016, 6, 14)).equal("平成28年6月14日（火）");
	})
});

describe("convert gengou to kanji representation", function(){
	it("convert gengou with default format", function(){
		expect(kanjidate.format("{G}", 1972, 1, 8)).equal("昭和");
	});
	it("convert gengou with full format", function(){
		expect(kanjidate.format("{G:2}", 1972, 1, 8)).equal("昭和");
	});
	it("convert gengou with single kanji format", function(){
		expect(kanjidate.format("{G:1}", 1972, 1, 8)).equal("昭");
	});
	it("convert gengou with single alphabet format", function(){
		expect(kanjidate.format("{G:a}", 1972, 1, 8)).equal("S");
	});
	it("convert gengou with alphabet format", function(){
		expect(kanjidate.format("{G:alpha}", 1972, 1, 8)).equal("Shouwa");
	});
});

describe("convert nen to kanji format", function(){
	it("convert nen with default format", function(){
		expect(kanjidate.format("{N}", 1972, 1, 8)).equal("47");
	})
	it("convert nen with pad format", function(){
		expect(kanjidate.format("{N:2}", 1932, 1, 8)).equal("07");
	})
	it("convert nen with zenkaku format", function(){
		expect(kanjidate.format("{N:z}", 1932, 1, 8)).equal("７");
	})
	it("convert nen with zenkaku format", function(){
		expect(kanjidate.format("{N:z}", 2016, 1, 8)).equal("２８");
	})
	it("convert nen with zenkaku and pad format", function(){
		expect(kanjidate.format("{N:z,2}", 1932, 1, 8)).equal("０７");
	})
	it("convert nen with zenkaku format", function(){
		expect(kanjidate.format("{N:z,2}", 2016, 1, 8)).equal("２８");
	})
	it("convert nen with zenkaku and gannen format", function(){
		expect(kanjidate.format("{N:g}", 1989, 1, 8)).equal("元");
	})
});

describe("convert month to kanji format", function(){
	it("convert month with default format", function(){
		expect(kanjidate.format("{M}", 1972, 1, 8)).equal("1");
	})
	it("convert month with pad format", function(){
		expect(kanjidate.format("{M:2}", 1932, 1, 8)).equal("01");
	})
	it("convert month with zenkaku format", function(){
		expect(kanjidate.format("{M:z}", 1932, 1, 8)).equal("１");
	})
	it("convert month with zenkaku and pad format", function(){
		expect(kanjidate.format("{M:z,2}", 1932, 1, 8)).equal("０１");
	})
});

describe("convert day to kanji format", function(){
	it("convert day with default format", function(){
		expect(kanjidate.format("{D}", 1972, 1, 8)).equal("8");
	})
	it("convert day with pad format", function(){
		expect(kanjidate.format("{D:2}", 1932, 1, 8)).equal("08");
	})
	it("convert day with zenkaku format", function(){
		expect(kanjidate.format("{D:z}", 1932, 1, 8)).equal("８");
	})
	it("convert day with zenkaku and pad format", function(){
		expect(kanjidate.format("{D:z,2}", 1932, 1, 8)).equal("０８");
	})
});

describe("format hour part", function(){
	it("default format", function(){
		expect(kanjidate.format("{h}", 2016, 6, 12, 8)).equal("8");
	});
	it("default format", function(){
		expect(kanjidate.format("{h}", 2016, 6, 12, 18)).equal("18");
	});
	it("am/pm format", function(){
		expect(kanjidate.format("{h:12}", 2016, 6, 12, 18)).equal("6");
	});
	it("composite format", function(){
		expect(kanjidate.format("{h:12,z,2}", 2016, 6, 12, 18)).equal("０６");
	});
});

describe("format minute part", function(){
	it("default format", function(){
		expect(kanjidate.format("{m}", 2016, 6, 12, 8, 32)).equal("32");
	});
	it("default format", function(){
		expect(kanjidate.format("{m}", 2016, 6, 12, 8, 7)).equal("7");
	});
});

describe("format second part", function(){
	it("default format", function(){
		expect(kanjidate.format("{s}", 2016, 6, 12, 8, 32, 48)).equal("48");
	});
	it("default format", function(){
		expect(kanjidate.format("{s}", 2016, 6, 12, 8, 6, 2)).equal("2");
	});
});

describe("format am/pm part", function(){
	it("kanji format", function(){
		expect(kanjidate.format("{a}", 2016, 6, 14, 8)).equal("午前");
	})
	it("kanji format", function(){
		expect(kanjidate.format("{a}", 2016, 6, 14, 12)).equal("午後");
	})
	it("kanji format", function(){
		expect(kanjidate.format("{a}", 2016, 6, 14, 13)).equal("午後");
	})
	it("kanji format", function(){
		expect(kanjidate.format("{a:am/pm}", 2016, 6, 14, 8)).equal("am");
	})
	it("kanji format", function(){
		expect(kanjidate.format("{a:am/pm}", 2016, 6, 14, 12)).equal("pm");
	})
	it("kanji format", function(){
		expect(kanjidate.format("{a:am/pm}", 2016, 6, 14, 13)).equal("pm");
	})
	it("kanji format", function(){
		expect(kanjidate.format("{a:AM/PM}", 2016, 6, 14, 8)).equal("AM");
	})
	it("kanji format", function(){
		expect(kanjidate.format("{a:AM/PM}", 2016, 6, 14, 12)).equal("PM");
	})
	it("kanji format", function(){
		expect(kanjidate.format("{a:AM/PM}", 2016, 6, 14, 13)).equal("PM");
	})
});

describe("format datetime", function(){
	it("plain", function(){
		expect(kanjidate.format("{G}{N}年{M}月{D}日（{W}） {a}{h:12}時{m}分{s}秒", 2016, 6, 14, 8, 12, 34))
			.equal("平成28年6月14日（火） 午前8時12分34秒")
	})
	it("plain pm", function(){
		expect(kanjidate.format("{G}{N}年{M}月{D}日（{W}） {a}{h:12}時{m}分{s}秒", 2016, 6, 14, 19, 12, 34))
			.equal("平成28年6月14日（火） 午後7時12分34秒")
	})
	it("time in alphabet", function(){
		expect(kanjidate.format("{G}{N}年{M}月{D}日（{W}） {h:12}:{m}:{s}{a:am/pm}", 2016, 6, 14, 19, 12, 34))
			.equal("平成28年6月14日（火） 7:12:34pm")
	})
	it("time in alphabet", function(){
		expect(kanjidate.format("{G}{N}年{M}月{D}日（{W}） {h:12}:{m}:{s}{a:AM/PM}", 2016, 6, 14, 19, 12, 34))
			.equal("平成28年6月14日（火） 7:12:34PM")
	})
});

describe("format {Y} (year) part", function(){
	it("format year", function(){
		expect(kanjidate.format("{Y}", 2016, 6, 14)).equal("2016");
	})
});

describe("predefined formatting", function(){
	it("format1", function(){
		expect(kanjidate.format(kanjidate.f1, 2016, 6, 12)).equal("平成28年6月12日（日）");
	});
	it("format2", function(){
		expect(kanjidate.format(kanjidate.f2, new Date(2016, 6-1, 12))).equal("平成28年6月12日");
	});
	it("format3", function(){
		expect(kanjidate.format(kanjidate.f3, "2016-06-12")).equal("H28.6.12");
	});
	it("format4", function(){
		expect(kanjidate.format(kanjidate.f4, 2016, 6, 12)).equal("平成28年06月12日（日）");
	});
	it("format5", function(){
		expect(kanjidate.format(kanjidate.f5, 2016, 6, 12)).equal("平成28年06月12日");
	});
	it("format6", function(){
		expect(kanjidate.format(kanjidate.f6, "2016-06-12")).equal("H28.06.12");
	});
	it("format7", function(){
		expect(kanjidate.format(kanjidate.f7, 2016, 6, 12, 14, 26, 8)).equal("平成28年6月12日（日） 午後2時26分8秒");
	});
	it("format8", function(){
		expect(kanjidate.format(kanjidate.f8, 2016, 6, 12, 14, 26, 8)).equal("平成28年06月12日（日） 午後02時26分08秒");
	});
	it("format9", function(){
		expect(kanjidate.format(kanjidate.f9, 2016, 6, 12, 14, 26, 8)).equal("平成28年6月12日（日） 午後2時26分");
	});
	it("format10", function(){
		expect(kanjidate.format(kanjidate.f10, 2016, 6, 12, 14, 26, 8)).equal("平成28年06月12日（日） 午後02時26分");
	});
	it("format11", function(){
		expect(kanjidate.format(kanjidate.f11, 2016, 6, 12, 14, 26, 8)).equal("平成２８年６月１２日");
	});
	it("format12", function(){
		expect(kanjidate.format(kanjidate.f12, 2016, 6, 12, 14, 26, 8)).equal("平成２８年０６月１２日");
	});
});

describe("format to SqlDate, SqlDateTime", function(){
	it("format13", function(){
		expect(kanjidate.format(kanjidate.f13, "2016-06-20 23:24:12"))
			.equal("2016-06-20");
	})
	it("fSqlDate", function(){
		expect(kanjidate.format(kanjidate.fSqlDate, "2016-06-20 23:24:12"))
			.equal("2016-06-20");
	})
	it("format14", function(){
		expect(kanjidate.format(kanjidate.f14, "2016-06-20 23:24:12"))
			.equal("2016-06-20 23:24:12");
	})
	it("fSqlDateTime", function(){
		expect(kanjidate.format(kanjidate.fSqlDateTime, "2016-06-20 23:24:12"))
			.equal("2016-06-20 23:24:12");
	})
});





