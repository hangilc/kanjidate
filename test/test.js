var expect = require("chai").expect;
var kanjidate = require("../index.js");

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