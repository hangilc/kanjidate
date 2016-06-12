# kanjidate

A small javascript library that 1) formats date in Japanese and 2) converts dates between Gregorian calendar and Japanese calendar.

## Install

### node.js

```
npm install kanjidate
```

in javascript source

```js
var kanjidate = require("kanjidate");
```

### Browser

```html
<script src="/path/to/kanjidate.js"></script>
```

## Examples

### Default formatting

```js
kanjidate.format() // -> "平成28年6月12日（日）" ; formats current date in default format
kanjidate.format(new Date(2016, 6-1, 12)) // -> "平成28年6月12日（日）" 
kanjidate.format("2016-06-12") // -> "平成28年6月12日（日）" 
```

## Predefined format

```js
kanjidate.format(kanjidate.f1, 2016, 6, 12) // -> "平成28年6月12日（日）"
kanjidate.format(kanjidate.f2, new Date(2016, 6-1, 12)) // -> "平成28年6月12日"
kanjidate.format(kanjidate.f3, "2016-06-12") // -> "H28.6.12"
kanjidate.format(kanjidate.f4, 2016, 6, 12) // -> "平成28年06月12日（日）"
kanjidate.format(kanjidate.f5, 2016, 6, 12) // -> "平成28年06月12日"
kanjidate.format(kanjidate.f6, 2016, 6, 12) // -> "H28.06.12"
kanjidate.format(kanjidate.f7, 2016, 6, 12, 14, 26, 8) // -> "平成28年6月12日（日） 午後2時26分8秒"
kanjidate.format(kanjidate.f8, 2016, 6, 12, 14, 26, 8) // -> "平成28年06月12日（日） 午後02時26分08秒"
kanjidate.format(kanjidate.f9, 2016, 6, 12, 14, 26, 8) // -> "平成28年6月12日（日） 午後2時26分"
kanjidate.format(kanjidate.f10, 2016, 6, 12, 14, 26, 8) // -> "平成28年06月12日（日） 午後02時26分"
kanjidate.format(kanjidate.f11, 2016, 6, 12) // -> "平成２８年６月１２日"
kanjidate.format(kanjidate.f12, 2016, 6, 12) // -> "平成２８年０６月１２日"
```

### Explicit formatting

```js
// gengou
kanjidate.format("Current gengou: {G}", new Date()) // -> "Current gengou: 平成"
kanjidate.format("{G:1}", 2016, 6, 12) // -> "平" ; 1 character
kanjidate.format("{G:2}", 2016, 6, 12) // -> "平成" ; 2 characters
kanjidate.format("{G:a}", 2016, 6, 12) // -> "H"
kanjidate.format("{G:alpha}", 2016, 6, 12) // -> "Heisei"

// nen
kanjidate.format("{N}", 2016, 6, 12) // -> "28"
kanjidate.format("{N:1}", 2016, 6, 12) // -> "28" ; same as above
kanjidate.format("{N:2}", 1996, 6, 12) // -> "08"
kanjidate.format("{N:z}", 1996, 6, 12) // -> "８" ; zenkaku (wider display form)
kanjidate.format("{N:z,2}", 1996, 6, 12) // -> "０８"
kanjidate.format("{N:2,z}", 1996, 6, 12) // -> "０８" ; same as above
kanjidate.format("{N:g}", 1989, 1, 8) // -> "元" ; special form of first year (1 nen) 
kanjidate.format("{N:g}", 2016, 6, 12) // -> "28" ; no effect if it is not first year

// month
kanjidate.format("{M}", 2016, 6, 12) // -> "6"
kanjidate.format("{M:2}", 2016, 6, 12) // -> "06"
kanjidate.format("{M:z}", 2016, 6, 12) // -> "６"
kanjidate.format("{M:z,2}", 2016, 6, 12) // -> "０６"

// day
kanjidate.format("{D}", 2016, 6, 1) // -> "1"
kanjidate.format("{D:2}", 2016, 6, 1) // -> "01"
kanjidate.format("{D:z}", 2016, 6, 1) // -> "１"
kanjidate.format("{D:z,2}", 2016, 6, 1) // -> "０１"

// hour
kanjidate.format("{h}", 2016, 6, 1, 19, 4, 9) // -> "19"
kanjidate.format("{h:12}", 2016, 6, 1, 19, 4, 9) // -> "7" ; am/pm format
kanjidate.format("{h:12,2}", 2016, 6, 1, 19, 4, 9) // -> "07" ; am/pm format in 2 digits
kanjidate.format("{h:z}", 2016, 6, 1, 19, 4, 9) // -> "１９"

// minute
kanjidate.format("{m}", 2016, 6, 1, 19, 4, 9) // -> "4"
kanjidate.format("{m:2}", 2016, 6, 1, 19, 4, 9) // -> "04"
kanjidate.format("{m:z}", 2016, 6, 1, 19, 4, 9) // -> "４"
kanjidate.format("{m:z,2}", 2016, 6, 1, 19, 4, 9) // -> "０４"

// second
kanjidate.format("{s}", 2016, 6, 1, 19, 4, 9) // -> "9"
kanjidate.format("{s:2}", 2016, 6, 1, 19, 4, 9) // -> "09"
kanjidate.format("{s:z}", 2016, 6, 1, 19, 4, 9) // -> "９"
kanjidate.format("{s:z,2}", 2016, 6, 1, 19, 4, 9) // -> "０９"

// am/pm
kanjidate.format("{a}", 2016, 6, 1, 9, 4, 9) // -> "午前"
kanjidate.format("{a:am/pm}", 2016, 6, 1, 9, 4, 9) // -> "am"
kanjidate.format("{a:AM/PM}", 2016, 6, 1, 9, 4, 9) // -> "AM"
``

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