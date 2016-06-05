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
	it("calculate gengou from year, month and day", function(){
		expect(function(){
			return kanjidate.toGengou(-14, 1, 12);
		}).to.throw(Error);
	});
	it("calculate gengou from year, month and day", function(){
		expect(function(){
			return kanjidate.toGengou(2014, 0, 12);
		}).to.throw(Error);
	});
	it("calculate gengou from year, month and day", function(){
		expect(function(){
			return kanjidate.toGengou(2014, 3, 32);
		}).to.throw(Error);
	});
	it("calculate gengou from date", function(){
		expect(kanjidate.toGengou("1989-01-08")).to.eql({gengou: "平成", nen: 1});
	});
	it("calculate gengou from date", function(){
		expect(kanjidate.toGengou(new Date(1957, 5, 2))).to.eql({gengou: "昭和", nen: 32});
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

describe("convert date to kanji representation", function(){
	it("convert year, month and day to kanji representation", function(){
		expect(kanjidate.toKanji(1989, 1, 8)).equal("平成1年1月8日");
	});
});

describe("convert gengou to kanji representation", function(){
	it("convert gengou with default format", function(){
		expect(kanjidate.toKanji(1972, 1, 8, "{G}")).equal("昭和");
	});
	it("convert gengou with full format", function(){
		expect(kanjidate.toKanji(1972, 1, 8, "{G:2}")).equal("昭和");
	});
	it("convert gengou with single kanji format", function(){
		expect(kanjidate.toKanji(1972, 1, 8, "{G:1}")).equal("昭");
	});
	it("convert gengou with single alphabet format", function(){
		expect(kanjidate.toKanji(1972, 1, 8, "{G:a}")).equal("S");
	});
	it("convert gengou with alphabet format", function(){
		expect(kanjidate.toKanji(1972, 1, 8, "{G:alpha}")).equal("Shouwa");
	});
});

describe("convert nen to kanji format", function(){
	it("convert nen with default format", function(){
		expect(kanjidate.toKanji(1972, 1, 8, "{N}")).equal("47");
	})
	it("convert nen with pad format", function(){
		expect(kanjidate.toKanji(1932, 1, 8, "{N:2}")).equal("07");
	})
	it("convert nen with zenkaku format", function(){
		expect(kanjidate.toKanji(1932, 1, 8, "{N:z}")).equal("７");
	})
	it("convert nen with zenkaku and pad format", function(){
		expect(kanjidate.toKanji(1932, 1, 8, "{N:z,2}")).equal("０７");
	})
	it("convert nen with zenkaku and gannen format", function(){
		expect(kanjidate.toKanji(1989, 1, 8, "{N:g}")).equal("元");
	})
});

describe("convert month to kanji format", function(){
	it("convert month with default format", function(){
		expect(kanjidate.toKanji(1972, 1, 8, "{M}")).equal("1");
	})
	it("convert month with pad format", function(){
		expect(kanjidate.toKanji(1932, 1, 8, "{M:2}")).equal("01");
	})
	it("convert month with zenkaku format", function(){
		expect(kanjidate.toKanji(1932, 1, 8, "{M:z}")).equal("１");
	})
	it("convert month with zenkaku and pad format", function(){
		expect(kanjidate.toKanji(1932, 1, 8, "{M:z,2}")).equal("０１");
	})
});

describe("convert day to kanji format", function(){
	it("convert day with default format", function(){
		expect(kanjidate.toKanji(1972, 1, 8, "{D}")).equal("8");
	})
	it("convert day with pad format", function(){
		expect(kanjidate.toKanji(1932, 1, 8, "{D:2}")).equal("08");
	})
	it("convert day with zenkaku format", function(){
		expect(kanjidate.toKanji(1932, 1, 8, "{D:z}")).equal("８");
	})
	it("convert day with zenkaku and pad format", function(){
		expect(kanjidate.toKanji(1932, 1, 8, "{D:z,2}")).equal("０８");
	})
});

describe("convert youbi to kanji format", function(){
	it("convert youbi with default format", function(){
		expect(kanjidate.toKanji(2016, 6, 3, "{Y}")).equal("金");
	})
	it("convert youbi with default format", function(){
		expect(kanjidate.toKanji(2016, 6, 3, "{Y:1}")).equal("金");
	})
	it("convert youbi with full format", function(){
		expect(kanjidate.toKanji(2016, 6, 3, "{Y:2}")).equal("金曜");
	})
	it("convert youbi with full format", function(){
		expect(kanjidate.toKanji(2016, 6, 3, "{Y:3}")).equal("金曜日");
	})
	it("convert youbi with full format", function(){
		expect(kanjidate.toKanji(2016, 6, 3, "{Y:alpha}")).equal("Friday");
	})
})