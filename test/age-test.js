var expect = expect || require("chai").expect;
var kanjidate = kanjidate || require("../index.js");

describe("calculate age", function() {
  it("should calculate age after birthday", function(){
    expect(kanjidate.calcAge(new Date(1957, 5, 2), new Date(2022, 9, 5))).to.equal(65);
  });
  it("should calculate age after birthday in same month (1)", function(){
    expect(kanjidate.calcAge(new Date(1957, 5, 2), new Date(2022, 5, 5))).to.equal(65);
  });
  it("should calculate age after birthday in same month (2)", function(){
    expect(kanjidate.calcAge(new Date(1957, 5, 2), new Date(2022, 5, 5))).to.equal(65);
  });
  it("should calculate age after birthday in same month (3)", function(){
    expect(kanjidate.calcAge(new Date(1957, 5, 2), new Date(2022, 4, 5))).to.equal(64);
  });
  it("should calculate age in same year", function(){
    expect(kanjidate.calcAge(new Date(1957, 5, 2), new Date(1957, 7, 5))).to.equal(0);
  });
}); 