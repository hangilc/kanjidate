.. kanjidate documentation master file, created by
   sphinx-quickstart on Wed Jun 08 14:47:14 2016.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

kanjidate API documentation
===========================

.. js:function:: toGengou(year, month, day)

	:param number year: Year in Gregorian calendar.
	:param number month: Month in Gregorian calendar.
	:param number day: Day in Gregorian calendar.
	:returns: The year in Japanese calendar ``{gengou: ..., nen: ...}`` that corresponds to Gregorian calendar.

	This function converts Gregorian calendar to Japanese calendar.

	.. code-block:: js

		toGengou(1957, 6, 2) // --> {gengou: "昭和", nen: 32}

	It should be noted that year, month and day in Gregorian calendar are neccesary to determine the corresponding Japanese year (pair of gengou and nen), since Japanese gengou (era) can start at the middle of a year.
	For example, gengou of Heisei (平成) starts at Jan 8, 1989. Therefore, Jan 8, 1989 corresponds to Heisei 1 nen (year); but Jan 7, 1989 corresponds to Shouwa (昭和) 64 nen.

	Date before Jan 1, 1873 (at which Japan adopted Gregorian calendar) is not supported. If it is called with such date, it returns with (non-existent) gengou of ``"西暦"`` (meaning "Western calendar" in Japanese) and nen of year (unmodified).

	.. code-block:: js

		toGengou(1873, 1, 1) // -> {gengou: "明治", nen: 1}
		toGengou(1872, 12, 31) // -> {gengou: "西暦", nen: 1982} 

	All arguments (year, month and day) are supposed to be integral number. Otherwise, results are unspecified.

.. js:function:: fromGengou(gengou, nen)
	
	:param string gengou: Gengou in Japanese calendar.
	:param number nen: Nen in Japanese calendar.
	:returns: The Gregorian year corresponding to the Japanese calendar.

	Gengou should be one of "平成" (Heisei), "昭和" (Shouwa), "大正" (Taishou), "明治" (Meiji) or "西暦" (Seireki).
	If gengou is "明治", nen should be 6 or greater; otherwise, return value is unspecified. "西暦" is not actually a valid gengou, and if supplied, the function returns nen as unmodified.

	.. code-block:: js

		fromGengou("平成", 28) // -> 2016)

	Nen is supposed to be a valid integral number; otherwise, returned value is unspecified.
