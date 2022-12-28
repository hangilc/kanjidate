var expect = expect || require("chai").expect;
var kanjidate = kanjidate || require("../dist/index.js");

describe("testing manip", () => {
  it("should report last day of Jan, 2022", () => {
    expect(kanjidate.lastDayOfMonth(2022, 1)).equal(31);
  });

  it("should report last day of Feb, 2022", () => {
    expect(kanjidate.lastDayOfMonth(2022, 2)).equal(28);
  });

  it("should report last day of Feb, 2024", () => {
    expect(kanjidate.lastDayOfMonth(2024, 2)).equal(29);
  });

  it("should report first day of week of Dec 28, 2022 as Dec 25, 2022", () => {
    const d = new Date("2022-12-28");
    const e = new Date("2022-12-25");
    expect(kanjidate.firstDayOfWeek(d), e);
  });

  it("should add days in simple case", () => {
    const d = new Date(2022, 10, 2);
    expect(kanjidate.addDays(d, 3)).to.deep.equal(new Date(2022, 10, 5));
  })

  it("should add days in overflow case", () => {
    const d = new Date(2022, 10, 26);
    expect(kanjidate.addDays(d, 7)).to.deep.equal(new Date(2022, 11, 3));
  })

  it("should add days in minus case", () => {
    const d = new Date(2022, 10, 26);
    expect(kanjidate.addDays(d, -1)).to.deep.equal(new Date(2022, 10, 25));
  })

  it("should add days in underflow case", () => {
    const d = new Date(2022, 10, 2);
    expect(kanjidate.addDays(d, -2)).to.deep.equal(new Date(2022, 9, 31));
  })

  it("should add months in simple case", () => {
    const d = new Date(2022, 10, 2);
    expect(kanjidate.addMonths(d, 1)).to.deep.equal(new Date(2022, 11, 2));
  })

  it("should add months in month overflow case", () => {
    const d = new Date("2022-01-31");
    expect(kanjidate.addMonths(d, 1)).to.deep.equal(new Date("2022-02-28"));
  })

  it("should add months in month underflow case", () => {
    const d = new Date("2022-03-31");
    expect(kanjidate.addMonths(d, -1)).to.deep.equal(new Date("2022-02-28"));
  })

  it("should add years in simple case", () => {
    const d = new Date("2022-11-02");
    expect(kanjidate.addYears(d, 1)).to.deep.equal(new Date("2023-11-02"));
  })

  it("should add years in month overflow case", () => {
    const d = new Date("2024-02-29");
    expect(kanjidate.addYears(d, 1)).to.deep.equal(new Date("2025-02-28"));
  })

});