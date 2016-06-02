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
		expect(kanjidate.toKanji(1972, 1, 8, {format: "G"})).equal("昭和");
	});
	it("convert gengou with full format", function(){
		var opt = {
			format: "G",
			G: function(fmt){ return fmt.example("平成"); }
		}
		expect(kanjidate.toKanji(1972, 1, 8, {format: "G"})).equal("昭和");
	});
	it("convert gengou with single kanji format", function(){
		var opt = {
			format: "G",
			G: function(fmt){ return fmt.example("平"); }
		}
		expect(kanjidate.toKanji(1972, 1, 8, opt)).equal("昭");
	});
	it("convert gengou with single alphabet format", function(){
		var opt = {
			format: "G",
			G: function(fmt){ return fmt.example("H"); }
		}
		expect(kanjidate.toKanji(1972, 1, 8, opt)).equal("S");
	});
	it("convert gengou with alphabet format", function(){
		var opt = {
			format: "G",
			G: function(fmt){ return fmt.example("Heisei"); }
		}
		expect(kanjidate.toKanji(1972, 1, 8, opt)).equal("Shouwa");
	});
});

describe("convert nen to kanji format", function(){
	it("convert nen with default format", function(){
		var opt = {
			format: "N"
		};
		expect(kanjidate.toKanji(1972, 1, 8, opt)).equal("47");
	})
	it("convert nen with pad format", function(){
		var opt = {
			format: "N",
			N: function(fmt){ return fmt.pad(2, "0"); }
		};
		expect(kanjidate.toKanji(1932, 1, 8, opt)).equal("07");
	})
});