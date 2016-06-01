# kanjidate
A small library that handles conversion between date and Japanese gengou.

## Description

Japanese gengou is a system that specifies a year: each year is represented by a pair of gengou (era) and nen (index in the era).
This library handles recent four gengou types: that is, "平成" (heisei), "昭和" (shouwa), "大正" (taishou), and "明治" (meiji).
This library assumes that each era starts at the following dates.

* "平成" (heisei) starts at Jan 8, 1989
* "昭和" (shouwa) starts at Dec 25, 1926
* "大正" (taishou) starts at Jul 30, 1912
* "明治" (meiji) starts at Oct 23, 1868

Each era begins with nen of 1. So, Jan 8, 1989 belongs to "平成" (heisei) 1 nen.
Additionally, Jan 7, 1989 is "昭和" (shouwa) 64 nen.

## API

* __toGengou(year, month, day)__

returns ```{gengou: ..., nen: ...}``` that is calculated from _year_, _month_ and _day_.
If the date does not corresponds to the four eras ("明治", "大正", "昭和", "平成"), it returns an object
with gengou of "西暦" (meaning "Western calendar") and nen of _year_.
Before calculating gengou and nen, _year_, _month_ and _day_ are converted to numbers, which are then
truncated to integral values.
It throws an ```Error``` if _year_ is not positive, or _month_ is not in the range of 1 upto 12, or 
_day_ is not in the range of 1 upto 31.

```js
var kanjidate = require("kanjidate");
kanjidate.toGengou(1957, 6, 2)  // ==> {gengou: "昭和", nen: 32}
```

* __toGengou(date)__

returns ```{gengou: ..., nen: ...}``` that is calculated from _date_. _date_ can be 
1) a string such as "2016-06-02" (which shoule be acceptable by ```Date.parse```), 
or 2) a javascript Date object.

```js
var kanjidate = require("kanjidate");
kanjidate.toGengou("2016-06-02")          // ==> {gengou: "昭和", nen: 32}
kanjidate.toGengou(new Date(2016, 5, 2))  // ==> {gengou: "昭和", nen: 32}
```

* __fromGengou(gengou, nen)__

returns year corresponding to _gengou_ and _nen_.
Before calculating year, _nen_ is converted to a number, which is then truncated to integral values.
if gengou is "西暦" (meaning "Western calendar"), it just returns _nen_.
It throws an ```Error``` if gengou is not one of "明治", "大正", "昭和", "平成" or "西暦". It also throws an ```Error```
if _nen_ is zero or negative.

```js
var kanjidate = require("kanjidate");
kanidate.fromGengou("昭和", 32)  // ==> 1957
```

## License
This software is released under the MIT License, see [LICENSE.txt](LICENSE.txt).