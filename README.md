# kanjidate

A small Javascript library that 1) formats date in Japanese and 2) converts dates between Gregorian calendar and Japanese calendar.

## Install

### node.js

```
npm install kanjidate
```

in Javascript source

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

### Predefined format

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

// youbi (day of week)
kanjidate.format("{W}", 2016, 6, 14) // -> "火"
kanjidate.format("{W:1}", 2016, 6, 14) // -> "火" ; same as above
kanjidate.format("{W:2}", 2016, 6, 14) // -> "火曜"
kanjidate.format("{W:3}", 2016, 6, 14) // -> "火曜日"
kanjidate.format("{W:alpha}", 2016, 6, 14) // -> "Tuesday"

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
```

### Gregorian calendar to Japanese calendar

```js
kanjidate.toGengou(2016, 6, 30) // -> {gengou: "平成", nen: 28}
```

### Japanese calendar to Gregorian calendar

```js
kanjidate.fromGengou("平成", 28) // -> 2016
```

### Japanese day of week

```js
kanjidate.toYoubi(0) // -> "日" ; Sunday
kanjidate.toYoubi(1) // -> "月" ; Monday
kanjidate.toYoubi(2) // -> "火" ; Tuesday
kanjidate.toYoubi(3) // -> "水" ; Wednesday
kanjidate.toYoubi(4) // -> "木" ; Thursday
kanjidate.toYoubi(5) // -> "金" ; Friday
kanjidate.toYoubi(6) // -> "土" ; Saturday
```

## Background

In Japan, currently two calendar systems are mainly used. One system is the Gregorian calendar, which is also used world wide. 
Another system is the traditional Japanese calendar system, which is based on the reigns of emperor and is used only in Japan. 
Historically, Japan had been using lunar calendar as in other East Asian countries, but had changed to the Gregorian
calendar at Jan 1, 1873. This library handles dates after this epoch. Japanese calendar specifies a year with the pair of _gengou_ and _nen_. _gengou_ is the name of the era, and _nen_ is the counting of the year in that era. For example, Gregorian year 2016 corresponds to Heisei 28 nen (that is, 28th year in the Heisei era). Representations of months and days are the same as in the Gregorian calendar. 

There are four eras after Jan 1, 1873. That is "明治" (Meiji), "大正" (Taishou), "昭和" (Shouwa) and "平成" (Heisei). Their starting dates are:

* "明治" (Meiji) 6 nen corresponds to the Gregorian year 1873.
* "大正" (Taishou) starts at Jul 30, 1912
* "昭和" (Shouwa) starts at Dec 25, 1926
* "平成" (Heisei) starts at Jan 8, 1989

Period from the starting date to the end of that year is the first _nen_. For example, Jan 7, 1989 is the last day in the "昭和" (Shouwa) era (Shouwa 64 nen), and Jan 8, 1989 is the first day in "平成" (Heisei) era (Heisei 1 nen). The whole year 1990 (Jan 1, 1990 - Dec 31, 1990) is Heisei 2 nen. The first nen (1 nen) is also called "元年" ("元" meaning 'origin', and "年" meaning 'year').

## Convert the Gregorian year to Japanese _gengou_ and _nen_

```js
// toGengou(year, month day) -- returns an object with properties of gengou and nen
toGengou(2016, 6, 30) // -> {gengou: "平成", nen: 28}
toGengou(1909, 1, 7)  // -> {gengou: "昭和", nen: 64}
toGengou(1909, 1, 8)  // -> {gengou: "平成", nen: 1}
toGengou(1910, 1, 1)  // -> {gengou: "平成", nen: 2}
toGengou(1911, 1, 1)  // -> {gengou: "平成", nen: 3}
```

## Convert Japanese _gengou_and _nen_ to Gregorian year

```js
// fromGengou(gengou, nen) -- returns a number (Gregorian year)
fromGengou("平成", 28) // -> 2016
```

## Convert day of week to Japanese

```js
// toYoubi(dayOfWeek) -- returns a character that corresponds to dayOfWeek (indicated by number)
//                       Sunday: 0, Monday: 1, ... Saturday: 6
toYoubi(0) // "日" (Sunday)
toYoubi(1) // "月" (Monday)
toYoubi(6) // "月" (Saturday)
```

Japanese characters that represent day of week are: "日" (Sunday), "月" (Monday), "火" (Tuesday), "水" (Wednesday), "木" (Thursday), "金" (Friday) and "土" (Saturday). 

Note: "日" is also used to indicate day in the month, and "月" is also used to indicate month. For example, Feb 3 is represented as "2月3日".

## Formatting

```js
// format() -- formats the current date with the default format
format() // -> "平成28年6月13日（月）"
```

Formatting of date in Japanese is conducted by ``format``. If called without arguments, ``format`` returns a string representing the current date in the default format. The default format consists of gengou ("平成") , nen ("28年"), month ("6月"), day ("13日") and day of week ("（月）").

```js
// format(dateArg) -- formats dateArg with the default format
format(new Date(2016, 6-1, 13)) // -> "平成28年6月13日（月）"
format("2016-06-13") // -> "平成28年6月13日（月）"
format("2016-06-13 22:53:26") // -> "平成28年6月13日（月）"
```

If called with one argument, `format` interprets the argument as date and formats the date with the default format. Acceptable arguments are as follows:

* a Javascript Date : its local time is used to construct the formatted string. In other words, Date class methods such as `getFullYear`, `getMonth`, ... are used to get the year, month, and other values.
* a string of the form "YYYY-MM-DD" or "YYYY-MM-DD hh:mm:ss" : values of year, month, ... are extracted from the string.

```js
// format(formatStr, ...) -- format the specified date according to formatStr
// format(formatStr, dateArg)
// format(formatStr, year, month, day[, hour, minute, second])
format("{G}{N}年{M}月{D}日（{W}） {h}時{m}分{s}秒", "2016-06-15 14:31:23") // -> "平成28年6月15日 14時31分23秒"
format("{G}{N}年{M}月{D}日（{W}） {a}{h:12}時{m}分{s}秒", 2016, 6, 15, 14, 31, 23) // -> "平成28年6月15日 午後2時31分23秒"
```

If called with more than one arguments, `format` uses the first argument as the format string and the remaining arguments to identify the date. Details of format string are described in the following sections. In essence, various elements of the calendar system is indicated between curly braces, and other parts are output as it is. 

When there are only two arguments, the second argument is interpreted as the date to be formatted. It can be a Javascript Date object or a string. These arguments are handled as in the case when `format` is called with single argument.

The date can be specified by supplying year, month, ... as arguments. Hour, minute, second are optional and supposed to be zero if omitted.




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