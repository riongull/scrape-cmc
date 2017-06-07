var fs = require('fs');
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var cheers = require('cheers');
var json2csv = require('json2csv');


// scrape history page for each available weekly data link
var url = 'https://coinmarketcap.com/historical/';
var historyLinks = [];
cmcData = {};

request(url, null , function(error, response, html) {

    var $ = cheerio.load(html, {ignoreWhitespace: true});
    var link = "";
    var links = [];
    var historyLink = false;

    $('a').each(function(i, elem) {
        link = $(this).attr('href');
        historyLink = (link && link.length === 21) ? true : false
        if (historyLink) { historyLinks.push('https://coinmarketcap.com'+link) }
    });
});

// scrape individual pages
var app = express();
app.get('/', function(req, res) {

    // for testing...
    historyLinks = historyLinks.slice(0,2);
    
    var config = {
        url: historyLinks,
        blockSelector: "tr",
        scrape: {
            // rank: {
            //     selector: 'td.text-center.sorting_1',
            //     extract: "text"
            // },  // giving "" for some reason
            currency: {
                selector: "td.no-wrap.currency-name > a",
                extract: "text"
            },
            symbol: {
                selector: "td.text-left",
                extract: "text"
            },
            marketcap: {
                selector: "td.no-wrap.market-cap.text-right",
                extract: "text"
            },
            price_usd: {
                selector: 'td:nth-child(5) > a',
                extract: "text"
            },
            supply: {
                selector: 'td:nth-child(6) > a',
                extract: "text"
            },
            volume: {
                selector: 'td:nth-child(7) > a',
                extract: "text"
            },
            change_1hr: {
                selector: 'td.no-wrap.percent-1h.positive_change.text-right',
                extract: "text"
            },
            change_1day: {
                selector: 'td:nth-child(9)',
                extract: "text"
            },
            change_1week: {
                selector: 'td:nth-child(10)',
                extract: "text"
            }
        }
    };

    cheers.scrape(config).then(function(results) {
        
        cmcData = results.reduce((data, arr, i) => {
            date = `${historyLinks[i].slice(-9, -1)}`;
            data[date] = arr.splice(1, arr.length);
            return data
        }, {});


        Object.keys(cmcData).map((i) => {
            cmcData[i].map((o) => {
                Object.keys(o).map((i) => {
                    o[i] = o[i].trim();
                });
            });
        });

        // write out to console and browser
        console.log('fields', Object.keys(config.scrape));
        console.log('historyLinks', historyLinks);
        console.log('historyLinks[1]', historyLinks[1]);
        console.log('cmcData:', cmcData)
        console.log('cmcData["20130428"]:', cmcData['20130428']);
        console.log('cmcData[first element]', cmcData[Object.keys(cmcData)[0]]);
        console.log('JSON data', JSON.stringify(cmcData[Object.keys(cmcData)[0]],null,2));

        // write out to csv file
        var csv = json2csv({ 
            fields: Object.keys(config.scrape),
            data: JSON.stringify(cmcData[Object.keys(cmcData)[0]])
        });

        fs.writeFile('scrape_cmc.csv', csv, function(err) {
            if (err) throw err;
            console.log('file saved');
        });

    // catch errors in express server
    }).catch((error) => {
        console.error(error);
    });
    
    res.send(cmcData);
    
});

app.listen('3000');
console.log('cheers is listening on port 3000');
exports = module.exports = app;