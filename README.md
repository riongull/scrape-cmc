# Scrape CMC
This tool scrapes coinmarketcap.com's historical (weekly) data

### Usage
1. `git clone https://github.com/riongull/scrape-cmc.git`
2. `cd scrape-cmc`
3. `yarn install` or `npm install`
4. `node scrape_cmc.js` (use node v8 or above)

### Notes
* This scraper works but probably still has some bugs
* Test by uncommenting `historyLinks = historyLinks.slice(0,2)` in `scrape_cmc.js`
* Full scraping takes several minutes (I haven't coded a progress bar in, be patient)

##### Scraping libraries
* https://github.com/fallanic/cheers
* https://github.com/rchipka/node-osmosis
* https://github.com/ruipgil/scraperjs
* https://github.com/nemo/scrape
* https://github.com/scrapy/scrapy (python, for reference)

##### Parsing tools
* https://www.npmjs.com/package/json2csv
* http://papaparse.com/demo

##### Tutorial
* https://scotch.io/tutorials/scraping-the-web-with-node-js
