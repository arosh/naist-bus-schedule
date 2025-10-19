# NAIST Bus Schedule

http://www.naist.jp/accessmap/

## How to contribute

### I noticed that the timetable is out of date.

Your contribution is welcome.

### What should I do?

Edit the CSV files under [resources](./resources) directory. The first column in each row represents the hour, and the others represent the minutes. [#34](https://github.com/arosh/naist-bus-schedule/pull/34) is a good example.

### Why does the original author use such a ridiculous CSV format?

Well... Nara Kotsu's latest system provides timetable data in PDF format, whereas the previous system provided it in an HTML table format. In those days, HTML tables could be converted to machine-readable CSVs by formatting them in Excel or Google Spreadsheets. It was the easiest way to obtain machine-readable timetable data without complicated parsing programs. Since Nara Kotsu upgraded the timetable system, the original author understands that this format is no longer useful.

### Should I include `data.json` in the PR?

No. [#32](https://github.com/arosh/naist-bus-schedule/pull/34) includes `data.json` in the PR, but it is no longer needed. GitHub Actions now automatically generate it.

### Can I run the end-to-end tests locally?

Yes. First install browser binaries with `npx playwright install`, then launch the suite with `npm run e2e`. The command spins up the Vite dev server on port 3000 automatically and runs the Playwright checks headlessly.

## Progressive Web App

The production build now bundles a service worker through `vite-plugin-pwa` so the timetable keeps working offline. Run `npm run build` followed by `npm run preview -- --host 0.0.0.0 --port 4173` to inspect the generated PWA locally, and use your browser's Application panel to unregister the service worker when testing changes.

## Contributors

* [@speedcell4](https://github.com/speedcell4) added timetables between Tomigaoka station and NAIST.
* [@keichi](https://github.com/keichi) updated the timetable to the latest in Apr. 2020.
* [@kumahika](https://github.com/kumahika) updated the timetable to the latest in Jun. 2020.
* [@tsubakittr](https://github.com/tsubakittr) updated the timetable to the latest in Nov. 2021.
* [@lfyao](https://github.com/lfyao) fixed mistakes in the timetables.
* [@JosephAyo](https://github.com/JosephAyo) updated the timetable to the latest.

## License

* This software is released under the MIT license. See [LICENSE](./LICENSE).
* Icons made by [Freepik](http://www.freepik.com) from [www.flaticon.com](http://www.flaticon.com) are licensed under [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/).
