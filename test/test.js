var expect = require("chai").expect;
var kanjidate = require("../kanjidate.js");

describe("convert to gengou", function(){
	it("calculates gengou from year, month and day", function(){
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
	it("format today with default format", function(){
		// may fail if tested around 00:00:00
		var d = new Date();
		var g = kanjidate.toGengou(d.getFullYear(), d.getMonth()+1, d.getDate());
		var s = g.gengou + g.nen + "年" + (d.getMonth()+1) + "月" + d.getDate() + "日" + "（" + kanjidate.toYoubi(d.getDay()) + "）";
		expect(kanjidate.format()).equal(s);
	});
	it("format date with default format", function(){
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
	it("format Date", function(){
		expect(kanjidate.format("{G}{N}年{M}月{D}日（{Y}）", new Date(2016, 6-1, 14))).equal("平成28年6月14日（火）");
	})
	it("format Date", function(){
		expect(kanjidate.format("{G}{N}年{M}月{D}日（{Y}）", "2016-06-14")).equal("平成28年6月14日（火）");
	})
	it("format Date", function(){
		expect(kanjidate.format("{G}{N}年{M}月{D}日（{Y}）", 2016, 6, 14)).equal("平成28年6月14日（火）");
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
	it("convert nen with zenkaku and pad format", function(){
		expect(kanjidate.format("{N:z,2}", 1932, 1, 8)).equal("０７");
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






