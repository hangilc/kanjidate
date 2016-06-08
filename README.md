# kanjidate
A small javascript library that handles conversion between date and Japanese gengou.

## Description

Japanese gengou is a system that specifies a year: each year is represented by a pair of gengou (era) and nen (index in the era).
This library handles recent four gengou types: that is, "平成" (heisei), "昭和" (shouwa), "大正" (taishou), and "明治" (meiji).
This library assumes that each era starts at the following dates.

* "平成" (Heisei) starts at Jan 8, 1989
* "昭和" (Shouwa) starts at Dec 25, 1926
* "大正" (Taishou) starts at Jul 30, 1912
* "明治" (Meiji) starts at Oct 23, 1868

Each era begins with nen of 1. So, Jan 8, 1989 belongs to "平成" (heisei) 1 nen.
Additionally, Jan 7, 1989 is "昭和" (shouwa) 64 nen.

## API

### toGengou(year, month, day)

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

### toGengou(date)

returns ```{gengou: ..., nen: ...}``` that is calculated from _date_. _date_ can be 
1) a string such as "2016-06-02" (which shoule be acceptable by ```Date.parse```), 
or 2) a javascript Date object.

```js
var kanjidate = require("kanjidate");
kanjidate.toGengou("2016-06-02")          // ==> {gengou: "昭和", nen: 32}
kanjidate.toGengou(new Date(2016, 5, 2))  // ==> {gengou: "昭和", nen: 32}
```

### fromGengou(gengou, nen)

returns year corresponding to _gengou_ and _nen_.
Before calculating year, _nen_ is converted to a number, which is then truncated to integral values.
if gengou is "西暦" (meaning "Western calendar"), it just returns _nen_.
It throws an ```Error``` if gengou is not one of "明治", "大正", "昭和", "平成" or "西暦". It also throws an ```Error```
if _nen_ is zero or negative.

```js
var kanjidate = require("kanjidate");
kanidate.fromGengou("昭和", 32)  // ==> 1957
```

### toKanji(year, month, day)

returns a string that represents the date in gengou-nen format.

```js
var kanjidate = require("kanjidate");
kanjidate.toKanji(1989, 1, 8)  // ==> "平成1年1月8日"
```

### toKanji(year, month, day, formatString)

returns a string that represents the date in gengou-nen format that is controlled by _formatString_.
In the _formatString_, components of date representation (that is, gengou, nen , ...) are indicated between curly braces (`"{...}"`).

The general format of component representation is `{P:opt1,opt2,...}`, in which `P` specifies what part it represets and opt1 (, opt2 ...) specifies options.

Acceptable values for `P` placeholder is as follows:

* G : gengou
* N : nen
* M : month
* D : day
* Y : youbi (day of week in Japanese)

Available options for each component is described below.

#### G options

Option for G (gengou) component is "1", "2", "a", or "alpha".

* "1" : gengou is shown as one Kanji character, such as "平".



_opt_ is an object with following (optional) properties:

#### format

is a string that specifies the total output. Following characters are replaced by date information.

* G : gengou
* N : nen
* M : month
* D : day
* Y : youbi (day of week in Japanese)

Default value of _format_ is "GN年M月D日".

```js
var opt = { format: "GN年M月" };
toKanji(2016, 6, 5, opt)  // ==> "平成28年6月"
```

#### G

is a string that specifies how gengou is formatted. Acceptable value is one of the followings:

* _full_ : gengou is output as 2 Japanese characters, such as "平成" and "昭和". This is the default value.
* _short_ : gengou is output as single Japanese character, such as "平" and  "昭".
* _alpha_ : gengou is output as single English alphabet, such as "H" and "S".
* _alphaFull_ : gengou is output as English word, such as "Heisei" and "Shouwa".

```js
kanjidate.toKanji(1957, 6, 2, {format: "G", G: "full"})  // ==> "昭和"
kanjidate.toKanji(1957, 6, 2, {format: "G", G: "short"})  // ==> "昭"
kanjidate.toKanji(1957, 6, 2, {format: "G", G: "alpha"})  // ==> "S"
kanjidate.toKanji(1957, 6, 2, {format: "G", G: "alphaFull"})  // ==> "Shouwa"
```

#### N

specifies a function that controls how nen is formatted. The function receives an instance of NenFormat class as argument, and
returns an object whose toString() method determines the representation of nen. NenFormat has following methods:

* _pad(len, ch)_ : pads (from left side) the output string with _ch_ to make the final output to be at least _len_ long. 
* _zenkaku()_ : converts the output to zenkaku (Japanese number) characters. 
* _gannen()_ : outputs "元" if nen value is 1. This is another form representing the first nen in the era.

All methods returns the (modified) original format.

```js
var opt = {
	format: "N"
};
kanjidate.toKanji(1989, 1, 8 opt)  // ==> "1"  (default format)

var opt = { 
	format: "N", 
	N: function(fmt){
		return fmt.pad(2, "0");
	}
};
kanjidate.toKanji(1989, 1, 8 opt)  // ==> "01"

var opt = { 
	format: "N", 
	N: function(fmt){
		return fmt.zenkaku();
	}
};
kanjidate.toKanji(1989, 1, 8 opt)  // ==> "１"

var opt = { 
	format: "N", 
	N: function(fmt){
		return fmt.zenkaku().pad(2, "０");
	}
};
kanjidate.toKanji(1989, 1, 8 opt)  // ==> "０１"

var opt = { 
	format: "N", 
	N: function(fmt){
		return fmt.gannen();
	}
};
kanjidate.toKanji(1989, 1, 8 opt)  // ==> "元"
kanjidate.toKanji(1989, 2, 8 opt)  // ==> "2"
```

Default value of `N` is the identity function (that is, `funciton(fmt){ return fmt; }`), which outputs the result of applying `toString` to the number of nen.

#### M

specifies a function that controls how month is formatted. The function receives an instance of MonthFormat class as argument, and
returns an object whose toString() method determines the representation of month. MonthFormat has following methods:

* _pad(len, ch)_ : pads (from left side) the output string with _ch_ to make the final output to be at least _len_ long. 
* _zenkaku()_ : converts the output to zenkaku (Japanese number) characters. 

Default value of `M` is the identity function (that is, `funciton(fmt){ return fmt; }`), which outputs the result of applying `toString` to the number of month.


#### D

specifies a function that controls how day is formatted. The function receives an instance of DayFormat class as argument, and
returns an object whose toString() method determines the representation of day. DayFormat has following methods:

* _pad(len, ch)_ : pads (from left side) the output string with _ch_ to make the final output to be at least _len_ long. 
* _zenkaku()_ : converts the output to zenkaku (Japanese number) characters. 

Default value of `D` is the identity function (that is, `funciton(fmt){ return fmt; }`), which outputs the result of applying `toString` to the number of day.

#### Y

specified a function that controls how day of week is formatted. The function receives an instance of YoubiFormat class as argument, and returns an object whose toString() method determines the representation of day of week. YoubiFormat has following methods:

* _full()_ : outputs the day of week as three Kanji characters, such as "月曜日" (Monday).

Default output is single Kanji characters, such as "月".

## License
This software is released under the MIT License, see [LICENSE.txt](LICENSE.txt).