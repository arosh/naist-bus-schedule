# NAIST Bus Schedule

http://www.naist.jp/accessmap/

## How to contribute

### I notice that the timetable is out of date.

Your contribution is welcome.

### What should I do?

Edit CSV files under [resources](https://github.com/arosh/naist-bus-schedule/tree/master/resources) directory. The first column in each row means hour, and the others mean minutes. [#34](https://github.com/arosh/naist-bus-schedule/pull/34) is one of good examples.

### Why you use such a ridiculous format?

Well... Nara Kotsu's latest system provides timetable data in PDF format, whereas the previous system provided them in HTML table format. In those days, HTML tables could be converted to machine-readable CSVs by formatting them in Excel or Google Spreadsheets. It was the easiest way to obtain machine-readable timetable data without complicated parsing programs. Since Nara Kotsu has upgraded the timetable system, the original author understands that this format is no longer useful.

## License

* Icons made by [Freepik](http://www.freepik.com) from [www.flaticon.com](http://www.flaticon.com) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/).
